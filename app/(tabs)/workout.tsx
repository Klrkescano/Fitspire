import { SafeAreaView, Text, Button,  StyleSheet,View,FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ExerciseLibrary from "../components/exerciseLibrary";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

interface Exercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
}

const Workout: React.FC = () => {
    const router = useRouter();

    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
      const selectedExercise = searchParams.get("selectedExercise");
      if (selectedExercise && typeof selectedExercise === "string") {
        const exercise: Exercise = JSON.parse(selectedExercise);
        setSelectedExercises((prevExercises) => [...prevExercises, exercise]);
        router.push("/workout");
      }
    }, [searchParams, router]);

    return (
      <SafeAreaView style={styles.container}>
          <Text style={styles.header}>Workout</Text>
          <Button title="Add Exercise" onPress={() => router.push('/components/exerciseLibrary')} />

          <FlatList
        data={selectedExercises}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No exercises added</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  exerciseItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    borderRadius: 8,
  },
});


export default Workout;