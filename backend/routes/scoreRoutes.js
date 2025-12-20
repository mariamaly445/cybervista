const express = require('express');
const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Scores API is working',
    scores: [
      { id: 1, score: 85, risk: 'Medium' },
      { id: 2, score: 78, risk: 'High' }
    ]
  });
});

router.post('/calculate', (req, res) => {
  res.json({
    success: true,
    message: 'Score calculated',
    score: 85,
    risk: 'Medium'
  });
});

module.exports = router;
