import * as SQLite from 'expo-sqlite';
import { 
  openDB,
  insertDefaultExercises,
  getAllExercises,
  getExercisesFromTemplate,
  getExercisesFromWorkout,
  insertWorkoutSession, 
  insertExerciseForSession, 
  checkIfExerciseExists 
} from '../.utils/databaseSetup';
import { SQLiteDatabase } from 'expo-sqlite';
import exerciseData from '../assets/data/exercises.json';

// Mock the SQLite module to control its behavior in tests
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => ({
    execAsync: jest.fn(async () => {}), // Mock for table creation and inserts
    getAllAsync: jest.fn(async () => []), // Default mock to return empty array
    runAsync: jest.fn(async () => {}),
    getFirstAsync: jest.fn(async () => undefined),
    withTransactionAsync: jest.fn(async (callback) => { await callback(); }), // Mock transactions
  })),
}));

describe('Database Interface Testing', () => {
  let mockDb: SQLite.SQLiteDatabase;
  let mockOpenDatabaseAsync: jest.Mock;

  beforeEach(() => {
    // Reset the mock before each test to ensure isolation
    mockOpenDatabaseAsync = SQLite.openDatabaseAsync as jest.Mock;
    mockDb = {
      execAsync: jest.fn(async () => {}),
      getAllAsync: jest.fn(async () => []),
      runAsync: jest.fn(async () => {}),
      getFirstAsync: jest.fn(async () => undefined),
      withTransactionAsync: jest.fn(async (callback) => { await callback(); }),
    } as unknown as SQLite.SQLiteDatabase; // Type assertion for easier mocking
    mockOpenDatabaseAsync.mockResolvedValue(mockDb);
  });

  // Test Case 1: Validate Application Data Production (Table Creation)
  test('openDB should execute SQL to create tables', async () => {
    await openDB();

    // Expect execAsync to have been called with the CREATE TABLE statements
    expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS exercise'));
    expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS workout'));
    expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS workout_exercise'));
    expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS sets'));
    expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS workout_templates'));
    expect(mockDb.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS template_exercise'));
  });

  // Test Case 2: Validate Platform Data Reception (Table Creation Success)
  test('openDB should resolve without errors if table creation succeeds', async () => {
    await expect(openDB()).resolves.toBe(mockDb);
    expect(console.log).toHaveBeenCalledWith('Database opened successfully');
    expect(console.log).toHaveBeenCalledWith('Tables created successfully');
  });

  // Test Case 3: Validate Application Data Production (Default Exercise Insertion - Data Format)
  test('insertDefaultExercises should insert exercises in the correct format', async () => {
    const mockRunAsync = jest.fn();
    mockDb.runAsync = mockRunAsync;
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb); // Ensure mockDb is used

    await insertDefaultExercises(mockDb);

    // Expect runAsync to be called for each exercise with the correct SQL and parameters
    exerciseData.forEach((exercise) => {
      expect(mockRunAsync).toHaveBeenCalledWith(
        `INSERT OR IGNORE INTO exercise (exercise_id, exercise_name, muscle_group, equipment, instructions, is_custom) VALUES (?, ?, ?, ?, ?, ?);`,
        [exercise.exercise_id, exercise.exercise_name, exercise.muscle_group, exercise.equipment, exercise.instructions, 0]
      );
    });
    expect(console.log).toHaveBeenCalledWith('Default exercises inserted successfully');
  });

  // Test Case 4: Validate Platform Data Reception (Checking if Exercises Exist)
  test('checkIfExerciseExists should correctly interpret database results', async () => {
    // Scenario 1: Exercises exist
    (mockDb.getAllAsync as jest.Mock).mockResolvedValue([{ exercise_id: 1 }]);
    expect(await checkIfExerciseExists(mockDb)).toBe(true);

    // Scenario 2: No exercises exist (empty array)
    (mockDb.getAllAsync as jest.Mock).mockResolvedValue([]);
    expect(await checkIfExerciseExists(mockDb)).toBe(false);
  });

  // Test Case 5: Validate Application Requests and Platform Data Production (getAllExercises)
  test('getAllExercises should return data in the expected format', async () => {
    const mockExercises = [
      { exercise_id: 1, exercise_name: 'Squat', muscle_group: 'Legs', equipment: 'Barbell', instructions: '...' },
      { exercise_id: 2, exercise_name: 'Bench Press', muscle_group: 'Chest', equipment: 'Barbell', instructions: '...' },
    ];
    (mockDb.getAllAsync as jest.Mock).mockResolvedValue(mockExercises);

    const exercises = await getAllExercises(mockDb);
    expect(exercises).toEqual(mockExercises);
  });

  // Test Case 6: Validate Application Requests and Platform Data Production (getExercisesFromTemplate)
  test('getExercisesFromTemplate should return exercises joined with template data', async () => {
    const mockTemplateExercises = [
      { id: 1, exercise_name: 'Squat', muscle_group: 'Legs', equipment: 'Barbell', instructions: '...', is_custom: 0 },
      { id: 2, exercise_name: 'Lunges', muscle_group: 'Legs', equipment: 'Bodyweight', instructions: '...', is_custom: 0 },
    ];
    (mockDb.getAllAsync as jest.Mock).mockResolvedValue(mockTemplateExercises);

    const exercises = await getExercisesFromTemplate(mockDb, 1);
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining(`SELECT e.exercise_id AS id, e.exercise_name, e.muscle_group, e.equipment, e.instructions, e.is_custom FROM template_exercise te JOIN exercise e ON te.exercise_id = e.exercise_id WHERE te.template_id = ? ORDER BY te.order_in_template`),
      [1]
    );
    expect(exercises).toEqual(mockTemplateExercises);
  });

  // Test Case 7: Validate Application Requests and Platform Data Production (getExercisesFromWorkout)
  test('getExercisesFromWorkout should return workout exercises with workout_exercise_id', async () => {
    const mockWorkoutExercises = [
      { id: 3, exercise_name: 'Deadlift', muscle_group: 'Back', equipment: 'Barbell', instructions: '...', is_custom: 0, workout_exercise_id: 10 },
      { id: 4, exercise_name: 'Overhead Press', muscle_group: 'Shoulders', equipment: 'Barbell', instructions: '...', is_custom: 0, workout_exercise_id: 11 },
    ];
    (mockDb.getAllAsync as jest.Mock).mockResolvedValue(mockWorkoutExercises);

    const exercises = await getExercisesFromWorkout(mockDb, 5);
    expect(mockDb.getAllAsync).toHaveBeenCalledWith(
      expect.stringContaining(`SELECT e.exercise_id AS id, e.exercise_name, e.muscle_group, e.equipment, e.instructions, e.is_custom, we.workout_exercise_id FROM workout_exercise we JOIN exercise e ON we.exercise_id = e.exercise_id WHERE we.workout_id = ? ORDER BY we.order_in_workout`),
      [5]
    );
    expect(exercises).toEqual(mockWorkoutExercises);
  });

  // Test Case 8: Validate Application Data Production (insertWorkoutSession)
  test('insertWorkoutSession should insert a workout and return its ID', async () => {
    const mockInsertId = 123;
    (mockDb.runAsync as jest.Mock).mockResolvedValue({});
    (mockDb.getFirstAsync as jest.Mock).mockResolvedValue({ id: mockInsertId });

    const workoutId = await insertWorkoutSession(mockDb, 'Morning Workout');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      `INSERT INTO workout (workout_name) VALUES (?)`,
      ['Morning Workout']
    );
    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(`SELECT last_insert_rowid() as id`);
    expect(workoutId).toBe(mockInsertId);
  });

  // Test Case 9: Validate Application Data Production (insertExerciseForSession)
  test('insertExerciseForSession should insert an exercise for a workout session', async () => {
    await insertExerciseForSession(mockDb, 123, 456, 1);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      `INSERT INTO workout_exercise (workout_id, exercise_id, order_in_workout) VALUES (?, ?, ?)`,
      [123, 456, 1]
    );
  });

  // You can add more test cases to cover error scenarios, data validation, etc.
});