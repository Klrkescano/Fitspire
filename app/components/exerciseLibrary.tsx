import { View,Text, FlatList,TextInput, StyleSheet } from "react-native";
import React, {useState} from "react";
import exerciseData from "../../assets/data/exercises.json";
import ExerciseItem from "../components/exerciseItem";
import { useRouter } from "expo-router";

interface Exercise {
  id: number;
  name: string;
  muscle: string;
  equipment: string;
}

const ExerciseLibrary = () => {
  const router = useRouter();
  const exercises = exerciseData;

  const [searchInput, setSearchInput] = useState<string>('');

  const searchResults = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  const handleSelectExercise = (exercise: Exercise): void => {
    router.push({
      pathname: '/workout',
      params: { selectedExercise: JSON.stringify(exercise) },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <Text style={styles.headerText}>Exercises</Text>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search Exercises"
            value={searchInput}
            onChangeText={setSearchInput}
            style={styles.searchInput}
          />
        </View>
        {/* Exercise List */}
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <ExerciseItem exercise={item} onSelect={() => handleSelectExercise(item)} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No exercises found</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});

export default ExerciseLibrary;