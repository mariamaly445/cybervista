const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  logout
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/ValidateRequest');

const registerValidation = [
  body('companyName')
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2-100 characters'),
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.put('/change-password', requireAuth, changePassword);
router.delete('/deactivate', requireAuth, deactivateAccount);
router.post('/logout', requireAuth, logout);

module.exports = router;