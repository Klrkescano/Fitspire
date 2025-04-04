export interface Set {
    id: number;
    weight: number | null;
    reps: number | null;
}

export interface Exercise {
    id: number;
    name: string;
    muscle_group: string;
    equipment: string;
    instruction: string;
    sets: Set[];
}

export interface Workout {
    id: string;
    name: string;
    exercises: Exercise[];
}
