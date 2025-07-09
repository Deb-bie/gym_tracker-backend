import { Router } from 'express';
import equipmentRoutes  from './equipment';
import userRoutes from "./auth"

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

export default router;