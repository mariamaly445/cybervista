const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Generate a new report (POST is standard for creation)
router.post('/', reportController.generateReport);

// Get all reports for current user
router.get('/', reportController.getAllReports);

// Get a specific report by ID
router.get('/:id', reportController.getReportById);

module.exports = router;