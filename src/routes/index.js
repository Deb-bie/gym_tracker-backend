const express = require('express');
const router = express.Router();

const equipmentRoutes = require('./equipment');

router.use('/equipment', equipmentRoutes);

module.exports = router;
