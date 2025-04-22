import React, { useState, useEffect} from 'react';
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

const WorkoutSection: React.FC = () => {
    const db = useSQLiteContext();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [editWorkout, setEditWorkout] = useState<Workout | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    
    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const fetchedWorkouts = await getWorkoutSessions(db);
                setWorkouts(fetchedWorkouts);
            } catch (error) {
                console.error("Error fetching recorded workout sessions", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkouts();
    }, [db]);

    
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="text-gray-500 mt-2">Loading workouts...</Text>
            </View>
        );
    }

    const deleteWorkout = async (workout_id: number) => {
        try {
          // Delete the workout from the database
          await db.runAsync(`DELETE FROM workout WHERE workout_id = ?`, [workout_id]);
      
          // Update the state to remove the deleted workout
          setWorkouts((prevWorkouts) =>
            prevWorkouts.filter((workout) => workout.workout_id !== workout_id)
          );
        } catch (error) {
          console.error("Error deleting workout:", error);
        }
    };

    const saveWorkoutEdit = async (workout: Workout) => {
        try {
            // Update the workout in the database
            await db.runAsync(`UPDATE workout SET workout_name = ?, workout_date = ? WHERE workout_id = ?`, [
                workout.workout_name,
                workout.workout_date,
                workout.workout_id ?? 0,
            ]);
            
            // Update the state to reflect the changes
            setWorkouts((prevWorkouts) =>
                prevWorkouts.map((w) => (w.workout_id === workout.workout_id ? workout : w))
            );
        }
        catch (error) {
            console.error("Error saving workout:", error);
        }
    }

    const toggleEditModal = (workout: Workout) => {
        setEditWorkout(workout);
        setIsEditModalVisible(true);
    }
    
    
    return (
        <View className="mt-4 mb-20">
            <Text className="text-xl font-bold text-gray-800 px-6 mb-4">
            Today's Workout
            </Text>

            {workouts.length === 0 && selectedDate === dayjs().format('YYYY-MM-DD') ? (
            <View className="bg-white mx-4 rounded-2xl p-12 items-center">
                <Image
                source={require('../../../assets/icons/dumbell.png')}
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
                onClose={() => {
                    setIsEditModalVisible(false);
                    setEditWorkout(null);
                }}
                onSave={saveWorkoutEdit}
                workout={editWorkout}
            />


        </View>
    );
};

export default WorkoutSection;