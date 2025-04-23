import {
  SafeAreaView,
  Text,
  TouchableOpacity, 
  StyleSheet, 
  View, 
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useState } from "react";
import ExerciseLibrary from "../components/workoutScreenComponents/ExerciseLibrary";
import WorkoutComponent from "../components/workoutScreenComponents/WorkoutComponent";
import { Workout, Exercise,WorkoutExercise} from "../../.types/types";
import RestTimer from "../components/workoutScreenComponents/RestTimer";
import SaveForm from "../components/workoutScreenComponents/SaveForm";
const { width, height } = Dimensions.get('window');

const WorkoutScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [restTimerVisible, setRestTimerVisible] = useState(false);
  const [saveFormVisible, setSaveFromVisible] = useState(false);
  
  const [workout, setWorkout] = useState<Omit<Workout, 'workout_id'> & { workout_id?: number}>({
    workout_name: "",
    workout_date: new Date().toISOString(),
    exercises: [],
  });

  const handleSelectExercise = (exercise: Exercise): void => {
    setWorkout(prev => {
      // 1) Calculate the next index/order
      const nextIndex = prev.exercises.length + 1;
  
      // 2) Build a WorkoutExercise object
      const newWorkoutExercise: WorkoutExercise = {

        //WorkoutExercise object
        workout_exercise_id: nextIndex,
        workout_id: prev.workout_id,
        order_in_workout: nextIndex,
        exercise_info: exercise,
        sets: [],  
        
        //Workoutexercise extends exercise object, so we need the exercise object properties
        exercise_id:   exercise.exercise_id,
        exercise_name: exercise.exercise_name,
        muscle_group:  exercise.muscle_group,
        equipment:     exercise.equipment,
        instructions:  exercise.instructions,
        isCustom:      exercise.isCustom,
      };
  
      return {
        ...prev,
        exercises: [...prev.exercises, newWorkoutExercise],
      };
    });
  
    setModalVisible(false);
  };

  const handleDeleteExercise = (workout_exercise_id: number): void => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.workout_exercise_id !== workout_exercise_id),
    }));
  };

  const clearWorkout = (): void => {
    setWorkout({
      workout_name: "",
      workout_date: new Date().toISOString(),
      exercises: [],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{new Date(workout.workout_date).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={18} color="#007AFF" />
          <Text style={styles.buttonText}>Add Exercise</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setRestTimerVisible(true)}
        >
          <Icon name="clock-o" size={18} color="#007AFF" />
          <Text style={styles.buttonText}>Rest Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setSaveFromVisible(true)}
        >
          <Icon name="save" size={18} color="#007AFF" />
          <Text style={styles.buttonText}>Save Workout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.workoutContainer}>
      <WorkoutComponent
        workout={workout}
        onAddExercise={() => setModalVisible(true)}
        onDeleteExercise={handleDeleteExercise}
      />
      <Text style={{ padding: 16, color: '#666', textAlign: 'center' }}>
        Swipe left or right to view exercises.
      </Text>
      </View>

      <ExerciseLibrary
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectExercise={handleSelectExercise}
      />
      <RestTimer
        isVisible={restTimerVisible}
        onClose={() => setRestTimerVisible(false)}
      />
      <SaveForm
        workout={workout}
        isVisible={saveFormVisible}
        onClose={() => setSaveFromVisible(false)}
        clearWorkout={clearWorkout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  workoutContainer: {
    flex: 1,
    marginBottom: 80
  },
});

export default WorkoutScreen;
