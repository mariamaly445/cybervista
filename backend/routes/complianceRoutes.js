const express = require('express');
const router = express.Router();

router.get('/:standard', (req, res) => {
  res.json({
    standard: req.params.standard,
    checklist: [
      { id: 1, requirement: 'Firewall Configuration', status: 'completed' },
      { id: 2, requirement: 'Data Encryption', status: 'in-progress' }
    ]
  });
});

module.exports = router;
