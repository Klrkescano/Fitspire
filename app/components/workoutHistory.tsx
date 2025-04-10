import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface WorkoutSet {
  weight: number;
  reps: number;
}

interface WorkoutEntry {
  date: string;
  sets: WorkoutSet[];
}

interface WorkoutHistoryProps {
  data: WorkoutEntry[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ data }) => {
  const renderItem = ({ item }: { item: WorkoutEntry }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date}</Text>
      {item.sets.map((set, index) => (
        <Text key={index} style={styles.set}>
          {set.weight} lbs - {set.reps} reps
        </Text>
      ))}
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.date}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  set: {
    fontSize: 14,
    color: "#555",
  },
});

export default WorkoutHistory;
