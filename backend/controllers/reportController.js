const AuditReport = require('../models/AuditReport');

const reportController = {
    // Generate a new report
    generateReport: async (req, res) => {
        try {
            const newReport = new AuditReport({
                userId: req.body.userId || 'temp-user-id', // In production, use req.user.id from auth middleware
                reportType: req.body.reportType || 'Security Assessment',
                status: 'Generated',
                findings: req.body.findings || [],
                recommendations: req.body.recommendations || []
            });

            await newReport.save();

            res.status(201).json({
                success: true,
                message: 'Report generated successfully',
                report: newReport
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get all reports for user
    getAllReports: async (req, res) => {
        try {
            const reports = await AuditReport.find({})
                .sort({ createdAt: -1 })
                .limit(50);

            res.status(200).json({
                success: true,
                count: reports.length,
                reports
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },

    // Get single report by ID
    getReportById: async (req, res) => {
        try {
            const report = await AuditReport.findById(req.params.id);
            
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found'
                });
            }

            res.status(200).json({
                success: true,
                report
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

module.exports = reportController;