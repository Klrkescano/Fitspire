import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext';
import { Tabs } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabsLayout = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [workout, setWorkout] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    loadWorkouts();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Load workouts from AsyncStorage
  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error('Failed to load workouts', error);
    }
  };

  // Save workouts to AsyncStorage
  const saveWorkouts = async (updatedWorkouts: { [key: string]: string[] }) => {
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Failed to save workouts', error);
    }
  };

  const addWorkout = () => {
    if (!selectedDate || workout.trim() === '') return;

    const updatedWorkouts = {
      ...workouts,
      [selectedDate]: [...(workouts[selectedDate] || []), workout],
    };

    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setWorkout('');
    setModalVisible(false);
  };

  const TabIcon = ({
    focused,
    icon,
    title,
  }: {
    focused: boolean;
    icon: any;
    title: string;
  }) => {
    return (
      <View className="flex-1 mt-3 flex flex-col items-center">
        <Image
          source={icon}
          tintColor={focused ? '#0061ff' : '#666876'}
          resizeMode="contain"
          className="size-6"
        />
        <Text
          className={`${
            focused ? 'text-[#0061ff] font-rubik-medium' : 'font-rubik'
          } text-xs w-full text-center mt-1`}
        >
          {title}
        </Text>
      </View>
    );
  };

  return (
    <UserProvider>
      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: 'white',
              position: 'absolute',
              borderTopColor: '#0061FF1A',
              borderTopWidth: 1,
              minHeight: 70,
              elevation: 5,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.home} focused={focused} title="Home" />
              ),
            }}
          />
          <Tabs.Screen
            name="workout"
            options={{
              title: 'Workout',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.dumbell}
                  focused={focused}
                  title="Workout"
                />
              ),
            }}
          />
          {/* Floating Action Button */}
          <Tabs.Screen
            name="addWorkout"
            options={{
              headerShown: false,
              tabBarButton: () => (
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    backgroundColor: '#0061ff',
                    width: 70,
                    height: 70,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#0061ff',
                    shadowOpacity: 0.4,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 10,
                  }}
                >
                  <Image
                    source={icons.plus}
                    style={{ width: 30, height: 30, tintColor: 'white' }}
                  />
                </TouchableOpacity>
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.person}
                  focused={focused}
                  title="Profile"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: 'Calendar',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  icon={icons.calendar}
                  focused={focused}
                  title="Calendar"
                />
              ),
            }}
          />
        </Tabs>

        {/* Bottom Sheet Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent
          onRequestClose={toggleModal}
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50 backdrop-blur-md">
            <View className="bg-white p-6 rounded-t-3xl">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Add Workout
              </Text>

              {/* Calendar Selection */}
              <ScrollView className="bg-gray-100 rounded-lg shadow-lg mb-4">
                <Calendar
                  onDayPress={(day: DateData) =>
                    setSelectedDate(day.dateString)
                  }
                  markedDates={
                    selectedDate
                      ? {
                          [selectedDate]: {
                            selected: true,
                            selectedColor: '#0061ff',
                          },
                        }
                      : {}
                  }
                  theme={{
                    selectedDayBackgroundColor: '#0061ff',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#ff5733',
                    arrowColor: '#0061ff',
                  }}
                />
              </ScrollView>

              {/* Workout Input */}
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-lg text-gray-800"
                placeholder="Enter workout..."
                placeholderTextColor="#999"
                value={workout}
                onChangeText={setWorkout}
              />

              <TouchableOpacity
                onPress={addWorkout}
                className="bg-blue-500 p-3 rounded-lg mt-4"
              >
                <Text className="text-white text-center text-lg">Add</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={toggleModal} className="mt-2 p-3">
                <Text className="text-gray-600 text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </UserProvider>
  );
};

export default TabsLayout;
