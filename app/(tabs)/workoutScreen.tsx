import { SafeAreaView, Text, Button,  StyleSheet,View,FlatList, Dimensions } from "react-native";
import React, { useState } from "react";
import ExerciseLibrary from "../components/exerciseLibrary";
import WorkoutComponent from "../components/workoutComponent";
import { Exercise, Workout } from "../types/types";
import RestTimer from "../components/restTimer";
const { width,height } = Dimensions.get('window');


// Dummy data for workout object
const mockWorkout: Workout = {
  id: Date.now().toString(),
  name: "Premade Full Body Workout",
  exercises: [
      {
          id: 1,
          name: "Squat",
          muscle_group: "Legs",
          equipment: "Barbell",
          instruction: "Stand with feet shoulder-width apart...",
          sets: [
              { id: 1, weight: 100, reps: 12 },
              { id: 2, weight: 110, reps: 10 },
          ],
      },
      {
          id: 2,
          name: "Bench Press",
          muscle_group: "Chest",
          equipment: "Barbell",
          instruction: "Lie flat on the bench, grip the bar...",
          sets: [
              { id: 1, weight: 80, reps: 8 },
              { id: 2, weight: 85, reps: 6 },
          ],
      },
  ],
};

const WorkoutScreen: React.FC = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [restTimerVisible, setRestTimerVisible] = useState(false);

    const [workout, setWorkout] = useState<Workout>(mockWorkout);

    const handleSelectExercise = (exercise: Exercise): void => {
        setWorkout((prevWorkout) => ({
          ...prevWorkout,
          exercises: [...prevWorkout.exercises,{...exercise, sets: []}],
        }));
        setModalVisible(false);
    };

    const handleDeleteExercise = (exerciseId: number): void => {
        setWorkout((prevWorkout) => ({
          ...prevWorkout,
          exercises: prevWorkout.exercises.filter(
            (exercise) => exercise.id !== exerciseId
          ),
        })
        );
    };
    

    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.header}>{workout.name}</Text>
          <Button title="Add Exercise" onPress={() => setModalVisible(true)} />
          <Button title="Rest Timer" onPress={() => setRestTimerVisible(true)} />
          <WorkoutComponent
            workout={workout}
            onAddExercise={() => setModalVisible(true)}
            onDeleteExercise={handleDeleteExercise}
          />
          <ExerciseLibrary
            isVisible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelectExercise={handleSelectExercise}
          />
          <RestTimer
            isVisible={restTimerVisible}
            onClose={() => setRestTimerVisible(false)}
          />
    </SafeAreaView>
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
  exerciseItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 8,
  },
});


export default WorkoutScreen