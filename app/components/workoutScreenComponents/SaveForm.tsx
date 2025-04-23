import { Workout } from '@/.types/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSQLiteContext } from 'expo-sqlite';
import { saveWorkoutSession } from '@/.utils/databaseSetup';

interface SaveFormProps {
  isVisible: boolean;
  onClose: () => void;
  workout: Workout;
  clearWorkout: () => void;
}

const SaveForm: React.FC<SaveFormProps> = ({ isVisible, onClose, workout, clearWorkout }) => {
  const db = useSQLiteContext();
  const currentDate = new Date().toLocaleDateString();
  const [workoutName, setWorkoutName] = useState(workout.workout_name || '');

  const handleSaveWorkout = () => {
    const workoutData = {
      ...workout,
      workout_name: workoutName,
      workout_date: currentDate,
    };
    
    saveWorkoutSession(db, workoutData)
      .then(() => {
        console.log('Workout saved successfully!', workoutData);
        onClose();
        clearWorkout();
        setTimeout(() => {
          router.push('/(tabs)/home');
        }, 350);
      })
      .catch((error) => {
        console.error('Error saving workout:', error);
      });
  }

  const exercisesDone = workout.exercises.length;
  const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const totalWeights = workout.exercises.reduce(
    (total, ex) => total + (ex.sets?.reduce((sum, set) => sum + (set.weight ?? 0), 0) ?? 0),
    0
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity onPress={onClose} style={{ flex: 1 }} activeOpacity={1}>
        <View style={styles.overlay}>
          <TouchableOpacity onPress={()=>{}} activeOpacity={1}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Workout Summary</Text>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>Date:</Text>
                <Text style={styles.input}>{currentDate}</Text>
              </View>

              <TextInput
                placeholder="Workout Name"
                style={styles.input}
                value={workoutName}
                onChangeText={setWorkoutName}
              />
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryText}>Exercises Done:</Text>
                  <Text style={styles.summaryValue}>{exercisesDone}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryText}>Total Sets:</Text>
                  <Text style={styles.summaryValue}>{totalSets}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryText}>Total Weights Lifted:</Text>
                  <Text style={styles.summaryValue}>{totalWeights} kg</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.buttonWithIcon} onPress={handleSaveWorkout}>
                <Text style={styles.buttonText}>Save Workout</Text>
                <Icon name="save" size={20} color="#fff" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SaveForm;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryItem: {
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryText: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
  },
  buttonWithIcon: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginLeft: 10,
  },
});
