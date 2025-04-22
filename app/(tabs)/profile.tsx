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
  TouchableWithoutFeedback,
  Keyboard,
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
type FitStat = {
  name: string;
  value: number;
  metrics: string;
  key: string;
};

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [fitstats, setFitStats] = useState<FitStat[]>([]);
  const { user, setUser } = useUser();
  const [newName, setNewName] = useState<string>('');
  const [newHeight, setNewHeight] = useState<string>('');
  const [newWeight, setNewWeight] = useState<string>('');
  const [newAge, setNewAge] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setNewName(user.name || '');
      setNewHeight(user.height || '');
      setNewWeight(user.weight || '');
      setNewAge(user.age || '');
    }
  }, [user]);

  useEffect(() => {
    const statsCollection = collection(db, 'stats');

    const unsubscribe = onSnapshot(
      statsCollection,
      (querySnapshot) => {
        try {
          const statsData: Stat[] = [];
          querySnapshot.forEach((documentSnapshot) => {
            statsData.push({
              ...(documentSnapshot.data() as Stat),
              key: documentSnapshot.id,
            });
          });
          setStats(statsData);
          setLoading(false);
        } catch (error) {
          console.error('Error processing Firestore snapshot:', error);
        }
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        setLoading(false);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from Firestore:', error);
      }
    };
  }, []);

  useEffect(() => {
    const fitstatsCollection = collection(db, 'fitstats');

    const unsubscribe = onSnapshot(
      fitstatsCollection,
      (querySnapshot) => {
        try {
          const fitstatsData: FitStat[] = [];
          querySnapshot.forEach((documentSnapshot) => {
            fitstatsData.push({
              ...(documentSnapshot.data() as FitStat),
              key: documentSnapshot.id,
            });
          });
          setFitStats(fitstatsData);
          setLoading(false);
        } catch (error) {
          console.error('Error processing Firestore snapshot:', error);
        }
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        setLoading(false);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from Firestore:', error);
      }
    };
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
      router.replace('/(auth)/signIn');
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

  const items = [
    { name: 'Statistics', icons: require('../../assets/icons/info.png') },
    { name: 'Exercises', icons: require('../../assets/icons/run.png') },
    { name: 'Measurements', icons: require('../../assets/icons/filter.png') },
    { name: 'Calendar', icons: require('../../assets/icons/calendar.png') },
  ];

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View className="justify-start items-center p-4 py-12 mb-12">
          <View className="flex-1 items-center w-full justify-between mb-6 px-6 mt-6">
            <View className="w-36 h-36 rounded-full bg-slate-600 justify-center items-center mb-6">
              <View className="w-16 h-16 rounded-full  justify-center items-center">
                <Text className="text-white text-5xl font-bold">
                  {user?.name
                    ?.split(' ')
                    .map((part) => part[0].toUpperCase())
                    .join('')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="absolute -bottom-2 -right-2  p-3 rounded-xl"
              >
                <Image
                  source={require('../../assets/icons/edit.png')}
                  className="h-8 w-8"
                />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-rubik-semibold flex-1 ml-4">
              {user?.name || 'Guest'}
            </Text>
            <Text>{user?.email || 'guest@example.com'}</Text>
          </View>

          <View className="mt-6 px-7 w-full">
            <Text className="text-black text-2xl font-rubik-bold">
              Current Stats
            </Text>
            <View className="flex-row flex-wrap justify-between mt-4">
              {stats.map((item, index) => (
                <View
                  key={index}
                  className="w-[48%] aspect-square border border-gray-300 rounded-lg justify-center items-center mb-4 bg-gray-50"
                >
                  <Text className="text-gray-800 font-medium">{item.Name}</Text>
                  <Text className="text-blue-500 font-semibold mt-1">
                    {item.Value} {item.metrics}
                  </Text>
                </View>
              ))}

              <View className="w-[48%] aspect-square border border-gray-300 rounded-lg justify-center items-center mb-4 bg-gray-50">
                <Text className="text-gray-800 font-medium">BMI</Text>
                <Text className="text-blue-500 font-semibold mt-1">
                  {(() => {
                    const weight =
                      stats.find((item) => item.Name === 'Weight')?.Value || 0;
                    const heightCm =
                      stats.find((item) => item.Name === 'Height')?.Value || 0;
                    const heightM = heightCm / 100;
                    return heightM > 0
                      ? (weight / (heightM * heightM)).toFixed(1)
                      : 'N/A';
                  })()}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-7 w-full ">
            <Text className="text-black text-2xl font-rubik-bold">
              Current Goal
            </Text>
            <View className="flex-row flex-wrap justify-between mt-4 ">
              <Text className="font-rubik text-lg">Lose 5kg in 2 months</Text>
            </View>
            <View className="flex-row flex-wrap justify-between mt-10 ">
              {items.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row w-[48%] p-3 border border-gray-300 rounded-lg justify-center items-center mb-4 bg-gray-50"
                >
                  <Image source={item.icons} className="w-8 h-8 mr-3 " />
                  <Text className="text-gray-800 font-medium">{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={handleLogout}>
              <Text className="text-blue-500 font-bold text-lg mt-10">
                {' '}
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
       <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center">
            <View className="bg-white p-6 rounded-lg" style={{ width: '80%' }}>
              {[
                { label: 'Name', value: newName, setValue: setNewName },
                { label: 'Height', value: newHeight, setValue: setNewHeight },
                { label: 'Weight', value: newWeight, setValue: setNewWeight },
                { label: 'Age', value: newAge, setValue: setNewAge },
              ].map(({ label, value, setValue }) => (
                <View key={label} className="flex-row items-center mb-4">
                  <Text className="w-20 text-gray-700">{label}:</Text>
                  <TextInput
                    value={value}
                    onChangeText={(text) => setValue(text)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#A9A9A9"
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
        </TouchableWithoutFeedback>
      </View>
      </Modal>
      </View>

  );
};

export default Profile;
