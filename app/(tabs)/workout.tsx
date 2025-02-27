import { View,Text } from 'react-native';
import React from 'react';
import ExerciseTile from '../components/exerciseTile';
// import ExerciseLibrary from '../components/exerciseLibrary';
import { SafeAreaView } from 'react-native-safe-area-context';

const workout = () => {
  return (
    <SafeAreaView>
      <Text>Workout Page</Text>
      <View>
        <ExerciseTile />

        {/* <ExerciseLibrary /> */}
      </View>
    </SafeAreaView>
  );
};

export default workout;
