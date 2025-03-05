import { auth, db } from '@/firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import {
  Alert,
  View,
  Text,
  Modal,
  TextInput,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DayItem {
  date: string;
  dayNumber: string;
  dayName: string;
}
interface Workout {
  id: string;
  name: string;
  duration: string;
}
const Home = () => {
  const { width, height } = useWindowDimensions();
  const { user, setUser } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [weekDays, setWeekDays] = useState<DayItem[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editWorkout, setEditWorkout] = useState<Workout | null>(null);

  const openEditModal = (workout: Workout) => {
    setEditWorkout(workout);
    setEditModalVisible(true);
  };

  const saveWorkoutEdit = async () => {
    if (!editWorkout) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const workoutRef = doc(db, 'user', user.uid, 'workouts', editWorkout.id);
      await updateDoc(workoutRef, {
        name: editWorkout.name,
        duration: editWorkout.duration,
      });

      setEditModalVisible(false);
      console.log('✅ Workout updated successfully!');
    } catch (error) {
      console.error('❌ Error updating workout:', error);
    }
  };
  const deleteWorkout = async (workoutId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      Alert.alert(
        'Delete Workout',
        'Are you sure you want to delete this workout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const workoutRef = doc(
                db,
                'user',
                user.uid,
                'workouts',
                workoutId
              );
              await deleteDoc(workoutRef);
              console.log('✅ Workout deleted successfully!');
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error deleting workout:', error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const todayStart = dayjs().startOf('day').toDate(); // Start of today
    const todayEnd = dayjs().endOf('day').toDate(); // End of today

    const q = query(
      collection(db, 'user', user.uid, 'workouts'),
      where('date', '>=', todayStart),
      where('date', '<=', todayEnd) // Fetch only today's workouts
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedWorkouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];

      setWorkouts(fetchedWorkouts);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  useEffect(() => {
    generateWeekDays();
  }, []);

  const generateWeekDays = () => {
    const startOfWeek = dayjs().startOf('week');
    const days = Array.from({ length: 7 }).map((_, index) => {
      const day = startOfWeek.add(index, 'day');
      return {
        date: day.format('YYYY-MM-DD'),
        dayNumber: day.format('D'),
        dayName: day.format('ddd').toUpperCase(),
      };
    });

    setWeekDays(days);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadUserData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('userName');
        const savedAvatar = await AsyncStorage.getItem('userAvatar');

        const authUser = auth.currentUser;
        if (!authUser) return;

        const defaultName = savedName || authUser.displayName || 'User';
        const defaultAvatar = savedAvatar || authUser.photoURL || null;
        const initials = defaultAvatar
          ? null
          : defaultName
              .split(' ')
              .map((part) => part[0].toUpperCase())
              .join('');

        setUser((prevState) => ({
          ...prevState,
          name: defaultName,
          email: authUser.email || '',
          avatar: defaultAvatar,
          initials,
        }));

        if (authUser.email) {
          const userRef = doc(db, 'users', authUser.email);
          unsubscribe = onSnapshot(
            userRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const updatedData = docSnap.data();

                setUser((prevState) => ({
                  ...prevState,
                  name: updatedData.name || prevState.name,
                  avatar: updatedData.avatar || prevState.avatar,
                  initials: updatedData.avatar
                    ? null
                    : (updatedData.name || prevState.name)
                        .split(' ')
                        .map((part: string) => part[0].toUpperCase())
                        .join(''),
                }));

                if (updatedData.name && updatedData.name !== savedName) {
                  AsyncStorage.setItem('userName', updatedData.name);
                }
                if (updatedData.avatar && updatedData.avatar !== savedAvatar) {
                  AsyncStorage.setItem('userAvatar', updatedData.avatar);
                }
              }
            },
            (error) => {
              console.error('Firestore subscription error:', error);
            }
          );
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setUser]);

  const items = [
    { name: 'Calories', value: '1,500 kcal' },
    { name: 'Carbs', value: '200 g' },
    { name: 'Protein', value: '100 g' },
    { name: 'Fat', value: '50 g' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="mt-4 px-4 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-800">
              Welcome back, {user.name}!
            </Text>
          </View>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-blue-500 justify-center items-center mr-3">
              <Text className="text-white font-semibold text-lg">
                {user.initials || ''}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-7 items-center">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {dayjs(selectedDate).format('MMMM YYYY')}
          </Text>

          <FlatList
            data={weekDays}
            keyExtractor={(item) => item.date}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => {
              const isSelected = item.date === selectedDate;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.date)}
                  className="items-center mx-2"
                >
                  <Text className="text-xs text-gray-500 font-semibold">
                    {item.dayName}
                  </Text>
                  <View
                    className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                      isSelected ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-lg font-bold ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {item.dayNumber}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="w-6 h-1 bg-blue-500 mt-1 rounded-full" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View className="mt-6">
          <Text className="text-xl font-semibold text-gray-800 px-4 mb-6">
            Today's Workout
          </Text>

          {workouts.length === 0 ? (
            <Text className="text-gray-500 text-center mt-4">
              No workouts added yet.
            </Text>
          ) : (
            <FlatList
              data={workouts}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  onLongPress={() => deleteWorkout(item.id)}
                  className="mr-4"
                >
                  <View className="w-40 h-48 bg-blue-100 rounded-xl p-4 shadow-md">
                    <View className="w-16 h-16 bg-white rounded-full mx-auto mt-2 flex items-center justify-center">
                      <Image
                        source={require('../../assets/icons/dumbell.png')}
                        className="h-8 w-8"
                      />
                    </View>

                    <Text className="text-gray-500 text-xs text-center mt-2">
                      {item.duration}
                    </Text>
                    <Text className="text-gray-800 text-lg font-semibold text-center mt-2">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          <Modal
            visible={isEditModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
              <View className="bg-white p-6 rounded-lg w-4/5">
                <Text className="text-lg font-bold text-gray-800">
                  Edit Workout
                </Text>

                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-lg text-gray-800 mt-4"
                  placeholder="Workout Name"
                  value={editWorkout?.name || ''}
                  onChangeText={(text) =>
                    setEditWorkout((prev) =>
                      prev ? { ...prev, name: text } : prev
                    )
                  }
                />

                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-lg text-gray-800 mt-4"
                  placeholder="Duration"
                  value={editWorkout?.duration || ''}
                  onChangeText={(text) =>
                    setEditWorkout((prev) =>
                      prev ? { ...prev, duration: text } : prev
                    )
                  }
                />

                <TouchableOpacity
                  onPress={saveWorkoutEdit}
                  className="bg-blue-500 p-3 rounded-lg mt-4"
                >
                  <Text className="text-white text-center text-lg">
                    Save Changes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  className="mt-2 p-3"
                >
                  <Text className="text-gray-600 text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
