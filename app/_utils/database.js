import React, { useEffect } from 'react';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const App = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Open the database or create it if it doesn't exist
        const db = await SQLite.openDatabase(
          { name: 'workout_tracker.db', location: 'default' },
          () => console.log('Database opened successfully'),
          error => console.log('Error opening database:', error)
        );

        // Create tables if they don't exist
        await db.transaction(async (tx) => {
          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS WorkoutTemplates (
              template_id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT
            );
          `);

          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS Workouts (
              workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              template_id INTEGER,
              date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (template_id) REFERENCES WorkoutTemplates(template_id)
            );
          `);

          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS Exercises (
              exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT,
              type TEXT
            );
          `);

          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS WorkoutExercises (
              workout_exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
              workout_id INTEGER NOT NULL,
              exercise_id INTEGER NOT NULL,
              FOREIGN KEY (workout_id) REFERENCES Workouts(workout_id),
              FOREIGN KEY (exercise_id) REFERENCES Exercises(exercise_id)
            );
          `);

          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS Sets (
              set_id INTEGER PRIMARY KEY AUTOINCREMENT,
              workout_exercise_id INTEGER NOT NULL,
              reps INTEGER NOT NULL,
              weight REAL,
              rest_time INTEGER,
              FOREIGN KEY (workout_exercise_id) REFERENCES WorkoutExercises(workout_exercise_id)
            );
          `);

          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS WorkoutHistory (
              history_id INTEGER PRIMARY KEY AUTOINCREMENT,
              workout_id INTEGER NOT NULL,
              user_id INTEGER NOT NULL,
              date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (workout_id) REFERENCES Workouts(workout_id)
            );
          `);
        });

        console.log('Database tables created successfully.');
      } catch (error) {
        console.log('Error setting up database:', error);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <></>
  );
};

export default App;
