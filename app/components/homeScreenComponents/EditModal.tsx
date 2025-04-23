import React, { useEffect, useState } from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import { Workout } from '@/.types/types';

interface EditModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: (workout: Workout) => void;
    workout: Workout | null;
}
const EditModal: React.FC<EditModalProps> = ({ isVisible, onClose, onSave, workout }) => {
    const [editWorkout, setEditWorkout] = useState<Workout | null>(workout);

    useEffect(() => {
        setEditWorkout(workout);
    }
    , [workout]);

    const handleSave = () => {
        if (editWorkout) {
            onSave(editWorkout);
        }
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>     
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-8 rounded-3xl w-5/6">
                    <Text className="text-2xl font-bold text-gray-800 mb-4"> 
                        Edit Workout
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-xl p-4 text-lg text-gray-800 mb-4"
                        placeholder="Workout Name"
                        value={editWorkout?.workout_name || ''}
                        onChangeText={(text) =>
                            setEditWorkout((prev) =>
                            prev ? { ...prev, name: text } : prev
                            )
                        }
                    />
                    <TextInput
                        className="border border-gray-300 rounded-xl p-4 text-lg text-gray-800 mb-6"
                        placeholder="Duration"
                        value={editWorkout?.workout_date || ''}
                        onChangeText={(text) =>
                            setEditWorkout((prev) =>
                            prev ? { ...prev, duration: text } : prev
                            )
                        }
                    />
                    <TouchableOpacity
                        onPress={ handleSave}
                        className="bg-blue-500 p-4 rounded-xl mb-3"
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Save Changes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        className="p-4"
                    >
                        <Text className="text-gray-600 text-center font-medium">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default EditModal;