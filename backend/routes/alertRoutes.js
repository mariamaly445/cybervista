const express = require('express');
const router = express.Router();
const {
  createAlert,
  getAlerts,
  markAsRead,
  markAsResolved,
  getAlertStats
} = require('../controllers/alertController');

/**
 * @route   POST /api/alerts
 * @desc    Create a new security alert
 * @access  Private
 */
router.post('/', createAlert);

/**
 * @route   GET /api/alerts/user/:userId
 * @desc    Get all alerts for a user with filtering and pagination
 * @access  Private
 */
router.get('/user/:userId', getAlerts);

/**
 * @route   PUT /api/alerts/:alertId/read
 * @desc    Mark an alert as read
 * @access  Private
 */
router.put('/:alertId/read', markAsRead);

/**
 * @route   PUT /api/alerts/:alertId/resolve
 * @desc    Mark an alert as resolved
 * @access  Private
 */
router.put('/:alertId/resolve', markAsResolved);

/**
 * @route   GET /api/alerts/stats/:userId
 * @desc    Get alert statistics for dashboard
 * @access  Private
 */
router.get('/stats/:userId', getAlertStats);

module.exports = router;
