const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getProfile,
  updateQuestionnaire
} = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.route('/')
  .post(createOrUpdateProfile)
  .get(getProfile);

router.put('/questionnaire', updateQuestionnaire);

module.exports = router;