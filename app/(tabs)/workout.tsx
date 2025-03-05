import { View,Text, SafeAreaView, FlatList,TextInput, StyleSheet } from "react-native";
import React, {useState} from "react";


import SearchExercise from "../components/searchExercise";
const Workout = () => {

  
    return (
      <SafeAreaView>
        <View>
            <Text>Workout</Text>
            <SearchExercise />
        </View>
      </SafeAreaView>
    );
}


export default Workout;