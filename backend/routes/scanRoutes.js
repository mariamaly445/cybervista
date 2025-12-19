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

// PUT /api/scans/:id - Update scan
router.put('/:id', scanController.updateScan);

// DELETE /api/scans/:id - Delete scan
router.delete('/:id', scanController.deleteScan);

// GET /api/scans/stats - Get scan statistics
router.get('/stats', scanController.getScanStats);

module.exports = router;