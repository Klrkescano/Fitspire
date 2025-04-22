import { View,Text, FlatList,TextInput, StyleSheet, Modal, TouchableOpacity, Dimensions } from "react-native";
import React, {useState, useEffect} from "react";
import { Exercise } from "../../.types/types";
import { getAllExercises } from "../../.utils/databaseSetup";
import { useSQLiteContext } from "expo-sqlite";

interface ExerciseLibraryProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const ExerciseLibrary = ({ isVisible, onClose, onSelectExercise }: ExerciseLibraryProps) => {
  const db = useSQLiteContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  const searchResults = exercises.filter((exercise) =>
    exercise.exercise_name.toLowerCase().includes(searchInput.toLowerCase())
  );

    // Fetch exercises from the database when modal is visible
    useEffect(() => {
      const fetchExercises = async () => {
        try {
          const fetchedExercises = await getAllExercises(db);
          setExercises(fetchedExercises as Exercise[]);
        } catch (error) {
          console.error("Error fetching exercises:", error);
        }
      };
      if (isVisible) {
        fetchExercises();
      }
    }, [isVisible]);


    
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
                <Text>{item.exercise_name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.exercise_id.toString()}
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