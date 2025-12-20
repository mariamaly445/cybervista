const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'pending',
    riskScore: 65
  });
});

router.post('/upload', (req, res) => {
  res.json({
    success: true,
    message: 'Document uploaded'
  });
});

module.exports = router;
