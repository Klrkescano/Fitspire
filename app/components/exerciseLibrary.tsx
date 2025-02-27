import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useState,useEffect } from 'react';
import exerciseData from '../../assets/data/exercises.json';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { SearchBar } from 'react-native-screens';

interface Exercise {
  id: number;
  name: string;
  target_muscle_group: string;
  description: string;
}

const ExerciseLibrary = () => {


  const [search, setSearch] = useState<string>('');
  const [exercises, setExercises] = useState(exerciseData);


  {/* Function to retrieve exercises from API */}

  // useEffect(() => {
  //   loadExercises();
  // }, []);

  // const loadExercises = async () => {
  //   try {
  //     const response = await require('../../assets/data/exercises.json');
  //     const data = await response.json();
  //     setExercises(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  const filteredExercises = exercises.filter((exercise) => {
    return exercise.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View>
      <Text>Exercise Library</Text>
      <View>
        <TextInput 
          style={styles.SearchBar}
          placeholder="Search Exercise"
          value={search}
          onChangeText={setSearch} />
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.exerciseList}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

      </View>
    </View>
  );
};


export default ExerciseLibrary;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  SearchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
    borderRadius: 10,
  },
  exerciseList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
    borderRadius: 10,
  },
});