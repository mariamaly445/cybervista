const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  deactivateAccount,
  requireAuth
} = require('../controllers/authController');

// PUBLIC ROUTES (No authentication needed)

// POST /api/auth/register - Create new user account
router.post('/register', register);

// POST /api/auth/login - Authenticate user and get token
router.post('/login', login);

// PROTECTED ROUTES (Authentication required)

// GET /api/auth/profile - Get current user's profile
router.get('/profile', requireAuth, getProfile);

// PUT /api/auth/profile - Update user profile
router.put('/profile', requireAuth, updateProfile);

// DELETE /api/auth/deactivate - Deactivate user account (soft delete)
router.delete('/deactivate', requireAuth, deactivateAccount);

module.exports = router;