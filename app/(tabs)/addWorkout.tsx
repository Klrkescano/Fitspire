import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';

const generateId = () =>
  Date.now().toString() + Math.floor(Math.random() * 1000);

const workoutCategories = [
  {
    category: 'Chest',
    exercises: ['Bench Press', 'Push-ups', 'Chest Fly', 'Incline Press'],
  },
  {
    category: 'Legs',
    exercises: ['Squats', 'Leg Press', 'Lunges', 'Deadlifts'],
  },
];

const mealCategories = [
  {
    category: 'Breakfast',
    meals: ['Oatmeal', 'Eggs & Toast', 'Smoothie', 'Yogurt & Granola'],
  },
  {
    category: 'Lunch',
    meals: ['Grilled Chicken Salad', 'Brown Rice & Fish', 'Pasta'],
  },
];

const AddWorkoutMeal = () => {
  const [workout, setWorkout] = useState('');
  const [workoutList, setWorkoutList] = useState<
    { id: string; name: string }[]
  >([]);
  const [meal, setMeal] = useState('');
  const [mealList, setMealList] = useState<{ id: string; name: string }[]>([]);

  const addWorkout = () => {
    if (workout.trim()) {
      setWorkoutList([
        ...workoutList,
        { id: generateId(), name: workout.trim() },
      ]);
      setWorkout('');
    }
  };

  const removeWorkout = (id: string) => {
    setWorkoutList(workoutList.filter((item) => item.id !== id));
  };

  const addMeal = () => {
    if (meal.trim()) {
      setMealList([...mealList, { id: generateId(), name: meal.trim() }]);
      setMeal('');
    }
  };

  const removeMeal = (id: string) => {
    setMealList(mealList.filter((item) => item.id !== id));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white p-6"
      >
        <FlatList
          ListHeaderComponent={
            <>
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Add Workout
              </Text>

              <View className="flex-row items-center mb-4 border border-gray-300 rounded-lg p-2">
                <TextInput
                  className="flex-1 text-lg text-gray-800"
                  placeholder="Enter workout..."
                  placeholderTextColor="#999"
                  value={workout}
                  onChangeText={setWorkout}
                />
                <TouchableOpacity
                  onPress={addWorkout}
                  className="bg-blue-500 px-4 py-2 rounded-lg ml-2"
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>
            </>
          }
          data={workoutList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg">
              <Text className="text-lg text-gray-800">{item.name}</Text>
              <TouchableOpacity onPress={() => removeWorkout(item.id)}>
                <Trash2 size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <>
              <Text className="text-lg font-bold text-gray-800 mt-6 mb-2">
                Choose from Categories
              </Text>
              {workoutCategories.map((category) => (
                <View key={category.category} className="mb-4">
                  <Text className="text-lg font-bold text-blue-500 mb-2">
                    {category.category}
                  </Text>
                  {category.exercises.map((exercise) => (
                    <TouchableOpacity
                      key={exercise}
                      onPress={() =>
                        setWorkoutList([
                          ...workoutList,
                          { id: generateId(), name: exercise },
                        ])
                      }
                      className="bg-gray-200 px-4 py-2 rounded-lg mb-2"
                    >
                      <Text className="text-gray-800 font-semibold">
                        {exercise}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

              <Text className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                Add Meal for Today
              </Text>

              <View className="flex-row items-center mb-4 border border-gray-300 rounded-lg p-2">
                <TextInput
                  className="flex-1 text-lg text-gray-800"
                  placeholder="Enter meal..."
                  placeholderTextColor="#999"
                  value={meal}
                  onChangeText={setMeal}
                />
                <TouchableOpacity
                  onPress={addMeal}
                  className="bg-blue-500 px-4 py-2 rounded-lg ml-2"
                >
                  <Text className="text-white font-semibold">Add</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={mealList}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <View className="flex-row justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg">
                    <Text className="text-lg text-gray-800">{item.name}</Text>
                    <TouchableOpacity onPress={() => removeMeal(item.id)}>
                      <Trash2 size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              />

              <Text className="text-lg font-bold text-gray-800 mt-6 mb-2">
                Choose from Meal Categories
              </Text>
              {mealCategories.map((category) => (
                <View key={category.category} className="mb-4">
                  <Text className="text-lg font-bold text-blue-500 mb-2">
                    {category.category}
                  </Text>
                  {category.meals.map((meal) => (
                    <TouchableOpacity
                      key={meal}
                      onPress={() =>
                        setMealList([
                          ...mealList,
                          { id: generateId(), name: meal },
                        ])
                      }
                      className="bg-gray-200 px-4 py-2 rounded-lg mb-2"
                    >
                      <Text className="text-gray-800 font-semibold">
                        {meal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </>
          }
          nestedScrollEnabled
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AddWorkoutMeal;
