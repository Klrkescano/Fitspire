import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Modal, ScrollView } from "react-native";

const marchWorkouts = [
  {
    id: "1",
    date: "TUESDAYYY, MARCH 11",
    sets: [
      { weight: "85.0", unit: "lbs", reps: "7" },
      { weight: "80.0", unit: "lbs", reps: "8" }
    ]
  },
  {
    id: "2",
    date: "MONDAY, MARCH 17",
    sets: [
      { weight: "85.0", unit: "lbs", reps: "7" },
      { weight: "80.0", unit: "lbs", reps: "8" }
    ]
  },
  {
    id: "3",
    date: "THURSDAY, MARCH 20",
    sets: [
      { weight: "85.0", unit: "lbs", reps: "6" },
      { weight: "80.0", unit: "lbs", reps: "6" }
    ]
  }
];

const februaryWorkouts = [
  {
    id: "6",
    date: "MONDAY, FEBRUARY 17",
    sets: [
      { weight: "82.5", unit: "lbs", reps: "7" },
      { weight: "82.5", unit: "lbs", reps: "5" }
    ]
  },
  {
    id: "7",
    date: "MONDAY, FEBRUARY 24",
    sets: [
      { weight: "82.5", unit: "lbs", reps: "6" },
      { weight: "82.5", unit: "lbs", reps: "5" }
    ]
  }
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = ["2023", "2024", "2025"];

function workoutHistory() {
  const [month, setMonth] = useState("March");
  const [year, setYear] = useState("2025");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  // Quick Fix using CoPilot for the error and function
  let workouts: any[] = [];
  if (month === "March" && year === "2025") {
    workouts = marchWorkouts;
  } else if (month === "February" && year === "2025") {
    workouts = februaryWorkouts;
  }

  let totalWorkouts = workouts.length;

  return (
    <View style={styles.container}>      
      <Text style={styles.title}>Workout History</Text>
      
      <View style={styles.filters}>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowMonthPicker(true)}
        >
          <Text>{month}</Text>
          <Text style={styles.downButton}>v</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowYearPicker(true)}
        >
          <Text>{year}</Text>
          <Text style={styles.downButton}>v</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsBox}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
      </View>
    
      <ScrollView style={styles.workoutList} contentContainerStyle={{ paddingBottom: 40 }}>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <Text style={styles.workoutDate}>{workout.date}</Text>
              <View style={styles.blueLine} />
              {workout.sets.map((set, index) => (
                <View key={index} style={styles.set}>
                  <Text style={styles.weight}>{set.weight} {set.unit}</Text>
                  <Text style={styles.reps}>{set.reps} reps</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noWorkouts}>No workouts for this period</Text>
        )}
      </ScrollView>
      
      {/* Selecting a Month */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            <ScrollView>
              {months.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={styles.modalItem}
                  onPress={() => {
                    setMonth(m);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Selecting a Year */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Year</Text>
            <ScrollView>
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={styles.modalItem}
                  onPress={() => {
                    setYear(y);
                    setShowYearPicker(false);
                  }}
                >
                  <Text>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowYearPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    padding: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEEEEE",
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },
  downButton: {
    fontSize: 11,
    fontWeight: "semibold",
    color: "#333",
  },
  statsBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    color: "#777",
  },
  workoutList: {
    flex: 1,
  },
  workoutCard: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
  },
  workoutDate: {
    padding: 15,
    fontWeight: "bold",
  },
  blueLine: {
    height: 1,
    backgroundColor: "#73B9FF",
  },
  set: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  weight: {
    fontSize: 16,
  },
  reps: {
    fontSize: 16,
  },
  noWorkouts: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 40,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  closeButton: {
    backgroundColor: "#0066FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default workoutHistory;