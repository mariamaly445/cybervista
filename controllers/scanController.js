const VulnerabilityScan = require("../models/VulnerabilityScan");

// POST /api/scans
exports.createScan = async (req, res) => {
  try {
    const { userId, target } = req.body;

    const scan = await VulnerabilityScan.create({
      userId,
      target,
      status: "pending"
    });

    res.status(201).json(scan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/scans/user/:userId
exports.getScans = async (req, res) => {
  try {
    const scans = await VulnerabilityScan.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/scans/:id/status
exports.updateScanStatus = async (req, res) => {
  try {
    const { status, results } = req.body;

    const updated = await VulnerabilityScan.findByIdAndUpdate(
      req.params.id,
      { status, results },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};