import { View,Text } from 'react-native';
import React from 'react';
import ExerciseTile from '../components/exercisetile';

const workout = () => {
  return (
    <View>
      <Text>Workout Page</Text>
      <View>
        <ExerciseTile />
      </View>
    </View>
  );
};

export default workout;
