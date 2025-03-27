export interface SetTemplate {
    id: number;
    reps: number;
    weight: number;
}

export interface ExerciseTemplate {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
    sets: SetTemplate[];
}

export interface WorkoutTemplate {
    id: number;
    name: string;
    exercises: ExerciseTemplate[];
}

export interface WorkoutSet {
    id: number;
    weight: number | null;
    reps: number | null;
    restTime: number | null;
}

export interface SessionExercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
    sets: WorkoutSet[];
}

export interface WorkoutSession {
    id: string;
    name: string;
    exercises: SessionExercise[];
}
