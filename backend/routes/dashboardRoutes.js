// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');

// GET /api/dashboard/:userId
router.get('/:userId', getDashboardData);

module.exports = router; 