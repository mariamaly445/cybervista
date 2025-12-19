const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const auth = require('../middleware/auth'); // Use your existing auth middleware

router.post('/', auth, scoreController.createScore);
router.get('/', auth, scoreController.getScores);

module.exports = router;