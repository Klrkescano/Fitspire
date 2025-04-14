import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Set } from '../../.types/types';
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Set</Text>
        <Text style={styles.headerText}>Weight (kg)</Text>
        <Text style={styles.headerText}>Reps</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <FlatList
        data={sets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.setItem}>
            <Text style={styles.setNumber}>{index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={item.weight?.toString() || ''}
              onChangeText={(value) => updateSet(exerciseId, index, 'weight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={item.reps?.toString() || ''}
              onChangeText={(value) => updateSet(exerciseId, index, 'reps', value)}
            />
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteSet(exerciseId, index)}
            >
              <Icon name="trash" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => addSet(exerciseId)}
      >
        <Text style={styles.addButtonText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  setNumber: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#FAFAFA',
    fontSize: 14,
  },
  deleteButton: {
    padding: 6,
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SetComponent;