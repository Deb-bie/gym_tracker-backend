import { Router } from 'express';
import workoutExercise from '../controllers/workoutExercise';
const router = Router();

router.post('/', workoutExercise.addWorkoutExercise);

export default router;