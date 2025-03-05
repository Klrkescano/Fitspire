import { View,Text } from 'react-native';
import React from 'react';
// import ExerciseTile from '../components/exerciseTile';
import ExerciseLibrary from '../components/exerciseLibrary';
import { Search } from 'lucide-react-native';

const workout = () => {
  return (
    <View>
      <Text>Workout Page</Text>
        {/* <ExerciseTile /> */}
        <View>
          <ExerciseLibrary />
        </View>
    </View>
  );
};

export default workout;
