const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile
} = require('../controllers/profileController');

// POST /api/profile - Create new profile
router.post('/', createProfile);

// GET /api/profile/:userId - Get profile by user ID
router.get('/:userId', getProfile);

module.exports = router;