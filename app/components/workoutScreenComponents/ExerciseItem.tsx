import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions,TextInput, Button } from 'react-native';
import { WorkoutExercise, Set } from '../../../.types/types';
import SetComponent from './SetComponent';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ExerciseItemProps {
  ex: WorkoutExercise;
  onDelete: (exercise_id: number) => void;
  onUpdateExerciseSets: (workout_exercise_id: number, newSets: Set[]) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ ex, onDelete,onUpdateExerciseSets }) => {

  const [weight, setWeight] = useState<string | undefined>(undefined);
  const [reps, setReps] = useState<string | undefined>(undefined);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const currentSets = ex.sets || [];


  const saveSet = () => {
    if (!weight || !reps || isNaN(Number(weight)) || isNaN(Number(reps))) {
      console.warn("Invalid weight or reps input");
      return;
    };

    const weightValue = Number(weight);
    const repsValue = Number(reps);

    let updatedSets: Set[];

    if (editingIndex !== null) {
      updatedSets = currentSets.map((set, index) =>
        index === editingIndex
          ? {
            ...set,
            weight: weightValue,
            reps: repsValue,
          }
          : set
      );
      setEditingIndex(null);
    } else {
      const nextSetNumber = currentSets.length + 1;
      const nextSetId = Date.now() + Math.random(); 

      const newSet: Set = {
        set_id: nextSetId,
        weight: weightValue,
        reps: repsValue,
        workout_exercise_id: ex.workout_exercise_id,
        set_number: nextSetNumber,
      };
      updatedSets = [...currentSets, newSet];
    }

    onUpdateExerciseSets(ex.workout_exercise_id, updatedSets);

    setWeight('');
    setReps('');
  };

  const selectSetToEdit = (index: number, set: Set) => {
    setEditingIndex(index);
    setWeight(set.weight?.toString() ?? '');
    setReps(set.reps?.toString() ?? '');
  };

  const deleteSet = (setIndexToDelete: number) => {
    const updatedSets = currentSets
      .filter((_, index) => index !== setIndexToDelete)
      .map((set, index) => ({ 
        ...set,
        set_number: index + 1,
      }));
    if(editingIndex === setIndexToDelete) {
        setEditingIndex(null);
        setWeight('');
        setReps('');
    }

    onUpdateExerciseSets(ex.workout_exercise_id, updatedSets);
  };

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
            sets={currentSets}
            exerciseId={ex.workout_exercise_id}
            deleteSet={(setIndex) =>deleteSet(setIndex)}
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
