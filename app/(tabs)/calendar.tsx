import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Agenda, DateData } from 'react-native-calendars';
import { Trash2, Pencil } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [workoutText, setWorkoutText] = useState<string>('');
  const [editingWorkoutIndex, setEditingWorkoutIndex] = useState<number | null>(
    null
  );
  const [workouts, setWorkouts] = useState<{ [key: string]: string[] }>({});
  const [modalVisible, setModalVisible] = useState(false);

  // Load workouts from AsyncStorage
  useEffect(() => {
    loadWorkouts();
  }, []);

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

  const saveWorkouts = async (updatedWorkouts: { [key: string]: string[] }) => {
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Failed to save workouts', error);
    }
  };

  const addWorkout = async () => {
    if (!selectedDate || workoutText.trim() === '') return;

    const updatedWorkouts = {
      ...workouts,
      [selectedDate]: [...(workouts[selectedDate] || []), workoutText.trim()],
    };

    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
    setWorkoutText('');
    setEditingWorkoutIndex(null);
    setModalVisible(false);
  };

  const editWorkout = async () => {
    if (editingWorkoutIndex === null || workoutText.trim() === '') return;

    const updatedWorkouts = { ...workouts };
    updatedWorkouts[selectedDate][editingWorkoutIndex] = workoutText.trim();

    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
    setWorkoutText('');
    setEditingWorkoutIndex(null);
    setModalVisible(false);
  };

  const removeWorkout = async (date: string, index: number) => {
    const updatedWorkouts = { ...workouts };
    updatedWorkouts[date].splice(index, 1);

    if (updatedWorkouts[date].length === 0) {
      delete updatedWorkouts[date];
    }

    setWorkouts(updatedWorkouts);
    await saveWorkouts(updatedWorkouts);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Tabs screenOptions={{ headerShown: false }} />

      {/* Header */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800">
          Workout Calendar
        </Text>
      </View>

      {/* Agenda View */}
      <Agenda
        items={workouts}
        selected={selectedDate}
        onDayPress={(day: DateData) => {
          setSelectedDate(day.dateString);
          setModalVisible(true);
        }}
        renderItem={(item, index) => (
          <View className="bg-gray-200 p-3 rounded-lg mb-2 flex-row justify-between items-center">
            <Text className="text-lg text-gray-800">{item}</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => {
                  setWorkoutText(item);
                  setEditingWorkoutIndex(index);
                  setModalVisible(true);
                }}
                className="mr-3"
              >
                <Pencil size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeWorkout(selectedDate, index)}
              >
                <Trash2 size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        theme={{
          agendaDayTextColor: '#0061ff',
          agendaTodayColor: '#ff5733',
          agendaKnobColor: '#0061ff',
        }}
      />

      {/* Modal for Editing Workouts */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              {editingWorkoutIndex !== null ? 'Edit Workout' : 'Add Workout'}{' '}
              for {selectedDate}
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-lg text-gray-800"
              placeholder="Enter workout..."
              placeholderTextColor="#999"
              value={workoutText}
              onChangeText={setWorkoutText}
            />
            <TouchableOpacity
              onPress={editingWorkoutIndex !== null ? editWorkout : addWorkout}
              className="bg-blue-500 p-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center text-lg">
                {editingWorkoutIndex !== null ? 'Save Changes' : 'Add Workout'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setEditingWorkoutIndex(null);
                setWorkoutText('');
              }}
              className="mt-4 p-3"
            >
              <Text className="text-gray-600 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CalendarScreen;
