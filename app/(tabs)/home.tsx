import { auth, db } from '@/firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
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
  StatusBar,
  ActivityIndicator,
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
  date: Timestamp;
}
const Home = () => {
  const { width, height } = useWindowDimensions();
  const { user, setUser } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [weekDays, setWeekDays] = useState<DayItem[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    const fetchWorkoutsForDate = async () => {
      setIsLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    const selectedDateStart = dayjs(selectedDate).startOf('day').toDate();
    const selectedDateEnd = dayjs(selectedDate).endOf('day').toDate();


    const q = query(
      collection(db, 'user', user.uid, 'workouts'),
      where('date', '>=', selectedDateStart),
      where('date', '<=', selectedDateEnd)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedWorkouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];

      setWorkouts(fetchedWorkouts);
      setIsLoading(false);
    });

    return () => unsubscribe(); 
  };
  
      fetchWorkoutsForDate();
    }, [selectedDate]);

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <ScrollView className="flex-1">
        <View className="mt-6 px-6 flex-row items-center justify-between">
          <View>
            <Text className="text-2x1 font-bold text-gray-800">
              {/* EDIT????? */}
              Welcome back, {user.name}!
            </Text>
          </View>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              className="w-16 h-12 rounded-full"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-blue-500 justify-center items-center">
              <Text className="text-white font-bold text-xl">
                {user.initials || ''}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-10 mb-2 px-6">
          <Text className="text-xl font-bold text-gray-800">
            Weekly Plan
          </Text>
        </View>

        {/* Weekly Calendar section */}
        <View className="mb-4 bg-white rounded-3xl mx-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mt-6 mb-4 px-6">
            {dayjs(selectedDate).format('MMMM YYYY')}
          </Text>

          <FlatList
            data={weekDays}
            keyExtractor={(item) => item.date}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
            renderItem={({ item }) => {
              const isSelected = item.date === selectedDate;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.date)}
                  className="items-center mx-3"
                >
                  <Text className="text-sm text-gray-500 font-semibold mb-2">
                    {item.dayName}
                  </Text>
                  <View
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
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
                    <View className="w-8 h-1 bg-blue-500 mt-2 rounded-full" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
      
        <View className="mt-4 px-6 pb-6">
          <Text className="text-lg font-semibold text-gray-700 mb-3">
          Workouts for {dayjs(selectedDate).format('MMM D')}
          </Text>

          {isLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" className="py-6" />
            ) : workouts.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-gray-500 text-center">
                  No workouts scheduled for this day
                </Text>
                <TouchableOpacity className="mt-4 bg-blue-500 px-5 py-2 rounded-lg">
                  <Text className="text-white font-medium">Add Workout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              workouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  onPress={() => openEditModal(workout)}
                  onLongPress={() => deleteWorkout(workout.id)}
                  className="flex-row items-center bg-blue-50 rounded-xl p-4 mb-3"
                >
                  <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-4">
                      <Image
                        source={require('../../assets/icons/dumbell.png')}
                        className="h-6 w-6"
                      />
                    </View>

            <View className="flex-1">
            <Text className="font-semibold text-gray-800 text-lg">
                      {workout.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {workout.duration}
                    </Text>
                  </View>
                  <TouchableOpacity className="h-8 w-8 items-center justify-center">
                    <Text className="text-gray-400 text-xl">›</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
        {/* Today's Workout section */}
        <View className="mt-4 mb-20">
          <Text className="text-xl font-bold text-gray-800 px-6 mb-4">
            Today's Workout
          </Text>

          {workouts.length === 0 && selectedDate === dayjs().format('YYYY-MM-DD') ? (
            <View className="bg-white mx-4 rounded-2xl p-12 shadow-sm items-center">
              <Image
                source={require('../../assets/icons/dumbell.png')}
                className="h-16 w-16 opacity-50 mb-4"
              />
              <Text className="text-gray-500 text-center text-lg">
                No workouts added for today
              </Text>
              <TouchableOpacity className="mt-4 bg-blue-500 px-6 py-3 rounded-xl">
                <Text className="text-white font-semibold">Add Workout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={workouts}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  onLongPress={() => deleteWorkout(item.id)}
                  className="mr-5"
                >
                  <View className="w-48 h-56 bg-blue-100 rounded-2xl p-6 shadow-md">
                    <View className="w-20 h-20 bg-white rounded-full mx-auto mt-2 flex items-center justify-center shadow-sm">
                      <Image
                        source={require('../../assets/icons/dumbell.png')}
                        className="h-10 w-10"
                      />
                    </View>

                    <Text className="text-gray-500 text-sm text-center mt-4">
                      {item.duration}
                    </Text>
                    <Text className="text-gray-800 text-xl font-bold text-center mt-2">
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-8 rounded-3xl w-5/6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              Edit Workout
            </Text>

            <TextInput
              className="border border-gray-300 rounded-xl p-4 text-lg text-gray-800 mb-4"
              placeholder="Workout Name"
              value={editWorkout?.name || ''}
              onChangeText={(text) =>
                setEditWorkout((prev) =>
                  prev ? { ...prev, name: text } : prev
                )
              }
            />

                <TextInput
                  className="border border-gray-300 rounded-xl p-4 text-lg text-gray-800 mb-6"
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
                  className="bg-blue-500 p-4 rounded-xl mb-3"
                >
                  <Text className="text-white text-center text-lg font-semibold">
                    Save Changes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  className="p-4"
                >
                  <Text className="text-gray-600 text-center font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
    </SafeAreaView>
  );
};

export default Home;
