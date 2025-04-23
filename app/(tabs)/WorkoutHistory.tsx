import React, { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Platform } from "react-native";
import { useSQLiteContext } from 'expo-sqlite';
import { WorkoutHistoryEntry } from "../../.types/types"; 
import { getWorkoutHistoryByMonthYear } from "../../.utils/databaseSetup";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

const getMonthNumber = (monthName: string): number => {
    return months.indexOf(monthName) + 1;
};

function WorkoutHistoryScreen() {
    const db = useSQLiteContext();

    const [selectedMonthName, setSelectedMonthName] = useState<string>(months[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
    const [workoutsHistory, setWorkoutsHistory] = useState<WorkoutHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);


    const fetchWorkoutHistory = useCallback(async (month: number, year: number) => {
        setIsLoading(true);
        setError(null);
        setWorkoutsHistory([]); 

        try {
            const data = await getWorkoutHistoryByMonthYear(db, month, year);
            setWorkoutsHistory(data);
        } catch (err: any) {
            console.error("Component failed to fetch workout history:", err);
            setError(err.message || "Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    }, [db]); 


    useEffect(() => {
        const month = getMonthNumber(selectedMonthName);
        const year = parseInt(selectedYear, 10);
        if (!isNaN(month) && !isNaN(year)) {
            fetchWorkoutHistory(month, year);
        }
    }, [selectedMonthName, selectedYear, fetchWorkoutHistory]);

    const formatDisplayDate = (isoDate: string): string => {
      try {
          const dateObj = new Date(isoDate);
  

          if (isNaN(dateObj.getTime())) {
              console.error("formatDisplayDate: Error parsing date string:", isoDate);
              return "INVALID DATE";
          }
  
   
          const options: Intl.DateTimeFormatOptions = {
              weekday: 'long', 
              month: 'long',
              day: 'numeric' 
          };
  

          const formattedString = dateObj.toLocaleDateString('en-US', options);

          return formattedString.toUpperCase();
  
      } catch (e) {

          console.error("formatDisplayDate: Error formatting date:", isoDate, e);
          return "INVALID DATE";
      }
  }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout History</Text>


            <View style={styles.filters}>
                 <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowMonthPicker(true)}
                >
                    <Text style={styles.filterButtonText}>{selectedMonthName}</Text>
                    <Text style={styles.downButton}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowYearPicker(true)}
                >
                    <Text style={styles.filterButtonText}>{selectedYear}</Text>
                    <Text style={styles.downButton}>▼</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsBox}>
               <View style={styles.stat}>
                    <Text style={styles.statNumber}>
                        {isLoading ? '...' : workoutsHistory.length}
                    </Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                </View>
            </View>

            <ScrollView style={styles.workoutList} contentContainerStyle={{ paddingBottom: 40 }}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0066FF" style={{ marginTop: 50 }} />
                ) : error ? (
                    <Text style={styles.errorText}>Error: {error}</Text>
                ) : workoutsHistory.length > 0 ? (
                    workoutsHistory.map((workout) => (
                        <View key={workout.workout_id} style={styles.workoutCard}>
 
                            <View style={styles.workoutHeader}>
                                <Text style={styles.workoutName}>{workout.workout_name}</Text>
                                <Text style={styles.workoutDate}>{formatDisplayDate(workout.workout_date_iso)}</Text>
                            </View>
                            <View style={styles.separatorLine} />

                  
                            {workout.exercises.length === 0 && (
                                <Text style={styles.noDataText}>No exercises recorded for this workout.</Text>
                            )}
                             {workout.exercises.map((exercise, exIndex) => (
                                <View key={exercise.workout_exercise_id} style={styles.exerciseContainer}>
                                    <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>
                        
                                    {exercise.sets.length === 0 && (
                                         <Text style={styles.noDataText}>No sets recorded for this exercise.</Text>
                                    )}
                                    {exercise.sets.map((set, setIndex) => (
                                        <View key={set.set_id ?? `set-${setIndex}`} style={styles.set}>
                                            <Text style={styles.setText}>Set {set.set_number}:</Text>
                                            <Text style={styles.weight}>{set.weight ?? '-'} lbs</Text>
                                            <Text style={styles.reps}>{set.reps ?? '-'} reps</Text>
                                        </View>
                                    ))}
                                     {exIndex < workout.exercises.length - 1 && <View style={styles.exerciseSeparator} />}
                                </View>
                            ))}
                        </View>
                    ))
                ) : (
                    <Text style={styles.noWorkouts}>No workouts found for {selectedMonthName} {selectedYear}</Text>
                )}
            </ScrollView>

  
             <Modal
                visible={showMonthPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMonthPicker(false)}
            >
                 <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={() => setShowMonthPicker(false)}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Select Month</Text>
                        <ScrollView>
                            {months.map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedMonthName(m);
                                        setShowMonthPicker(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{m}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
             <Modal
                visible={showYearPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowYearPicker(false)}
            >
                 <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={() => setShowYearPicker(false)}>
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Select Year</Text>
                        <ScrollView>
                            {years.map((y) => (
                                <TouchableOpacity
                                    key={y}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedYear(y);
                                        setShowYearPicker(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{y}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({

     container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
        paddingHorizontal: 15, 
        paddingTop: (Platform.OS === 'android' ? 25 : 50),
    },
    title: {
        fontSize: 28, 
        fontWeight: "bold",
        color: '#343A40', 
        marginBottom: 20,
        textAlign: 'center',
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
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: "48%",
        borderWidth: 1,
        borderColor: '#CED4DA',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
     filterButtonText: {
        fontSize: 15,
        color: '#495057',
    },
    downButton: {
        fontSize: 14,
        color: "#6C757D", 
    },
    statsBox: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: "center",
         borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    stat: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "600", 
        color: '#0066FF', 
    },
    statLabel: {
        fontSize: 14,
        color: "#6C757D", 
        marginTop: 3,
    },
    workoutList: {
        flex: 1,
    },
    workoutCard: {
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        overflow: 'hidden', 
    },
     workoutHeader: {
        padding: 15,
        backgroundColor: '#F8F9FA', 
    },
    workoutName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#343A40',
        marginBottom: 4,
    },
    workoutDate: {
        fontSize: 13,
        color: '#6C757D',
        fontWeight: '500',
    },
    separatorLine: {
        height: 1,
        backgroundColor: "#E9ECEF", 
    },
    exerciseContainer: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5, 
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 8,
    },
    set: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingVertical: 8, 
        paddingHorizontal: 5, 
        borderBottomWidth: 1,
        borderBottomColor: "#F8F9FA",
    },
     setText: {
        fontSize: 14,
        color: '#6C757D',
        width: '25%',
    },
    weight: {
        fontSize: 15,
        fontWeight: '500',
        color: '#343A40',
        textAlign: 'center',
        width: '35%', 
    },
    reps: {
        fontSize: 15,
        fontWeight: '500',
        color: '#343A40',
        textAlign: 'right',
        width: '30%',
    },
     exerciseSeparator: {
        height: 1,
        backgroundColor: '#F1F3F5',
        marginVertical: 10, 
        marginHorizontal: -5,
    },
    noWorkouts: {
        textAlign: "center",
        fontSize: 16,
        color: "#6C757D",
        marginTop: 40,
        paddingHorizontal: 20,
    },
     noDataText: {
        fontSize: 13,
        color: '#ADB5BD',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 10,
    },
    errorText: {
        textAlign: "center",
        fontSize: 16,
        color: "#DC3545", 
        marginTop: 40,
        paddingHorizontal: 20,
    },

    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 15, 
        paddingHorizontal: 0, 
        maxHeight: "70%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600", 
        color: '#343A40',
        textAlign: "center",
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    modalItem: {
        paddingVertical: 14,
        paddingHorizontal: 20, 
    },
    modalItemText: {
         fontSize: 16,
         color: '#495057',
    },
});


export default WorkoutHistoryScreen;