import * as SQLite from 'expo-sqlite';
import exerciseData from '../assets/data/exercises.json';
import { Exercise, WorkoutExercise,Workout, WorkoutHistoryEntry } from '../.types/types';

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
            workout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(workout_name, workout_date)
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
export const checkIfExerciseExists = async (db: SQLite.SQLiteDatabase) => {
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
export const insertDefaultExercises = async (db: SQLite.SQLiteDatabase) => {
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

export const saveWorkoutSession = async (db: SQLite.SQLiteDatabase, workout: Workout) => {
  try {
    await db.withTransactionAsync(async () => {
      const { workout_name, workout_date, exercises } = workout;

      // Try to insert the workout if it doesn't exist yet
      const insertWorkoutResult = await db.getFirstAsync<{ lastInsertRowId: number }>(
        `
        INSERT INTO workout (workout_name, workout_date)
        SELECT ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM workout WHERE workout_name = ? AND workout_date = ?
        )
        `,
        [workout_name, workout_date, workout_name, workout_date]
      );

      // If we inserted it, use its ID, otherwise fetch the existing one
      let workoutId = insertWorkoutResult?.lastInsertRowId;

      if (!workoutId) {
        const existing = await db.getFirstAsync<{ workout_id: number }>(
          `SELECT workout_id FROM workout WHERE workout_name = ? AND workout_date = ?`,
          [workout_name, workout_date]
        );
        workoutId = existing?.workout_id;

        if (!workoutId) throw new Error('Workout already exists but failed to retrieve its ID.');
      }

      console.log('Workout ID to use:', workoutId);

      // Save exercises and sets
      for (const [index, exercise] of exercises.entries()) {
        const exerciseResult = await db.getFirstAsync<{ lastInsertRowId: number }>(
          `INSERT INTO workout_exercise (workout_id, exercise_id, order_in_workout) VALUES (?, ?, ?)`,
          [workoutId, exercise.exercise_id, index + 1]
        );

        const workout_exercise_id = exerciseResult?.lastInsertRowId ?? 0;
        console.log('Exercise inserted with ID:', workout_exercise_id);

        for (const set of exercise.sets) {
          await db.runAsync(
            `INSERT INTO sets (workout_exercise_id, set_number, weight, reps) VALUES (?, ?, ?, ?)`,
            [
              workout_exercise_id,
              set.set_number ?? 0,
              set.weight ?? 0,
              set.reps ?? 0
            ]
          );
        }
      }
    });

    console.log('Workout session saved!');
  } catch (error) {
    console.error('Error saving workout session:', error);
  }
};

export async function getWorkoutSessions(db: SQLite.SQLiteDatabase): Promise<Workout[]> {
  try {
    const result = await db.getAllAsync(
      `SELECT w.workout_id, w.workout_name, w.workout_date, we.exercise_id, we.order_in_workout, e.exercise_name, e.muscle_group, e.equipment, e.instructions, e.is_custom,
              s.set_id, s.set_number, s.weight, s.reps
       FROM workout w
       LEFT JOIN workout_exercise we ON w.workout_id = we.workout_id
       LEFT JOIN exercise e ON we.exercise_id = e.exercise_id
       LEFT JOIN sets s ON we.workout_exercise_id = s.workout_exercise_id
       ORDER BY w.workout_date DESC`
    );
    return result as Workout[];
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return [];
  }
}

export async function updateWorkoutSession(db: SQLite.SQLiteDatabase, workout: Workout): Promise<void> {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE workout SET workout_name = ?, workout_date = ? WHERE workout_id = ?`,
        [workout.workout_name, workout.workout_date, workout.workout_id ?? 0]
      );

      for (const exercise of workout.exercises) {
        await db.runAsync(
          `UPDATE workout_exercise SET order_in_workout = ? WHERE workout_exercise_id = ?`,
          [exercise.order_in_workout, exercise.workout_exercise_id]
        );

        for (const set of exercise.sets) {
          await db.runAsync(
            `UPDATE sets SET weight = ?, reps = ? WHERE set_id = ?`,
            [set.weight ?? 0, set.reps ?? 0, set.set_id ?? 0]
          );
        }
      }
    });
  } catch (error) {
    console.error("Error updating workout session:", error);
  }
}



export const getWorkoutHistoryByMonthYear = async (
  db: SQLite.SQLiteDatabase,
  month: number,
  year: number
): Promise<WorkoutHistoryEntry[]> => {

  // Format month number with leading zero (e.g., '03' for March)
  const monthString = month.toString().padStart(2, '0');
  const yearString = year.toString();

  try {
      // Comprehensive query joining all necessary tables (Adjust table/column names if needed)
      const query = `
          SELECT
              w.workout_id, w.workout_name, w.workout_date,
              we.workout_exercise_id, we.order_in_workout,
              e.exercise_id, e.exercise_name, -- Add e.muscle_group, e.equipment here if needed
              s.set_id, s.set_number, s.weight, s.reps
          FROM workout w
          LEFT JOIN workout_exercise we ON w.workout_id = we.workout_id
          LEFT JOIN exercise e ON we.exercise_id = e.exercise_id
          LEFT JOIN sets s ON we.workout_exercise_id = s.workout_exercise_id
          WHERE strftime('%Y', w.workout_date) = ? AND strftime('%m', w.workout_date) = ?
          ORDER BY w.workout_date DESC, we.order_in_workout ASC, s.set_number ASC;
      `;

      // Use getAllAsync for potentially many rows
      // Define expected row structure for type safety (optional but recommended)
      type HistoryQueryResultRow = {
          workout_id: number;
          workout_name: string;
          workout_date: string; // ISO string
          workout_exercise_id: number | null; // LEFT JOIN can result in nulls
          order_in_workout: number | null;
          exercise_id: number | null;
          exercise_name: string | null;
          set_id: number | null;
          set_number: number | null;
          weight: number | null;
          reps: number | null;
      }

      const results = await db.getAllAsync<HistoryQueryResultRow>(query, [yearString, monthString]);

      // --- Process the flat results into nested structure ---
      const processedData: WorkoutHistoryEntry[] = [];
      // Use Map for efficient grouping by workout_id
      const workoutMap = new Map<number, WorkoutHistoryEntry>();

      for (const row of results) {
          // Skip rows that don't even have a workout (shouldn't happen with this query, but safe check)
          if (row.workout_id === null) continue;

          let workout = workoutMap.get(row.workout_id);

          // If workout not yet in map, create it
          if (!workout) {
              workout = {
                  workout_id: row.workout_id,
                  workout_name: row.workout_name ?? 'Unnamed Workout',
                  workout_date_iso: row.workout_date, // Store raw ISO date
                  exercises: [],
              };
              workoutMap.set(row.workout_id, workout);
              processedData.push(workout); // Add to ordered array
          }

          // Check if exercise details exist (due to LEFT JOIN)
          if (row.workout_exercise_id !== null && row.exercise_id !== null) {
              // Find or create exercise within the workout
              let exercise = workout.exercises.find(ex => ex.workout_exercise_id === row.workout_exercise_id);
              if (!exercise) {
                  exercise = {
                      workout_exercise_id: row.workout_exercise_id,
                      order_in_workout: row.order_in_workout ?? 0,
                      exercise_id: row.exercise_id,
                      exercise_name: row.exercise_name ?? 'Unknown Exercise',
                      // Add muscle_group/equipment here if selected in query and needed
                      sets: [],
                  };
                  workout.exercises.push(exercise);
              }

              // Add set to the exercise, only if set details exist
              if (row.set_id !== null && row.set_number !== null && row.weight !== null && row.reps !== null) {
                  // Avoid adding duplicate sets if query/data has issues
                  if (!exercise.sets.some(s => s.set_id === row.set_id)) {
                      exercise.sets.push({
                          set_id: row.set_id,
                          set_number: row.set_number,
                          weight: row.weight,
                          reps: row.reps,
                      });
                  }
              }
          }
      }

      console.log(`Workspaceed ${processedData.length} workouts for ${monthString}/${yearString}`);
      return processedData;

  } catch (err: any) {
      console.error(`Failed to fetch workout history for ${monthString}/${yearString}:`, err);
      // Re-throw error or return empty array, depending on desired error handling
      throw new Error("Database query failed: " + err.message);
      // Or return [];
  }
};