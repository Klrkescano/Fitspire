import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Dimensions, StyleSheet } from 'react-native';
import exerciseData from '../../assets/data/exercises.json';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

interface Set {
    id: number;
    weight: number;
    reps: number;
}

interface Exercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
    sets: Set[];
}

const ExerciseTile = () => {
    const [exercises, setExercises] = useState<Exercise[]>(() =>
        exerciseData.map(exercise => ({
            ...exercise,
            sets: [],
        }))
    );

    const updateSet = (exerciseId: number, setIndex: number, key: string, value: string) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.map((set, index) => 
                        index === setIndex ? { ...set, [key]: value } : set
                    ),
                };
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    const addSet = (exerciseId: number) => {
        setExercises(exercises.map((exercise) => 
            exercise.id === exerciseId
                ? { ...exercise, sets: [...exercise.sets, { id: exercise.sets.length + 1, weight: 0, reps: 0 }] }
                : exercise
        ));
    };

    const deleteSet = (exerciseId: number) => {
        setExercises(exercises.map((exercise) => 
            exercise.id === exerciseId ? { ...exercise, sets: exercise.sets.slice(0, -1) } : exercise
        ));
    };

    const renderExercise = ({ item }: { item: Exercise }) => (
        <View style={styles.card}>
            {/* Exercise Name Header */}
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.detailText}>💪 Muscle: {item.muscle}</Text>
            <Text style={styles.detailText}>🏋️ Equipment: {item.equipment}</Text>
            <Text style={styles.detailText}>📖 Instructions: {item.instruction}</Text>

            {/* Sets Section */}
            <View style={styles.setContainer}>
                {item.sets.map((set, index) => (
                    <View key={index} style={styles.setRow}>
                        <Text>Set {index + 1}:</Text>
                        <TextInput
                            placeholder="Weight"
                            keyboardType="numeric"
                            value={set.weight.toString()}
                            onChangeText={(text) => updateSet(item.id, index, 'weight', text)}
                            style={styles.input}
                        />
                        <Text>lbs</Text>
                        <Icon name="times" size={20} color="black" />
                        <TextInput
                            placeholder="Reps"
                            keyboardType="numeric"
                            value={set.reps.toString()}
                            onChangeText={(text) => updateSet(item.id, index, 'reps', text)}
                            style={styles.input}
                        />
                    </View>
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <Button title="➕ Add Set" onPress={() => addSet(item.id)} />
                <Button title="🗑️ Delete Set" onPress={() => deleteSet(item.id)} />
            </View>
        </View>
    );

    return (
        <FlatList
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderExercise}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        width: width * 0.85,
        margin: 15,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5, // for Android shadow
    },
    exerciseName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    setContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: 50,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
});

export default ExerciseTile;
