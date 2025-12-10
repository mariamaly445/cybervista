const express = require('express');
const router = express.Router();
const { generateReport, getUserReports } = require('../controllers/reportController');

// GET /api/reports/:userId - Generate new report
router.get('/:userId', generateReport);

// GET /api/reports/user/:userId - Get all user's reports
router.get('/user/:userId', getUserReports);

module.exports = router;
