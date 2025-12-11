const VulnerabilityScan = require('../models/VulnerabilityScan');

const scanController = {
    // Create a new scan
    createScan: async (req, res) => {
        try {
            const { targetUrl } = req.body;
            
            if (!targetUrl) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Target URL is required' 
                });
            }

            const newScan = new VulnerabilityScan({
                userId: req.user.id,
                targetUrl,
                status: 'Pending'
            });

            await newScan.save();
            
            // Simulate scan completion after 2 seconds
            setTimeout(async () => {
                await VulnerabilityScan.findByIdAndUpdate(newScan._id, {
                    status: 'Completed',
                    results: {
                        high: Math.floor(Math.random() * 3),
                        medium: Math.floor(Math.random() * 5),
                        low: Math.floor(Math.random() * 10),
                        vulnerabilities: [
                            "Cross-Site Scripting (XSS)",
                            "SQL Injection",
                            "Insecure Direct Object References"
                        ]
                    }
                });
            }, 2000);

            res.status(201).json({
                success: true,
                message: 'Scan initiated successfully',
                scan: newScan
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get all scans for current user
    getAllScans: async (req, res) => {
        try {
            const scans = await VulnerabilityScan.find({ 
                userId: req.user.id 
            }).sort({ scanDate: -1 });

            res.status(200).json({
                success: true,
                count: scans.length,
                scans
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get single scan by ID
    getScanById: async (req, res) => {
        try {
            const scan = await VulnerabilityScan.findOne({
                _id: req.params.id,
                userId: req.user.id
            });

            if (!scan) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Scan not found' 
                });
            }

            res.status(200).json({
                success: true,
                scan
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Delete a scan
    deleteScan: async (req, res) => {
        try {
            const scan = await VulnerabilityScan.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id
            });

            if (!scan) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Scan not found' 
                });
            }

            res.status(200).json({
                success: true,
                message: 'Scan deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    }
};

module.exports = scanController;