import { SafeAreaView, Text, Button,  StyleSheet,View,FlatList, Dimensions } from "react-native";
import React, { useState } from "react";
import ExerciseLibrary from "../components/exerciseLibrary";
import ExerciseItem from "../components/exerciseItem";
import { Exercise } from "../types/types";

const { width,height } = Dimensions.get('window');

const Workout: React.FC = () => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

    const handleSelectExercise = (exercise: Exercise): void => {
        setSelectedExercises((prevExercises) => [...prevExercises, exercise]);
        setModalVisible(false);
    };

    const handleDeleteExercise = (exerciseId: number): void => {
        setSelectedExercises((prevExercises) =>
          prevExercises.filter((exercise) => exercise.id !== exerciseId)
        );
    };
    

    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Workout</Text>
          <Button title="Add Exercise" onPress={() => setModalVisible(true)} />
          
          <View style={styles.listContainer}>
            <FlatList
              data={selectedExercises}
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


export default Workout;