<<<<<<< HEAD
import { View,Text } from 'react-native';
import React from 'react';
// import ExerciseTile from '../components/exerciseTile';
import ExerciseLibrary from '../components/exerciseLibrary';
import { Search } from 'lucide-react-native';
=======
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useWindowDimensions } from 'react-native';

const Explore = () => {
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const categories = ['All', 'Back', 'Biceps', 'Chest', 'Floor', 'Incline', 'Triceps', 'Warm Up'];
  
  const workouts = {
    'Warm Up': [
      { title: 'Full Body Warm Up', exercises: 20, duration: '22 Min' },
      { title: 'Strength Exercise', exercises: 12, duration: '14 Min' },
      { title: 'Both Side Plank', exercises: 15, duration: '18 Min' },
    ],
    'Abs Workout': [
      { title: 'Abs Workout', exercises: 16, duration: '18 Min' },
      { title: 'Russian Twist', exercises: 8, duration: '10 Min' },
      { title: 'Bicycle Crunches', exercises: 14, duration: '18 Min' },
    ], 
    'Back': [
      { title: 'Row', exercises: 16, duration: '18 Min' },
      { title: 'Russian Twist', exercises: 8, duration: '10 Min' },
      { title: 'Bicycle Crunches', exercises: 14, duration: '18 Min' },
    ],
  };
>>>>>>> origin/main

  return (
<<<<<<< HEAD
    <View>
      <Text>Workout Page</Text>
        {/* <ExerciseTile /> */}
        <View>
          <ExerciseLibrary />
        </View>
    </View>
=======
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          
          <Text className="text-center text-2xl font-bold text-black">Workouts</Text>

          <View className="flex-row items-center mt-4 bg-gray-100 p-3 rounded-full">
            <TextInput
              placeholder="Search Workouts"
              value={search}
              onChangeText={setSearch}
              className="ml-2 flex-1 text-gray-700 text-lg"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                className={`px-4 py-2 mx-2 rounded-full border ${index === 0 ? 'border-blue-500 text-white' : 'border-gray-400 text-gray-600'}`}
              >
                <Text className="text-sm font-semibold">{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {Object.keys(workouts).map((section, idx) => (
            <View key={idx} className="mt-6">
              <Text className="text-lg font-extrabold text-gray-800">{section}</Text>
              {workouts[section].map((workout, index) => (
                <View
                  key={index}
                  className="p-4 rounded-xl mt-4"
                  style={{
                    width: width * 0.9,
                    backgroundColor: '#EEF4FF',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 text-lg">{workout.title}</Text>
                      <Text className="text-gray-600 text-sm">{workout.exercises} Exercises • {workout.duration}</Text>
                    </View>

                    <Text className="text-gray-400 text-1xl">{'➤'}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
>>>>>>> origin/main
  );
};

export default Explore;