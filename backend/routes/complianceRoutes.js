const express = require('express');
const router = express.Router();
const {
  getAllCompliance,
  createOrUpdateCompliance
} = require('../controllers/complianceController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.route('/')
  .get(getAllCompliance)
  .post(createOrUpdateCompliance);

module.exports = router;