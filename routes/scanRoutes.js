const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');

// All scan routes require authentication
router.use(authMiddleware);

// POST /api/scans - Create new scan
router.post('/', scanController.createScan);

// GET /api/scans - Get all scans for user
router.get('/', scanController.getAllScans);

// GET /api/scans/:id - Get single scan
router.get('/:id', scanController.getScanById);

// DELETE /api/scans/:id - Delete scan
router.delete('/:id', scanController.deleteScan);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Scan routes working!' });
});

module.exports = router;