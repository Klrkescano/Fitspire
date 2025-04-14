import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { WorkoutExercise, Set } from '../../.types/types';
import SetComponent from './setComponent';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ExerciseItemProps {
  ex: WorkoutExercise;
  onDelete: (exercise_id: number) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ ex, onDelete }) => {
  const [sets, setSets] = useState<Set[]>(ex.sets || []);

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
    const newSets = sets.map((set, index) => {
      if (index === setIndex) {
        return {
          ...set,
          [key]: value,
        };
      }
      return set;
    });

    setSets(newSets);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{ex.exercise_name}</Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>{ex.muscle_group}</Text>
            <Text style={styles.tag}>{ex.equipment}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(ex.workout_exercise_id)}
          style={styles.deleteButton}
        >
        <Icon name="times" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>
        <SetComponent
          sets={sets}
          exerciseId={ex.exercise_id}
          addSet={addSet}
          updateSet={updateSet}
          deleteSet={deleteSet}
        />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    maxHeight: height * 0.6,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
});


export default ExerciseItem;
