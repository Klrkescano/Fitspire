import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import icons from '../../constants/icons';
import { UserProvider } from '../context/UserContext';
import { Tabs } from 'expo-router';
import { db, auth } from '@/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Workout categories (Custom Options)
const workoutTypes = [
  'Strength Training',
  'Cardio',
  'Yoga',
  'HIIT',
  'Pilates',
  'Stretching',
  'CrossFit',
  'Cycling',
  'Running',
  'Swimming',
];

const durations = ['15 min', '30 min', '45 min', '1 hour'];

const TabsLayout = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [workout, setWorkout] = useState('');
  const [duration, setDuration] = useState('30 min');
  const [workoutType, setWorkoutType] = useState('Strength Training');
  const [dropdownTypeVisible, setDropdownTypeVisible] = useState(false);
  const [dropdownDurationVisible, setDropdownDurationVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Function to Add Workout to Firestore (Auto Update)
  const addWorkout = async () => {
    if (workout.trim() === '') return;
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'user', user.uid, 'workouts'), {
        name: workout,
        duration: duration,
        type: workoutType,
        date: Timestamp.now(),
      });

      setWorkout('');
      setDuration('30 min');
      setWorkoutType('Strength Training');
      setModalVisible(false);
      console.log('✅ Workout added successfully!');
    } catch (error) {
      console.error('❌ Error adding workout:', error);
    }
  };

  // Custom Dropdown Rendering
  const renderDropdown = (
    visible: boolean,
    items: string[],
    setValue: (value: string) => void,
    toggleDropdown: () => void
  ) => {
    return visible ? (
      <View className="absolute bg-white border border-gray-300 rounded-lg w-full shadow-lg z-50">
        <FlatList
          data={items}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setValue(item);
                toggleDropdown();
              }}
              className="p-3 border-b border-gray-200"
            >
              <Text className="text-gray-800">{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    ) : null;
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
                <Image
                  source={icons.home}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="workout"
            options={{
              title: 'Workout',
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Image
                  source={icons.dumbell}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
                />
              ),
            }}
          />

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
                <Image
                  source={icons.person}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
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
                <Image
                  source={icons.calendar}
                  tintColor={focused ? '#0061ff' : '#666876'}
                  className="size-6"
                />
              ),
            }}
          />
        </Tabs>

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

              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-lg text-gray-800"
                placeholder="Enter workout..."
                placeholderTextColor="#999"
                value={workout}
                onChangeText={setWorkout}
              />

              <Text className="text-gray-700 text-lg mt-4">Workout Type</Text>
              <TouchableOpacity
                onPress={() => setDropdownTypeVisible(!dropdownTypeVisible)}
                className="border border-gray-300 rounded-lg p-3 mt-2"
              >
                <Text className="text-gray-800">{workoutType}</Text>
              </TouchableOpacity>
              {renderDropdown(
                dropdownTypeVisible,
                workoutTypes,
                setWorkoutType,
                () => setDropdownTypeVisible(false)
              )}

              <Text className="text-gray-700 text-lg mt-4">Duration</Text>
              <TouchableOpacity
                onPress={() =>
                  setDropdownDurationVisible(!dropdownDurationVisible)
                }
                className="border border-gray-300 rounded-lg p-3 mt-2"
              >
                <Text className="text-gray-800">{duration}</Text>
              </TouchableOpacity>
              {renderDropdown(
                dropdownDurationVisible,
                durations,
                setDuration,
                () => setDropdownDurationVisible(false)
              )}

              <TouchableOpacity
                onPress={addWorkout}
                className="bg-blue-500 p-3 rounded-lg mt-4"
              >
                <Text className="text-white text-center text-lg">
                  Add Workout
                </Text>
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
