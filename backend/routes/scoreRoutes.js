const express = require('express');
const router = express.Router();
const {
  calculateScore
} = require('../controllers/scoreController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/', calculateScore);

module.exports = router;