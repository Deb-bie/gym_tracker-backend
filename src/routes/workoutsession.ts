import { Router } from 'express';
import WorkoutSessionController from '../controllers/workoutSession';
const router = Router();

router.post('/', WorkoutSessionController.createWorkoutSession);

export default router;