import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const Home = () => {
  const { width, height } = useWindowDimensions();

  const items = [
    { name: 'Calories', value: '1,500 kcal' },
    { name: 'Carbs', value: '200 g' },
    { name: 'Protein', value: '100 g' },
    { name: 'Fat', value: '50 g' },
  ];

  const motivationalText = 'Stay consistent, and the results will follow! 💪';

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="mt-4 px-4">
          <Text className="text-3xl font-bold text-gray-800">Fitspire</Text>
          <Text className="text-base text-gray-500 mt-1">
            {motivationalText}
          </Text>
        </View>

        <View
          className="self-center rounded-lg bg-white mt-6 p-4"
          style={{ width: width * 0.9 }}
        >
          <Text className="text-lg font-semibold text-gray-800">
            Today's Goals
          </Text>
          <Text className="text-sm text-gray-600">Caloric & Macro Targets</Text>
          <View className="flex-row flex-wrap justify-between mt-4">
            {items.map((item, index) => (
              <View
                key={index}
                className="w-[48%] aspect-square border border-gray-300 rounded-lg justify-center items-center mb-4 bg-gray-50"
              >
                <Text className="text-gray-800 font-medium">{item.name}</Text>
                <Text className="text-blue-500 font-semibold mt-1">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress Section */}
        <View
          className="self-center rounded-lg bg-blue-100 mt-6 p-4"
          style={{ width: width * 0.9, height: height * 0.15 }}
        >
          <Text className="text-lg font-semibold text-gray-800">
            Weekly Progress
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            You're on track to hit your goals this week!
          </Text>
          <View className="mt-4 flex-row items-center justify-between">
            <View className="w-1/4 h-2 bg-blue-500 rounded-full"></View>
            <View className="w-1/4 h-2 bg-blue-300 rounded-full"></View>
            <View className="w-1/4 h-2 bg-blue-300 rounded-full"></View>
            <View className="w-1/4 h-2 bg-blue-200 rounded-full"></View>
          </View>
        </View>

        <View
          className="self-center rounded-lg bg-white mt-6 p-4"
          style={{ width: width * 0.9 }}
        >
          <Text className="text-lg font-semibold text-gray-800">
            Your Daily Stats
          </Text>
          <View className="mt-4 flex-row justify-between">
            <View className="items-center">
              <Text className="text-gray-800 font-medium">Steps</Text>
              <Text className="text-green-500 font-semibold text-lg">
                8,200
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-800 font-medium">Water</Text>
              <Text className="text-blue-500 font-semibold text-lg">2.5L</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-800 font-medium">Sleep</Text>
              <Text className="text-purple-500 font-semibold text-lg">
                7.5 hrs
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
