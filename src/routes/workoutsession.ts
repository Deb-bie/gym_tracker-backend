import { Router } from 'express';
import WorkoutSessionController from '../controllers/workoutSession';
const router = Router();

router.post('/', WorkoutSessionController.createWorkoutSession);
router.get('/recent', WorkoutSessionController.getRecentWorkouts)
router.get('/:id', WorkoutSessionController.getWorkoutSessionById);
router.patch('/:id', WorkoutSessionController.endWorkoutSession)

export default router;