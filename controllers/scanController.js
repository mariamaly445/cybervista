const VulnerabilityScan = require('../models/VulnerabilityScan');

const scanController = {
    // Create a new scan
    createScan: async (req, res) => {
        try {
            const { targetUrl, scanType = 'quick', scanName = 'Security Scan' } = req.body;
            
            if (!targetUrl) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Target URL is required' 
                });
            }

            const newScan = new VulnerabilityScan({
                userId: req.user.id,
                targetUrl,
                scanType,
                scanName,
                status: 'Pending',
                scanDate: new Date()
            });

            await newScan.save();

            res.status(201).json({
                success: true,
                message: 'Scan initiated successfully',
                data: { scan: newScan }
            });
        } catch (error) {
            console.error('Create scan error:', error);
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
                message: 'Scans retrieved successfully',
                data: {
                    scans,
                    count: scans.length
                }
            });
        } catch (error) {
            console.error('Get all scans error:', error);
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
                message: 'Scan retrieved successfully',
                data: {
                    scan
                }
            });
        } catch (error) {
            console.error('Get scan by ID error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Update a scan
    updateScan: async (req, res) => {
        try {
            const { scanName, targetUrl, scanType, status } = req.body;
            
            const scan = await VulnerabilityScan.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.user.id
                },
                {
                    scanName,
                    targetUrl,
                    scanType,
                    status,
                    updatedAt: new Date()
                },
                { 
                    new: true,
                    runValidators: true 
                }
            );

            if (!scan) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Scan not found or unauthorized' 
                });
            }

            res.status(200).json({
                success: true,
                message: 'Scan updated successfully',
                data: {
                    scan
                }
            });
        } catch (error) {
            console.error('Update scan error:', error);
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
                    message: 'Scan not found or unauthorized' 
                });
            }

            res.status(200).json({
                success: true,
                message: 'Scan deleted successfully'
            });
        } catch (error) {
            console.error('Delete scan error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    // Get scan statistics for dashboard
    getScanStats: async (req, res) => {
        try {
            const userId = req.user.id;
            
            const stats = {
                totalScans: await VulnerabilityScan.countDocuments({ userId }),
                completedScans: await VulnerabilityScan.countDocuments({ 
                    userId, 
                    status: 'Completed' 
                }),
                pendingScans: await VulnerabilityScan.countDocuments({ 
                    userId, 
                    status: 'Pending' 
                }),
                failedScans: await VulnerabilityScan.countDocuments({ 
                    userId, 
                    status: 'Failed' 
                }),
                recentScan: await VulnerabilityScan.findOne({ userId })
                    .sort({ scanDate: -1 })
                    .select('scanDate status targetUrl')
            };

            res.status(200).json({
                success: true,
                message: 'Scan statistics retrieved',
                data: stats
            });
        } catch (error) {
            console.error('Get scan stats error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error', 
                error: error.message 
            });
        }
    }
};

module.exports = scanController;