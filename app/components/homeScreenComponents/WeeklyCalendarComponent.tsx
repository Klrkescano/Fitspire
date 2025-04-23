// components/WeeklyCalendar.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import { Workout } from '@/.types/types';

interface DayItem {
  date: string;
  dayNumber: string;
  dayName: string;
}

interface WeeklyCalendarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  weekDays: DayItem[];
  workouts: Workout[];
  isLoading: boolean;
  onWorkoutPress: (workout: Workout) => void;
  onWorkoutLongPress: (workoutId: string) => void;
}

const WeeklyCalendarComponent: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  setSelectedDate,
  weekDays,
}) => {
  return (
    <View className="mb-4 bg-white rounded-3xl mx-4">
      <Text className="text-xl font-bold text-gray-800 mt-6 mb-4 px-6">
        {dayjs(selectedDate).format('MMMM YYYY')}
      </Text>

      <FlatList
        data={weekDays}
        keyExtractor={(item) => item.date}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
        renderItem={({ item }) => {
          const isSelected = item.date === selectedDate;
          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(item.date)}
              className="items-center mx-3"
            >
              <Text className="text-sm text-gray-500 font-semibold mb-2">
                {item.dayName}
              </Text>
              <View
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`text-lg font-bold ${
                    isSelected ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {item.dayNumber}
                </Text>
              </View>
              {isSelected && (
                <View className="w-8 h-1 bg-blue-500 mt-2 rounded-full" />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default WeeklyCalendarComponent;
