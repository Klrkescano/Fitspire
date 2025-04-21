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
}

const SaveForm: React.FC<SaveFormProps> = ({ isVisible, onClose, workout }) => {
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
        setTimeout(() => {
          router.push('/(tabs)/home');
        }, 350);
      })
      .catch((error) => {
        console.error('Error saving workout:', error);
      });
  }

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
    >
      <TouchableOpacity onPress={onClose} style={{ flex: 1 }} activeOpacity={1}>
        <View style={styles.overlay}>
          <TouchableOpacity onPress={()=>{}}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Workout Summary</Text>
                <View>
                    <Text>Date: {currentDate}</Text>
                  <View>
                  <TextInput
                    placeholder="Workout Name"
                    style={styles.input}
                    value={workoutName}
                    onChangeText={setWorkoutName}
                  />
                  <Text>Exercises Done:</Text>
                  <Text>Total Sets:</Text>
                  <Text>Total Weights Lifted:</Text>
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
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937', // gray-800
    marginBottom: 16,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
});
