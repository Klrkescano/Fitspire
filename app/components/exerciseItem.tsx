import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';


interface Exercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
}

interface ExerciseItemProps {
    exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
    return (
        <TouchableOpacity style={styles.card}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.subtitle}>
              {exercise.muscle} | {exercise.equipment}
            </Text>
          </View>
          <Text style={styles.add}>{'+'}</Text>
        </TouchableOpacity>
      );
    };
    
    const styles = StyleSheet.create({
      card: {
        backgroundColor: '#EEF4FF',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      textContainer: {
        flex: 1,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      subtitle: {
        fontSize: 14,
        color: '#666',
      },
      add: {
        fontSize: 20,
        color: '#999',
      },
    });
    


export default ExerciseItem;