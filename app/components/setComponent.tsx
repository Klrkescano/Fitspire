import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Dimensions, Touchable, TouchableOpacity } from 'react-native';
import { Set } from '../types/types';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SetComponentProps {
  sets: Set[];
  exerciseId: number;
  updateSet: (exerciseId: number, setIndex: number, key: keyof Set, value: string) => void;
  addSet: (exerciseId: number) => void;
  deleteSet: (exerciseId: number, setIndex: number) => void;
}

const SetComponent: React.FC<SetComponentProps> = ({ sets, exerciseId, addSet, updateSet, deleteSet}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sets</Text>
      <FlatList
        data={sets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.setItem}>
            <Text style={{ flex: 1 }}>{index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              keyboardType="numeric"
              value={item.weight?.toString() || ''}
              onChangeText={(value) => updateSet(exerciseId, index, 'weight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="numeric"
              value={item.reps?.toString() || ''}
              onChangeText={(value) => updateSet(exerciseId, index, 'reps', value)}
            />
            <TouchableOpacity>
            <Icon name="trash" size={24} color="black" onPress={() => deleteSet(exerciseId, index)} />
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Add Set" onPress={() => addSet(exerciseId)} />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F8FAFF',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  list: {
    maxHeight: 150,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#EEF4FF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
});

export default SetComponent;