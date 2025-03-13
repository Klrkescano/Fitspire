import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

const SetComponent = () => {
  const [sets, setSets] = useState<{ weight: number; reps: number }[]>([]);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleAddSet = () => {
    if (weight && reps) {
      const newSet = { weight: parseFloat(weight), reps: parseInt(reps) };
      setSets([...sets, newSet]);
      setWeight('');
      setReps('');
    } else {
      alert('Please enter both weight and reps');
    }
  };

  const handleDeleteSet = (index: number) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    setSets(updatedSets);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Tracking</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Weight (lbs)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Reps"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
        <Button title="Add Set" onPress={handleAddSet} />
      </View>
      <FlatList
        data={sets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.setItem}>
            <Text>{item.weight} lbs x {item.reps} reps</Text>
            <Button title="Delete" onPress={() => handleDeleteSet(index)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '40%',
    marginRight: 10,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SetComponent;