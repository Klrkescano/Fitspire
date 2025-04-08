// This file contains the TypeScript interfaces for the application.


// Interface for Workout Session object recorded by user.
export interface Workout {
    workout_id: string;
    workout_name: string;
    workout_date: string;
    workout_duration: number;
    exercises: WorkoutExercise[];
}

// Interface for the exercise object.
export interface Exercise {
    exercise_id: number;
    exercise_name: string;
    muscle_group: string;
    equipment: string;
    instructions: string;
    isCustom?: number;
}

// Interface for the workoutexercise object, which is the exercise done in a workout session.
// It contains the workout_id and exercise_id to link the two tables together.
// It also contains the order of the exercise in the workout session.
export interface WorkoutExercise extends Exercise {
    workout_exercise_id: number;
    workout_id: number;
    order_in_workout: number;
    exercise_info: Exercise;
    sets: Set[];
}

// Interface for the sets object, which contains the set number, weight lifted, and reps done for each exercise in a workout session.
export interface Set {
    set_id?: number;
    workout_exercise_id: number;
    set_number: number;
    weight: number;
    reps: number;
}


// Interface for the workout template object, which is a template for a workout that users can follow.
export interface WorkoutTemplate {
    template_id: number;
    template_name: string;
}


//Interface for the template_exercise object, which is the exercise in a workout template.
export interface TemplateExercise {
    template_exercise_id: number;
    template_id: number;
    exercise_id: number;
    order_in_template: number;
}