import { View,Text, SafeAreaView, FlatList,TextInput, StyleSheet } from "react-native";
import React, {useState} from "react";
import WorkoutHistory from "../components/workoutHistory";

const workoutData = [
  {
    date: "Monday, March 31",
    sets: [
      { weight: 85.0, reps: 7 },
      { weight: 80.0, reps: 8 },
    ],
  },
  {
    date: "Monday, March 24",
    sets: [
      { weight: 85.0, reps: 7 },
      { weight: 80.0, reps: 8 },
    ],
  },
];

import SearchExercise from "../components/searchExercise";
const Workout = () => {

  
    return (
      <SafeAreaView>
        <View>
            <Text>Workout</Text>
            <SearchExercise />
            <WorkoutHistory data={workoutData} />
        </View>
      </SafeAreaView>
    );
}