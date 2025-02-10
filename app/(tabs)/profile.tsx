import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { db } from '@/firebaseConfig';
import {
  setDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';

type Stat = {
  key: string;
  Name: string;
  metrics: string;
  Value: number;
};

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState<string>(user?.name || '');
  const [newHeight, setNewHeight] = useState<string>(user?.height || '');
  const [newWeight, setNewWeight] = useState<string>(user?.weight || '');
  const [newAge, setNewAge] = useState<string>(user?.age || '');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const statsCollection = collection(db, 'stats');
    const unsubscribe = onSnapshot(statsCollection, (querySnapshot) => {
      const stats: Stat[] = [];
      querySnapshot.forEach((documentSnapshot) => {
        stats.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setStats(stats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('userName');
        if (savedName && savedName !== user?.name) {
          setUser((prevState) => ({
            ...prevState,
            name: savedName,
          }));
        }
      } catch (error) {}
    };

    if (user?.name) {
      loadUserData();
    }
  }, [setUser, user?.name]);

  const getInitials = (name: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0].toUpperCase())
      .join('');
  };

  const handleSave = useCallback(async () => {
    if (!user?.email) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.email);

      await setDoc(
        userRef,
        {
          name: newName.trim(),
          height: newHeight.trim(),
          weight: newWeight.trim(),
          age: newAge.trim(),
        },
        { merge: true }
      );

      setUser((prevState) => ({
        ...prevState,
        name: newName.trim(),
        height: newHeight.trim(),
        weight: newWeight.trim(),
        age: newAge.trim(),
      }));

      await AsyncStorage.multiSet([
        ['userName', newName.trim()],
        ['userHeight', newHeight.trim()],
        ['userWeight', newWeight.trim()],
        ['userAge', newAge.trim()],
      ]);

      stats.forEach(async (stat) => {
        const statRef = doc(db, 'stats', stat.key);
        let updatedValue = '';

        if (stat.Name.toLowerCase() === 'height') {
          updatedValue = newHeight.trim();
        } else if (stat.Name.toLowerCase() === 'weight') {
          updatedValue = newWeight.trim();
        } else if (stat.Name.toLowerCase() === 'age') {
          updatedValue = newAge.trim();
        }

        if (updatedValue !== '') {
          await updateDoc(statRef, { Value: updatedValue });
        }
      });

      setModalVisible(false);
    } catch (error) {}
  }, [newName, newHeight, newWeight, newAge, user?.email, stats, setUser]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push('/(auth)/signIn');
    } catch (error) {}
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View className="justify-start items-center p-4 py-10">
          <View className="flex-row items-center w-full justify-between px-6 mt-6">
            <View className="w-16 h-16 rounded-full bg-blue-500 justify-center items-center">
              <Text className="text-white text-lg font-rubik-bold">
                {getInitials(user?.name || '')}
              </Text>
            </View>
            <Text className="text-xl font-rubik-semibold flex-1 ml-4">
              {user?.name || 'Guest'}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="p-2 rounded-xl"
            >
              <Image
                source={require('../../assets/icons/edit.png')}
                className="h-8 w-8"
              />
            </TouchableOpacity>
          </View>
          <View className="py-6">
            <FlatList
              horizontal
              data={stats}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <View className="w-36 mx-2 h-24 bg-white rounded-lg border border-gray-300 p-4 justify-center items-center">
                  <Text className="text-base text-gray-600">
                    {item.Value} {item.metrics}
                  </Text>
                  <Text className="text-lg font-rubik">{item.Name}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full p-4 bg-white">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 p-3 rounded-lg w-full"
        >
          <Text className="text-white text-center text-lg">Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-slate-400 bg-opacity-50 backdrop-blur-xl">
          <View className="bg-white p-6 rounded-lg w-80">
            {[
              ['Name', newName, setNewName],
              ['Height', newHeight, setNewHeight],
              ['Weight', newWeight, setNewWeight],
              ['Age', newAge, setNewAge],
            ].map(([label, value, setValue]) => (
              <View key={label} className="flex-row items-center mb-4">
                <Text className="w-20 text-gray-700">{label}:</Text>
                <TextInput
                  value={value}
                  onChangeText={setValue}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </View>
            ))}

            <View className="flex justify-center items-center w-full">
              <TouchableOpacity
                onPress={handleSave}
                className="bg-blue-500 p-3 rounded-lg w-24 mb-4"
              >
                <Text className="text-white text-center">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-red-500 p-3 rounded-lg w-24"
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
