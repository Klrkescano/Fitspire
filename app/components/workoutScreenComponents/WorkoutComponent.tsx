import React, {useCallback, useEffect} from "react";
import { Text, View, StyleSheet, FlatList, Button, Dimensions } from "react-native";
import { Workout, WorkoutExercise, Set } from "../../../.types/types";
import ExerciseItem from "./ExerciseItem";
import { useSQLiteContext } from "expo-sqlite";
import { getExercisesFromWorkout} from "../../../.utils/databaseSetup";
const { width, height } = Dimensions.get("window");

interface WorkoutProps {
  workout: Workout; 
  onDeleteExercise: (workout_exercise_id: number) => void;
  onUpdateExerciseSets: (workout_exercise_id: number, newSets: Set[]) => void;
  
}

const WorkoutComponent: React.FC<WorkoutProps> = ({ workout, onDeleteExercise, onUpdateExerciseSets }) => {
  // const db = useSQLiteContext();
  const exercises = workout.exercises || [];
  const flatlistRef = React.useRef<FlatList<WorkoutExercise>>(null);

  useEffect(() => {
    if (exercises.length > 0 && flatlistRef.current) {
        flatlistRef.current.scrollToIndex({
          index: exercises.length - 1,
          animated: true,
        });
      }
    }, [exercises.length]);



  const emptyWorkout = () => {
    return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No exercises added yet</Text>
      <Text style={styles.emptySubtext}>Tap the + button to add exercises</Text>
    </View>
    )
  }

  const renderExerciseItem = useCallback(
    ({ item }: { item: WorkoutExercise }) =>
      <View style={styles.exerciseCard}>
        <ExerciseItem
          ex={item}
          onDelete={onDeleteExercise}
          onUpdateExerciseSets={onUpdateExerciseSets}
        />
      </View>,
    [onDeleteExercise, onUpdateExerciseSets]
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.exercise_id.toString()}
        ListEmptyComponent={
          emptyWorkout
        }
        horizontal={true}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 10,
  },
  exerciseCard: {
    flex: 1,
    width: width,
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    
  },
  emptyContainer: {
    flex: 1,
    width: width,
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

export default WorkoutComponent;
