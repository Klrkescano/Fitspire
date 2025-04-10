import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Calendar } from "lucide-react-native";

export default function SaveWorkout() {
  const [title, setTitle] = useState("");

  const handleSave = () => {
    console.log("Workout Saved:", title);
    // Add save logic here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Save Workout</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Workout title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter workout title"
        style={styles.input}
      />

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>336h 19min</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={styles.statValue}>34,104 kg</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Sets</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Calendar size={20} color="gray" />
        <Text style={styles.dateText}>17 Mar 2025, 2:30 PM</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB", 
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280", 
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 16,
    color: "#374151", 
  },
});