const express = require('express');
const router = express.Router();
const {
  getAllVerifications,
  submitVerification
} = require('../controllers/identityController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.route('/')
  .get(getAllVerifications)
  .post(submitVerification);

module.exports = router;