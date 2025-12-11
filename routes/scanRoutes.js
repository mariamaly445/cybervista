const express = require("express");
const router = express.Router();
const {
  createScan,
  getScans,
  updateScanStatus
} = require("../controllers/scanController");

// POST /api/scans
router.post("/", createScan);

// GET /api/scans/user/:userId
router.get("/user/:userId", getScans);

// PUT /api/scans/:id/status
router.put("/:id/status", updateScanStatus);

module.exports = router;