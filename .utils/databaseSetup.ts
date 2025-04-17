import * as SQLite from 'expo-sqlite';
import exerciseData from '../assets/data/exercises.json';
import { Exercise, WorkoutExercise } from '../.types/types';

let dbInstance: SQLite.SQLiteDatabase;


// Database initialization function
// This function creates  the database and the tables.
export const openDB = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("fitspireDB.db");
    console.log("Database opened successfully");

    await db.withTransactionAsync(async () => {
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

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

openDB();


//Function to check if the exercise table has the default exercises
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

// Function to insert default exercises into the exercise table
const insertDefaultExercises = async (db: SQLite.SQLiteDatabase) => {
  try {
    for (const exercise of exerciseData) {
      const { exercise_id, exercise_name, muscle_group, equipment, instructions } = exercise as Exercise;

      await db.runAsync(
        `INSERT OR IGNORE INTO exercise (exercise_id, exercise_name, muscle_group, equipment, instructions, is_custom) VALUES (?, ?, ?, ?, ?, ?);`,
        [exercise_id, exercise_name, muscle_group, equipment, instructions, 0]
      );
    }
    console.log("Default exercises inserted successfully");
  } catch (error) {
    console.error("Error inserting default exercises:", error);
  }
};


// Function to fetch all exercises from exercise table  
// - Used in the exercise library modal to display all exercises to the user
export const getAllExercises = async (db: SQLite.SQLiteDatabase) => {
  try {
    const result = await db.getAllAsync("SELECT * FROM exercise;");
    return result;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}


// Function to fetch the exercises from a workout template (WORKOUT_TEMPLATE TABLE)
export async function getExercisesFromTemplate(db: SQLite.SQLiteDatabase, template_id: number): Promise<Exercise[]> {
  const results = await db.getAllAsync(
    `SELECT e.exercise_id AS id, e.exercise_name, e.muscle_group, e.equipment, e.instructions, e.is_custom
     FROM template_exercise te
     JOIN exercise e ON te.exercise_id = e.exercise_id
     WHERE te.template_id = ?
     ORDER BY te.order_in_template`,
    [template_id]
  );
  return results as Exercise[];
}

// Function to fetch the exercises from a a recorded workout sessions (WORKOUT TABLE)
export async function getExercisesFromWorkout(db: SQLite.SQLiteDatabase, session_id: number): Promise<WorkoutExercise[]> {
  const results = await db.getAllAsync(
    `SELECT e.exercise_id AS id, e.exercise_name, e.muscle_group, e.equipment, e.instructions, e.is_custom,
            we.workout_exercise_id
     FROM workout_exercise we
     JOIN exercise e ON we.exercise_id = e.exercise_id
     WHERE we.workout_id = ?
     ORDER BY we.order_in_workout`,
    [session_id]
  );
  return results as WorkoutExercise[];
}

// Function to save the workout template to the database 
export async function insertWorkoutSession(db: SQLite.SQLiteDatabase, workout_name: string): Promise<number> {
  await db.runAsync(
    `INSERT INTO workout (workout_name) VALUES (?)`,
    [workout_name]
  );
  const result = await db.getFirstAsync<{ id: number }>(`SELECT last_insert_rowid() as id`);
  return result?.id ?? 0;
}


export async function insertExerciseForSession(db: SQLite.SQLiteDatabase, workout_id: number, exercise_id: number, orderInWorkout: number): Promise<void> {
  await db.runAsync(
    `INSERT INTO workout_exercise (workout_id, exercise_id, order_in_workout)
     VALUES (?, ?, ?)`,
    [workout_id, exercise_id, orderInWorkout]
  );
}





