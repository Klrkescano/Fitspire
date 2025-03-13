import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Button, Dimensions, StyleSheet } from 'react-native';
import exerciseData from '../../assets/data/exercises.json';
import SetComponent from './setComponent';

const { width,height } = Dimensions.get('window');

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
            id: exercise.id,
            name: exercise.name,
            muscle: exercise.muscle,
            equipment: exercise.equipment,
            instruction: exercise.instruction,
            sets: [],
        }))
    );

    const updateSet = (exerciseId: number, setIndex: number, key: string, value: string) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.map((set, index) => {
                        if (index === setIndex) {
                            return {
                                ...set,
                                [key]: value,
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

    const addSet = (exerciseId: number) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: [
                        ...exercise.sets,
                        {
                            id: exercise.sets.length + 1,
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

    const deleteSet = (exerciseId: number) => {
        const newExercises = exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
                return {
                    ...exercise,
                    sets: exercise.sets.slice(0, -1),
                };
            }
            return exercise;
        });
        setExercises(newExercises);
    };

    const renderExercise = ({ item } : {item: Exercise}) => {

        return (
            <View style={styles.cardContainer}>
                {/* Exercise Name Header */}
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.detailText}>Muscle: {item.muscle}</Text>
                <Text style={styles.detailText}>Equipment: {item.equipment}</Text>
                <Text style={styles.detailText}>Instructions: {item.instruction}</Text>   

                {/* Sets */}
                <View style={styles.setContainer}>
                {item.sets.map((set, index) => (
                    <SetComponent/>
                ))}
                </View>

                {/* Add/Delete Set Buttons */}

                <View style={styles.buttonContainer}>
                    <Button title="Add Set" onPress={() => addSet(item.id)} />
                    <Button title="Delete Set" onPress={() => deleteSet(item.id)} />
                </View>
            </View>
        );
    };

    return (
        <View>
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderExercise}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                snapToAlignment='center'
                snapToInterval={width}
                decelerationRate='fast'
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })
                }
            />
        </View>
    );
}

export default ExerciseTile;


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
    exerciseName:{
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