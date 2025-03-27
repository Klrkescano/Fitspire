import { SafeAreaView, Text, Button,  StyleSheet,View,FlatList, Dimensions } from "react-native";
import React, { useState } from "react";
import ExerciseLibrary from "../components/exerciseLibrary";
import ExerciseItem from "../components/exerciseItem";
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
          muscle: "Legs",
          equipment: "Barbell",
          instruction: "Stand with feet shoulder-width apart...",
          sets: [],
      },
      {
          id: 2,
          name: "Bench Press",
          muscle: "Chest",
          equipment: "Barbell",
          instruction: "Lie flat on the bench, grip the bar...",
          sets:[],
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
          
          <View style={styles.listContainer}>
            <FlatList
              data={workout.exercises}
              renderItem={({ item }) => (
                <ExerciseItem
                  exercise={item}
                  onDelete={handleDeleteExercise}
                />
                )}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text>No exercises added</Text>}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              snapToAlignment='center'
              snapToInterval={width * 0.85}
              decelerationRate='fast'
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