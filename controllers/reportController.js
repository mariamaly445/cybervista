const AuditReport = require('../models/AuditReport');
const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');

// Generate audit report
const generateReport = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user and profile data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await CompanyProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Mock PDF generation (for now - returns JSON)
    // In future, you can add actual PDF generation with libraries like pdfkit
    const reportData = {
      companyName: user.companyName,
      reportDate: new Date(),
      securityScore: profile.overallSecurityScore || 0,
      vulnerabilitiesFound: 0, // You can calculate from scans
      complianceStatus: profile.complianceStatus || {},
      recommendations: [
        "Implement multi-factor authentication",
        "Schedule regular security audits",
        "Update incident response plan",
        "Encrypt sensitive data at rest"
      ],
      summary: ⁠ Security assessment for ${user.companyName} completed. ⁠,
      generatedBy: 'CyberVista Audit System'
    };

    // Save report to database
    const auditReport = await AuditReport.create({
      userId,
      companyName: user.companyName,
      securityScore: reportData.securityScore,
      complianceStatus: reportData.complianceStatus,
      recommendations: reportData.recommendations,
      pdfUrl: ⁠ /reports/${userId}/${Date.now()}.pdf ⁠ // Mock URL
    });

    res.status(201).json({
      message: 'Audit report generated successfully',
      reportId: auditReport._id,
      reportData: reportData,
      downloadUrl: auditReport.pdfUrl
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports for a user
const getUserReports = async (req, res) => {
  try {
    const reports = await AuditReport.find({ userId: req.params.userId })
      .sort({ reportDate: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateReport, getUserReports };
