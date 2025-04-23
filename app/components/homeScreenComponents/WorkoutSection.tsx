import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import dayjs from 'dayjs';
import { useSQLiteContext } from 'expo-sqlite';
import { Workout } from '@/.types/types';
import { getWorkoutSessions } from '@/.utils/databaseSetup';
import EditModal from './EditModal';
import NewWorkoutModal from './NewWorkoutModal';
import { useFocusEffect } from 'expo-router';

const WorkoutSection: React.FC = () => {
    const db = useSQLiteContext();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [editWorkout, setEditWorkout] = useState<Workout | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isNewWorkoutModalVisible, setIsNewWorkoutModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
          let isActive = true;
      
          const fetchWorkouts = async () => {
            try {
              setIsLoading(true);
              const fetchedWorkouts = await getWorkoutSessions(db);
      
              // ✅ Step 1: Log the workout IDs to debug duplicates
              console.log("Fetched workouts:", fetchedWorkouts.map(w => w.workout_id));
      
              // ✅ Step 2: Remove duplicate workouts by ID
              const uniqueWorkouts = fetchedWorkouts.filter(
                (workout, index, self) =>
                  index === self.findIndex(w => w.workout_id === workout.workout_id)
              );
      
              if (isActive) {
                setWorkouts(uniqueWorkouts);
              }
            } catch (error) {
              console.error("Error fetching workouts:", error);
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchWorkouts();
      
          return () => {
            isActive = false;
          };
        }, [db])
      );
      
    const deleteWorkout = async (workoutId: number) => {
        try {
            await db.runAsync(`DELETE FROM workout WHERE workout_id = ?`, [workoutId]);
            setWorkouts((prevWorkouts) =>
                prevWorkouts.filter((workout) => workout.workout_id !== workoutId)
            );
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    const saveWorkoutEdit = async (workout: Workout) => {
        try {
            await db.runAsync(
                `UPDATE workout SET workout_name = ?, workout_date = ? WHERE workout_id = ?`,
                [workout.workout_name, workout.workout_date, workout.workout_id ?? 0]
            );
            setWorkouts((prevWorkouts) =>
                prevWorkouts.map((w) => (w.workout_id === workout.workout_id ? workout : w))
            );
        } catch (error) {
            console.error("Error saving workout:", error);
        }
    };

    const toggleEditModal = (workout: Workout) => {
        setEditWorkout(workout);
        setIsEditModalVisible(!isEditModalVisible);
    };

    const toggleNewWorkoutModal = () => {
        setIsNewWorkoutModalVisible(!isNewWorkoutModalVisible);
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="text-gray-500 mt-2">Loading workouts...</Text>
            </View>
        );
    }

    return (
        <View className="mt-4 mb-20">
            <Text className="text-xl font-bold text-gray-800 px-6 mb-4">Today's Workout</Text>

            {workouts.length === 0 && selectedDate === dayjs().format('YYYY-MM-DD') ? (
                <View className="bg-white mx-4 rounded-2xl p-12 items-center">
                    <Image
                        source={require('../../../assets/icons/dumbell.png')}
                        className="h-16 w-16 opacity-50 mb-4"
                    />
                    <Text className="text-gray-500 text-center text-lg">
                        No workouts added for today
                    </Text>
                    <TouchableOpacity
                        className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                        onPress={toggleNewWorkoutModal}
                    >
                        <Text className="text-white font-semibold">Add Workout</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={workouts}
                    keyExtractor={(item) => (item.workout_id ?? '').toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => toggleEditModal(item)}
                            onLongPress={() => deleteWorkout(item.workout_id ?? 0)}
                            className="mr-5"
                        >
                            <View className="w-48 h-56 bg-blue-100 rounded-2xl p-6 shadow-md">
                                <View className="w-20 h-20 bg-white rounded-full mx-auto mt-2 flex items-center justify-center shadow-sm">
                                    <Image
                                        source={require('../../../assets/icons/dumbell.png')}
                                        className="h-10 w-10"
                                    />
                                </View>
                                <Text className="text-gray-500 text-sm text-center mt-4">
                                    {item.workout_date}
                                </Text>
                                <Text className="text-gray-800 text-xl font-bold text-center mt-2">
                                    {item.workout_name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <EditModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSave={saveWorkoutEdit}
                workout={editWorkout}
            />
            <NewWorkoutModal
                isVisible={isNewWorkoutModalVisible}
                onClose={toggleNewWorkoutModal}
            />
        </View>
    );
};

export default WorkoutSection;