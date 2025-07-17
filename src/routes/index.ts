import { Router } from 'express';
import equipmentRoutes  from './equipment';
import userRoutes from "./auth"
import workoutSessionRoutes from "./workoutSession";
import workoutExerciseRoutes from "./workoutExercise"
import progressRoutes from './progress'

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/equipments', equipmentRoutes);
router.use('/users', userRoutes )
router.use('/workouts', workoutSessionRoutes)
router.use('/workout/exercises', workoutExerciseRoutes)
router.use('/progress', progressRoutes)

export default router;