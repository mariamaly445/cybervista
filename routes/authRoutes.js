
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/login', authController.login);A

router.get('/me/:userId', authController.getMe);

router.get('/me', authController.getMe);

module.exports = router;
