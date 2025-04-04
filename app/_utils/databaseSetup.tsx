import * as SQLite from 'expo-sqlite';
import exerciseData from '../../assets/data/exercises.json';
import { Exercise } from '../types/types';

let dbInstance: SQLite.SQLiteDatabase;


const checkIfExerciseExists = async (db: SQLite.SQLiteDatabase) => {
  try {
    // Check if the exercise table exists and has any entries
    const result = await db.getAllAsync('SELECT * FROM exercise');
    
    // If there are any results, return true, otherwise return false.
    return result.length > 0;
  } catch (error) {
    console.error("Error checking if exercise exists:", error);
    return false;
  }
};


const insertDefaultExercises = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.withTransactionAsync(async () => {
      for (const exercise of exerciseData) {
        const { exercise_id, exercise_name, muscle_group, equipment, instruction, isCustom  } = exercise as Exercise;

        await db.runAsync(
          `INSERT OR IGNORE INTO exercise (exercise_id,exercise_name, muscle_group, equipment, instruction, is_custom) VALUES (?, ?, ?, ?, ?,?);`,
          [exercise_id, exercise.exercise_name, exercise.muscle_group, exercise.equipment, exercise.instruction, 0]
        );
      }
    });
    console.log("Default exercises inserted successfully");
  } catch (error) {
    console.error("Error inserting default exercises:", error);
  }
}

const openDB = async () => {
try {
  const db =  await SQLite.openDatabaseAsync("fitspireDB.db");
  console.log("Database opened successfully");

  await  db.withTransactionAsync(async() => {
    try {
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS exercise (
            exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
            exercise_name TEXT UNIQUE NOT NULL,
            muscle_group TEXT NOT NULL,
            equipment TEXT NOT NULL,
            instructions TEXT NOT NULL,
            is_custom INTEGER DEFAULT 0
          );`
        );

        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS workout (
            workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        );

        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS workout_exercise (
            workout_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER NOT NULL,
            exercise_id INTEGER NOT NULL,
            order_in_workout INTEGER NOT NULL,
            FOREIGN KEY (workout_id) REFERENCES workout(workout_id) ON DELETE CASCADE,
            FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id) ON DELETE CASCADE
          );`
        );

        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS sets (
            set_id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_exercise_id INTEGER NOT NULL,
            set_number INTEGER NOT NULL,
            weight DECIMAL(5,2) NOT NULL,
            reps INTEGER NOT NULL,
            FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercise(workout_exercise_id) ON DELETE CASCADE
          );`
        );

        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS workout_templates (
            template_id INTEGER PRIMARY KEY AUTOINCREMENT,
            template_name TEXT UNIQUE NOT NULL
          );`
        );

        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS template_exercise (
            template_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
            template_id INTEGER NOT NULL,
            exercise_id INTEGER NOT NULL,
            order_in_template INTEGER NOT NULL,
            FOREIGN KEY (template_id) REFERENCES workout_templates(template_id) ON DELETE CASCADE,
            FOREIGN KEY (exercise_id) REFERENCES exercise(exercise_id) ON DELETE CASCADE
          );`
        );

        // After creating the tables, check if the exercise data exists
        // If it doesn't, insert the default exercises from the JSON file.
        const exerciseExists = await checkIfExerciseExists(db);
        if (!exerciseExists) {
          await insertDefaultExercises(db);
        }
        
        console.log("Tables created successfully");
      } catch (error) {
        console.error("Error creating tables:", error);
      }
      });
    }catch (error) {
      console.error("Error initializing database:", error);
    }
}

openDB();