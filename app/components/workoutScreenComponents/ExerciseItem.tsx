import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions,TextInput, Button } from 'react-native';
import { WorkoutExercise, Set } from '../../../.types/types';
import SetComponent from './SetComponent';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ExerciseItemProps {
  ex: WorkoutExercise;
  onDelete: (exercise_id: number) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ ex, onDelete }) => {
  const [sets, setSets] = useState<Set[]>(ex.sets || []);
  const [weight, setWeight] = useState<string | undefined>(undefined);
  const [reps, setReps] = useState<string | undefined>(undefined);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  const addSet = () => {
    if (!weight || !reps) return;
  
    const newSet: Set = {
      set_id: sets.length + 1,
      weight: Number(weight),
      reps: Number(reps),
      workout_exercise_id: ex.workout_exercise_id,
      set_number: sets.length + 1,
    };
  
    setSets([...sets, newSet]);
    setWeight('');
    setReps('');
  };

  const saveSet = () => {
    if (!weight || !reps) return;
  
    if (editingIndex !== null) {
      const updated = sets.map((set, index) =>
        index === editingIndex
          ? {
              ...set,
              weight: Number(weight),
              reps: Number(reps),
            }
          : set
      );
      setSets(updated);
      setEditingIndex(null);
    } else {
      addSet();
    }
  
    // Clear fields
    setWeight('');
    setReps('');
  };

  const selectSetToEdit = (index: number, set: Set) => {
    setEditingIndex(index);
    setWeight(set.weight?.toString() || '');
    setReps(set.reps?.toString() || '');
  }
  

  const deleteSet = (workout_exercise_id: number, setIndex: number) => {
    setSets(sets.filter((_, index) => index !== setIndex));
  }

  const updateSet = (workout_exercise_id: number, setIndex: number, key: keyof Set, value: string) => {
    const updateSet = sets.map((set, index) => {
      if (index === setIndex) {
        return {
          ...set,
          [key]: value,
        };
      }
      return set;
    });

    setSets(updateSet);
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

        <View style={styles.setsContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={reps}
              onChangeText={setReps}
            />
            <Button
              title={editingIndex !== null ? 'Update Set' : 'Add Set'}
              onPress={saveSet}
            />
          </View>

          <SetComponent
            sets={sets}
            exerciseId={ex.exercise_id}
            updateSet={updateSet}
            deleteSet={deleteSet}
            selectSetToEdit={selectSetToEdit}
            editingIndex={editingIndex}
          />
        </View>
      </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
  setsContainer: {
    maxHeight: height * 0.4,
    overflow: 'scroll',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },

});


export default ExerciseItem;
