import React, { useState } from 'react';
import { 
  ScrollView,
  View, 
  TextInput, 
  Button, 
  FlatList, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';
import { Set } from '../../../.types/types';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

interface SetComponentProps {
  sets: Set[];
  exerciseId: number;
  updateSet: (exerciseId: number, setIndex: number, key: keyof Set, value: string) => void;
  deleteSet: (exerciseId: number, setIndex: number) => void;
  selectSetToEdit: (setIndex: number, set: Set) => void;
  editingIndex?: number | null;
}

const SetComponent: React.FC<SetComponentProps> = ({ sets, exerciseId, updateSet, deleteSet, selectSetToEdit, editingIndex}) => {


  const setItem = ({ item, index }: { item: Set; index: number }) => {
    const isEditing = index === editingIndex;

    return (
      <View style={[styles.setItem, isEditing && styles.editingItem]}>
        <TouchableOpacity onPress={() => selectSetToEdit(index, item)} style={styles.setNumberContainer}>
          <Text style={styles.setNumber}>{index + 1}</Text>
        </TouchableOpacity>
        <Text style={styles.staticText}>{item.weight ?? '-'}</Text>
        <Icon name="times" size={16} color="#2C3E50" style={{ marginHorizontal: 4 }} />
        <Text style={styles.staticText}>{item.reps ?? '-'}</Text>
        <TouchableOpacity
          onPress={() => deleteSet(exerciseId, index)}
          style={styles.deleteButton}
        >
          <Icon name="minus" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Set</Text>
        <Text style={styles.headerText}>Weight (lbs)</Text>
        <Text style={styles.headerText}>Reps</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <FlatList
        style={{ maxHeight: height * 0.4, paddingBottom: 16, paddingHorizontal: 4 }}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={sets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={setItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 6,
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
    flex: 1,
    textAlign: 'center',
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
    marginBottom: 6,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  setNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#black',
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
  },
  input: {
    flex: 1.2,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    backgroundColor: '#F9F9F9',
    fontSize: 14,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 6,
  },
  editingItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#42A5F5',
    borderWidth: 1.2,
  },
  staticText: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1, // Makes sure each text takes equal width
    textAlign: 'center', // Centers text horizontally
  },
  setNumberContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default SetComponent;