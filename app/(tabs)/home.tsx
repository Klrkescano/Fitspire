import { auth, db } from '@/firebaseConfig';
import {
  onSnapshot,
  doc,
} from 'firebase/firestore';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeeklyCalendarComponent from '../components/homeScreenComponents/WeeklyCalendarComponent';
import WorkoutSection from '../components/homeScreenComponents/WorkoutSection';
import EditModal from '../components/homeScreenComponents/EditModal';
import { Workout } from '@/.types/types';

interface DayItem {
  date: string;
  dayNumber: string;
  dayName: string;
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

        <View className="mt-10 px-6 space-y-4">
          <Text className="text-xl font-bold text-gray-800">
            Weekly Plan
          </Text>
          <View className='bg-white p-4 rounded-2xl shadow-sm space-y-4'>
            
        {/* Weekly Calendar section */}
        <WeeklyCalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          weekDays={weekDays}
          workouts={workouts}
          isLoading={isLoading} onWorkoutPress={function (workout: Workout): void {
            throw new Error('Function not implemented.');
          } } onWorkoutLongPress={function (workoutId: string): void {
            throw new Error('Function not implemented.');
          } }          

        />
        {/* Todays Workout Section */}
        <WorkoutSection/>
        </View>
        </View>


      </ScrollView>
          {/* Edit MOdal */}
          <EditModal 
          isVisible={false}
          onClose={function (): void {
        throw new Error('Function not implemented.');
      } } onSave={function (workout: Workout): void {
        throw new Error('Function not implemented.');
      } } workout={null}          />
      
    </SafeAreaView>
  );
};

export default Home;
