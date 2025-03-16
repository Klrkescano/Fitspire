import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Dimensions, StyleSheet } from 'react-native';
import exerciseData from '../../assets/data/exercises.json'; // Importing exercise data from JSON file
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome icons

// Getting device width and height
const { width, height } = Dimensions.get('window');

// Interface for a Set (weight and reps for an exercise)
interface Set {
    id: number;
    weight: number;
    reps: number;
}

// Interface for an Exercise
interface Exercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
    sets: Set[];
}

const ExerciseTile = () => {
    // State to store the list of exercises, initializing from JSON data
    const [exercises, setExercises] = useState<Exercise[]>(() => 
        exerciseData.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            muscle: exercise.muscle,
            equipment: exercise.equipment,
            instruction: exercise.instruction,
            sets: [], // Initializing with empty sets
        }))
    );

    // Function to update a set's weight or reps
    const updateSet = (exerciseId: number, setIndex: number, key: string, value: string) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.map((set, index) => {
                        if (index === setIndex) {
                            return {
                                ...set,
                                [key]: value, // Updating either weight or reps
                            };
                        }
                        return set;
                    }),
                };
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    // Function to add a new set to an exercise
    const addSet = (exerciseId: number) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: [
                        ...exercise.sets,
                        {
                            id: exercise.sets.length + 1, // Assigning new ID
                            weight: 0,
                            reps: 0,
                        },
                    ],
                };
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    // Function to delete the last set of an exercise
    const deleteSet = (exerciseId: number) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.slice(0, -1), // Removing last set
                };
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    // Function to render each exercise card
    const renderExercise = ({ item }: { item: Exercise }) => {
        return (
            <View style={styles.cardContainer}>
                {/* Displaying exercise details */}
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.detailText}>Muscle: {item.muscle}</Text>
                <Text style={styles.detailText}>Equipment: {item.equipment}</Text>
                <Text style={styles.detailText}>Instructions: {item.instruction}</Text>   

                {/* Displaying sets for the exercise */}
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

                {/* Buttons to add or delete sets */}
                <View style={styles.buttonContainer}>
                    <Button title="Add Set" onPress={() => addSet(item.id)} />
                    <Button title="Delete Set" onPress={() => deleteSet(item.id)} />
                </View>
            </View>
        );
    };

    return (
        <View>
            {/* FlatList to display exercises horizontally */}
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderExercise}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate="fast"
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />
        </View>
    );
};

export default ExerciseTile;

// Styles for the UI components
const styles = StyleSheet.create({
    cardContainer: {
        width: width * 0.9,
        height: height * 0.8,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginHorizontal: width * 0.05,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    }, 
    exerciseName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
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
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginTop: 10,
    },
});
