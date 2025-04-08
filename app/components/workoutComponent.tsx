import React, {useEffect, useState} from "react";
import { Text, View, StyleSheet, FlatList, Button, Dimensions } from "react-native";
import { Workout as WorkoutType, WorkoutExercise } from "../../.types/types";
import ExerciseItem from "./exerciseItem";
import { useSQLiteContext } from "expo-sqlite";
import { getExercisesFromWorkout} from "../../.utils/databaseSetup";
const { width } = Dimensions.get("window");

interface WorkoutProps {
  workout: WorkoutType;
  exercises: WorkoutExercise[];
  setExercises: React.Dispatch<React.SetStateAction<WorkoutExercise[]>>;
  onAddExercise: () => void;
  onDeleteExercise: (workout_exercise_id: number) => void;

}

const Workout: React.FC<WorkoutProps> = ({ workout, onAddExercise, onDeleteExercise }) => {
  const db = useSQLiteContext();
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        if (workout.workout_id) {
          const result = await getExercisesFromWorkout(db, Number(workout.workout_id));
          setExercises(result);
        } else {
          setExercises([]);
        }
      } catch (err) {
        console.error("Failed to fetch exercises:", err);
      }
    };
  
    fetchExercises();
  }, [db, workout]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{workout.workout_name}</Text>
      <Button title="Add Exercise" onPress={onAddExercise} />

      <View style={styles.listContainer}>
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <ExerciseItem ex={item} onDelete={onDeleteExercise} />
          )}
          keyExtractor={(item) => item.exercise_id.toString()}
          ListEmptyComponent={<Text>No exercises added</Text>}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={width * 0.85}
          decelerationRate="fast"
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: width * 0.85,
            offset: (width * 0.85) * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
});

export default Workout;
