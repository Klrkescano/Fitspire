export interface Exercise {
    id: number;
    name: string;
    muscle: string;
    equipment: string;
    instruction: string;
    sets: Set[];
}

export interface Set {
    id: number;
    weight: number | null;
    reps: number | null;
}