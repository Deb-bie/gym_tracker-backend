import { Router } from 'express';
import WorkoutSessionController from '../controllers/workoutSession';
const router = Router();

router.post('/', WorkoutSessionController.createWorkoutSession);
router.get('/recent', WorkoutSessionController.getRecentWorkouts)
router.get('/active', WorkoutSessionController.getActiveWorkouts)
router.get('/:id', WorkoutSessionController.getWorkoutSessionById);
router.patch('/:id', WorkoutSessionController.endWorkoutSession)

export default router;