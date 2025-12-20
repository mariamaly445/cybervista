const express = require('express');
const router = express.Router();
const {
  createScan,
  getAllScans
} = require('../controllers/scanController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.route('/')
  .post(createScan)
  .get(getAllScans);

module.exports = router;