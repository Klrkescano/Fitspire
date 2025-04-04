import React, {useState} from "react";
import { Text, View, StyleSheet, FlatList, Button, Dimensions } from "react-native";
import { Workout, Exercise } from "../types/types";
import ExerciseItem from "./exerciseItem";

const { width } = Dimensions.get("window");

interface WorkoutProps {
  workout: Workout;
  onAddExercise: () => void;
  onDeleteExercise: (exerciseId: number) => void;
}

const Workout: React.FC<WorkoutProps> = ({ workout, onAddExercise, onDeleteExercise }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{workout.name}</Text>
      <Button title="Add Exercise" onPress={onAddExercise} />

      <View style={styles.listContainer}>
        <FlatList
          data={workout.exercises}
          renderItem={({ item }) => (
            <ExerciseItem exercise={item} onDelete={onDeleteExercise} />
          )}
          keyExtractor={(item) => item.id.toString()}
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
