import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Button, Touchable, TouchableOpacity } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import Icon  from 'react-native-vector-icons/FontAwesome';
import SetItem from './setItem';


interface Set {
    id: number;
    weight: number;
    reps: number;
}


const ExerciseTile = () => {
    const exercises = require('../../assets/data/exercises.json');
    const exercise = exercises[0];

    const [weight, setWeight] = useState<string>('');
    const [reps, setReps] = useState<string>('');
    const [sets, setSets] = useState<Set[]>([]);

    const newSet = { weight, reps };

    const handleSaveSet = () => {

        if (!weight || !reps) { 
            return;
        // TODO: Add error message or alert for adding empty weight or reps
        }

        const newSet: Set = { 
        id: sets.length + 1,
        weight: parseFloat(weight),
        reps: parseInt( reps, 10),
        };

        setSets([...sets, newSet]);
        setWeight('');
        setReps('');
    };

    const handleDeleteSet = (id: number) => {
        const newSets = sets.filter((set) => set.id !== id);
        setSets(newSets);
    };

    return (
        <View style={styles.container}>
        <View>
            {/* Exercise Name Header */}
            <Text style={styles.text}>Exercise: {exercise.name}</Text>
            <Text style={styles.text}>Muscle: {exercise.target_muscle_group}</Text>

            <View style={styles.setInput}>
                <Text style={styles.text}>Set</Text>
                <TextInput
                    style={[styles.input, { width: moderateScale(100) }]}
                    placeholder="Weight"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                />
                <Text style={styles.text}>lbs</Text>
                <Icon name="times" size={moderateScale(20)} color="Blue" />
                <TextInput
                    style={[styles.input, { width: moderateScale(100) }]}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                />
            </View>
            <Button title="Save Set" onPress={handleSaveSet} />
            <FlatList
                data = {sets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.setList}>
                        <Text> Set {item.id}: </Text>
                        <Text>{item.weight} lbs </Text>
                        <Icon name="times" size={moderateScale(15)} color="#00000" />
                        <Text>{item.reps} reps </Text>
                        <TouchableOpacity onPress={() => handleDeleteSet(item.id)}>
                            <Icon name="minus" size={moderateScale(15)} color="red" />
                        </TouchableOpacity>
                    </View>

                )}
            />
        </View>
        </View>
  );
};

export default ExerciseTile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: scale(16),
        marginVertical: scale(10),
        borderRadius: scale(8),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scale(2) },
        shadowOpacity: 0.2,
        shadowRadius: scale(4),
    },

    input: {
        height: scale(40),
        borderColor: 'gray',
        margin: scale(12),
        borderWidth: 1,
    },

    setInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scale(10),
        marginVertical: scale(5),
        borderRadius: scale(5),
    },

    text: {
        fontFamily: 'Arial',
        color: '#000',
        fontSize: moderateScale(14),
    },

    setList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(10),
        marginVertical: scale(5),
        borderRadius: scale(5),
        backgroundColor: '#f4f4f4',
        borderWidth: 1,
        borderColor: '#ddd',
    }


});