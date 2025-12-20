const express = require('express');
const router = express.Router();
const {
  generateReport,
  getAllReports
} = require('../controllers/reportController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.route('/')
  .post(generateReport)
  .get(getAllReports);

module.exports = router;