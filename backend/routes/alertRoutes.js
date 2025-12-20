const express = require('express');
const router = express.Router();
const {
  getAlerts,
  markAsRead
} = require('../controllers/alertController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.route('/')
  .get(getAlerts);

router.put('/:id/read', markAsRead);

module.exports = router;