import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, FlatList, Button, Dimensions } from "react-native";
import { Workout as WorkoutType, WorkoutExercise } from "../../.types/types";
import ExerciseItem from "./exerciseItem";
import { useSQLiteContext } from "expo-sqlite";
import { getExercisesFromWorkout} from "../../.utils/databaseSetup";
const { width, height } = Dimensions.get("window");

interface WorkoutProps {
  workout: WorkoutType; 
  onAddExercise: () => void;
  onDeleteExercise: (workout_exercise_id: number) => void;

}

const Workout: React.FC<WorkoutProps> = ({ workout, onDeleteExercise }) => {
  // const db = useSQLiteContext();
  const exercises = workout.exercises || [];

  // useEffect(() => {
  //   const fetchExercises = async () => {
  //     try {
  //       if (workout.workout_id) {
  //         const result = await getExercisesFromWorkout(db, Number(workout.workout_id));
  //         setExercises(result);
  //       } else {
  //         setExercises([]);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch exercises:", err);
  //     }
  //   };
  
  //   fetchExercises();
  // }, [db, workout]);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={({ item }) => (
          <ExerciseItem ex={item} onDelete={onDeleteExercise} />
        )}
        keyExtractor={(item) => item.exercise_id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercises added yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add exercises</Text>
          </View>
        }
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width * 0.9}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 16,
    maxHeight: height * 0.7,
  },
  listContent: {
    paddingHorizontal: (width * 0.1) / 2,
  },
  emptyContainer: {
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: (width * 0.1) / 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default Workout;
