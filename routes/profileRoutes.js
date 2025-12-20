// routes/profileRoutes.js
const express = require('express');
const router = express.Router();

const {
  createProfile,
  getProfile,
  updateProfile
} = require('../controllers/profileController');

const { requireAuth } = require('../controllers/authController');

// CREATE profile
router.post('/', requireAuth, createProfile);

// READ profile
router.get('/', requireAuth, getProfile);

// UPDATE profile
router.put('/', requireAuth, updateProfile);

module.exports = router;
