import { WorkoutExercise } from "@prisma/client";

export interface ProgressData {
  equipmentId: number;
  exercises: WorkoutExercise[];
  maxWeight: number;
  totalVolume: number;
  lastWorkout: string;
}