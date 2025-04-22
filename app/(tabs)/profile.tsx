import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
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
  const [newName, setNewName] = useState<string>('');
  const [newHeight, setNewHeight] = useState<string>('');
  const [newWeight, setNewWeight] = useState<string>('');
  const [newAge, setNewAge] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
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
          setLoading(false);
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
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    if (user?.name) {
      loadUserData();
    }
  }, [setUser, user?.name]);

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
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [newName, newHeight, newWeight, newAge, user?.email, stats, setUser]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/(auth)/signIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">Loading...</Text>
      </View>
    );
  }

  const calculateBMI = () => {
    const weight = parseFloat(user.weight ?? '') || 0;
    const heightCm = parseFloat(user.height ?? '') || 0;
    const heightM = heightCm / 100;
    return heightM > 0 ? (weight / (heightM * heightM)).toFixed(1) : 'N/A';
  };

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue)) return '';
    
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const getBMICategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'text-yellow-500';
      case 'Normal': return 'text-green-500';
      case 'Overweight': return 'text-orange-500';
      case 'Obese': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const bmiValue = calculateBMI();
  const bmiCategory = getBMICategory(bmiValue);
  const bmiCategoryColor = getBMICategoryColor(bmiCategory);


  return (
    <SafeAreaView className="flex-1 bg-gray-100">
    <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20}}>
      
      <View className="items-center pt-10 pb-6">
        {user.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            className="w-28 h-28 rounded-full"
          />
        ) : (
          <View className="w-32 h-32 rounded-full bg-blue-500 justify-center items-center shadow-lg">
                <Text className="text-white text-4xl font-bold">
                  {user?.name
                    ?.split(' ')
                    .map((part) => part[0].toUpperCase())
                    .join('')}
                </Text>
              </View>
        )} 
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="absolute top-32 right-1/2 mr-[-60px] p-3 rounded-full shadow-md"
              >
                <Image
                  source={require('../../assets/icons/edit.png')}
                  className="h-6 w-6"
                />
              </TouchableOpacity>
              <Text className="text-xl font-semibold mt-4">{user?.name || 'Guest'}</Text>
              <Text className="text-gray-500">{user?.email || 'guest@example.com'}</Text>

            </View>

        <View className="mt-10">
          <Text className="text-2xl font-bold mb-6 text-gray-800">Current Stats</Text>
          
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4 bg-white rounded-2xl shadow-md overflow-hidden">
              <View className="p-4">
                <Text className="text-lg font-medium text-gray-700">Weight</Text>
                <View className="flex-row items-baseline mt-2">
                  <Text className="text-2xl text-blue-500 font-bold">
                    {user.weight || '0'}
                  </Text>
                  <Text className="ml-1 text-blue-500 font-medium">kg</Text>
                </View>
              </View>
            </View>
            
            <View className="w-[48%] mb-4 bg-white rounded-2xl shadow-md overflow-hidden">
              <View className="p-4">
                <Text className="text-lg font-medium text-gray-700">Height</Text>
                <View className="flex-row items-baseline mt-2">
                  <Text className="text-2xl text-blue-500 font-bold">
                    {user.height || '0'}
                  </Text>
                  <Text className="ml-1 text-blue-500 font-medium">cm</Text>
                </View>
              </View>
            </View>

            <View className="w-[48%] mb-4 bg-white rounded-2xl shadow-md overflow-hidden">
              <View className="p-4">
                <Text className="text-lg font-medium text-gray-700">Age</Text>
                <View className="flex-row items-baseline mt-2">
                  <Text className="text-2xl text-blue-500 font-bold">
                    {user.age || '0'}
                  </Text>
                  <Text className="ml-1 text-blue-500 font-medium">years</Text>
                </View>
              </View>
            </View>

           <View className="w-[48%] mb-4 bg-white rounded-2xl shadow-md overflow-hidden">
              <View className="p-4">
                <Text className="text-lg font-medium text-gray-700">BMI</Text>
                <View className="flex-row items-baseline mt-2">
                  <Text className="text-2xl text-blue-500 font-bold">
                    {bmiValue}
                  </Text>
                  {bmiCategory && (
                    <Text className={`ml-1 ${bmiCategoryColor} text-sm font-medium`}>
                      ({bmiCategory})
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          
          {/* BMI Description */}
          <View className="mt-2 mb-4 bg-white rounded-2xl shadow-md overflow-hidden">
            <View className="p-5">
              <Text className="text-lg font-medium text-gray-700 mb-2">BMI Information</Text>
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                <Text className="text-gray-600">Underweight: BMI less than 18.5</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <Text className="text-gray-600">Normal: BMI between 18.5 and 24.9</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                <Text className="text-gray-600">Overweight: BMI between 25 and 29.9</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <Text className="text-gray-600">Obese: BMI 30 or greater</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6 mb-20 items-center">
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-blue-500 py-3 px-8 rounded-xl shadow-md"
          >
            <Text className="text-white font-semibold text-lg">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
       <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-30">
            <View className="bg-white p-6 rounded-xl w-5/6 shadow-xl">
              <Text className="text-xl font-bold mb-4">Edit Profile</Text>
              
              {[
                { label: 'Name', value: newName, setValue: setNewName },
                { label: 'Height (cm)', value: newHeight, setValue: setNewHeight },
                { label: 'Weight (kg)', value: newWeight, setValue: setNewWeight },
                { label: 'Age', value: newAge, setValue: setNewAge },
              ].map(({ label, value, setValue }) => (
                <View key={label} className="mb-4">
                  <Text className="text-gray-700 mb-1">{label}</Text>
                  <TextInput
                    value={value}
                    onChangeText={(text) => setValue(text)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#A9A9A9"
                    keyboardType={
                      label !== 'Name' ? 'numeric' : 'default'
                    }
                    className="p-4 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </View>
              ))}

              <View className="flex-row justify-end mt-6 space-x-4">
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  className="py-3 px-5"
                >
                  <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSave}
                  className="bg-blue-500 py-3 px-6 rounded-lg shadow"
                >
                  <Text className="text-white font-medium">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;