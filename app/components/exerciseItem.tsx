import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Dimensions} from 'react-native';
import { Exercise,Set } from '../types/types';
import SetComponent from './setComponent';

interface ExerciseItemProps {
    exercise: Exercise;
    onSelect: () => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onSelect }) => {
  const [ sets, setSets ] = useState<Set[]>(exercise.sets || []);
  
  const addSet = (exerciseId: number) => {
    const newSet: Set = {
      id: sets.length + 1,
      weight: 0,
      reps: 0,
    };

    setSets([...sets, newSet]);
  }

  const deleteSet = (exerciseId: number, setIndex: number) => {
    setSets(sets.filter((_, index) => index !== setIndex));
  }

  const updateSet = (exerciseId: number, setIndex: number, key: keyof Set, value: string) => {
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
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.subtitle}>
              {exercise.muscle} | {exercise.equipment}
            </Text>
          </View>
          <SetComponent sets={sets} exerciseId={exercise.id} addSet={addSet} updateSet={updateSet} deleteSet={deleteSet} />
        </View>
      </TouchableOpacity>
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