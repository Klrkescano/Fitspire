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

interface NewWorkoutFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const NewWorkoutModal: React.FC<NewWorkoutFormProps> = ({ isVisible, onClose, }) => {

    // Function to handle the transition to the workout screen
    const handleTrackWorkout = () => {
        onClose();
        setTimeout(() => {
            router.push('/components/workoutScreenComponents/WorkoutScreen');
        },350);
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
                    <Text style={styles.title}>Start Workout</Text>

                    
                    <TouchableOpacity style={styles.buttonWithIcon}>
                        <Text style={styles.buttonText}>Follow a template</Text> 
                        <Icon name="chevron-right" size={14} color="#fff" style={styles.icon} />
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={styles.buttonWithIcon} onPress={handleTrackWorkout}> 
                        <Text style={styles.buttonText}>Without a template</Text> 
                        <Icon name="chevron-right" size={14} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.buttonWithIcon}>
                        <Text style={styles.buttonText}>Copy a previous workout</Text> 
                        <Icon name="chevron-right" size={14} color="#fff" style={styles.icon} />
                    </TouchableOpacity>

                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
    );
};

export default NewWorkoutModal;

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
  addButton: {
    backgroundColor: '#3b82f6', // blue-500
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
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
  icon: {
    marginLeft: 10,
  },
});
