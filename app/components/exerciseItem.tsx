import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Define the Exercise interface to ensure type safety for exercise objects
interface Exercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
}

// Define props interface for the ExerciseItem component
interface ExerciseItemProps {
    exercise: Exercise;
}

// Functional component to display an exercise item
const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
    return (
        <TouchableOpacity style={styles.card}>
          <View style={styles.textContainer}>
            {/* Display the exercise name */}
            <Text style={styles.title}>{exercise.name}</Text>
            {/* Display muscle group and equipment used */}
            <Text style={styles.subtitle}>
              {exercise.muscle} | {exercise.equipment}
            </Text>
          </View>
          {/* Plus symbol for potential action (e.g., add to workout) */}
          <Text style={styles.add}>{'+'}</Text>
        </TouchableOpacity>
      );
};
    
// Styles for the component
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EEF4FF', // Light blue background
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row', // Arrange elements in a row
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow effect
    },
    textContainer: {
        flex: 1, // Allow text container to take available space
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Darker text color for contrast
    },
    subtitle: {
        fontSize: 14,
        color: '#666', // Grayish text color for secondary details
    },
    add: {
        fontSize: 20,
        color: '#999', // Light gray color for plus sign
    },
});
    
// Export the component for use in other parts of the app
export default ExerciseItem;
