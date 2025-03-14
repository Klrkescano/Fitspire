import { View,Text, FlatList,TextInput, StyleSheet, Modal, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import exerciseData from "../../assets/data/exercises.json";
import ExerciseItem from "./exerciseItem";
import { useRouter } from "expo-router";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  equipment: string;
}

interface ExerciseLibraryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseLibrary = ({ isVisible, onClose, onSelectExercise }: ExerciseLibraryProps) => {
  // const router = useRouter();
  const exercises = exerciseData;

  const [searchInput, setSearchInput] = useState<string>('');

  const searchResults = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  // const handleSelectExercise = (exercise: Exercise): void => {
  //   router.push({
  //     pathname: '/workout',
  //     params: { selectedExercise: JSON.stringify(exercise) },
  //   });
  // }

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.headerText}>Select an Exercise</Text>

          {/* Search Bar */}
          <TextInput
            placeholder="Search Exercises"
            value={searchInput}
            onChangeText={setSearchInput}
            style={styles.searchInput}
          />

          {/* Exercise List */}
          <FlatList
            data={searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exerciseItem}
                onPress={() => onSelectExercise(item)}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No exercises found</Text>}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseItem: {
    padding: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginVertical: 5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
});

export default ExerciseLibrary;