// const express = require('express');
// const router = express.Router();

// const equipmentRoutes = require('./equipment');

// router.use('/equipment', equipmentRoutes);

// module.exports = router;



// =================

import { Router } from 'express';
import equipmentRoutes  from './equipment';

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

router.use('/equipment', equipmentRoutes);

export default router;