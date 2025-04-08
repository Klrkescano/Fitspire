import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { WorkoutExercise,Set } from '../../.types/types';
import SetComponent from './setComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSQLiteContext } from 'expo-sqlite';

interface ExerciseItemProps {
    ex: WorkoutExercise;
    onDelete: (exercise_id: number) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ ex, onDelete }) => {
  const [ sets, setSets ] = useState<Set[]>(ex.sets || []);

  
  const addSet = (workout_exercise_id: number) => {
    const newSet: Set = {
      set_id: sets.length + 1,
      weight: 0,
      reps: 0,
      workout_exercise_id: 0,
      set_number: 0
    };

    setSets([...sets, newSet]);
  }

  const deleteSet = (workout_exercise_id: number, setIndex: number) => {
    setSets(sets.filter((_, index) => index !== setIndex));
  }

  const updateSet = (workout_exercise_id: number, setIndex: number, key: keyof Set, value: string) => {
    const newSets = sets.map((sets, index) => {
      if (index === setIndex) {
        return {
          ...sets,
          [key]: value,
        };
      }
      return sets;
    });

    setSets(newSets);
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{ex.exercise_name}</Text>
            <Text style={styles.subtitle}>
              {ex.muscle_group} | {ex.equipment}
            </Text>
          </View>
          <SetComponent sets={sets} exerciseId={ex.exercise_id} addSet={addSet} updateSet={updateSet} deleteSet={deleteSet} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(ex.exercise_id)} style={{ position: 'absolute', top: 10, right: 10 }}>
        <Icon name="times" size={24} color="black" />
      </TouchableOpacity>
    </View>
    );
  };

  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    card: {
      width: width * 0.85,
      height: height * 0.70,
      backgroundColor: '#EEF4FF',
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 8,
      borderRadius: 15,
      flexDirection: 'column',
      alignItems: 'stretch',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      
    },
    cardContent: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
    textContainer: {
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#222',
    },
    subtitle: {
      fontSize: 14,
      color: '#555',
      marginTop: 2,
    }
  });



export default ExerciseItem;