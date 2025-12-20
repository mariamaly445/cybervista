const AuditReport = require('../models/AuditReport');
const CompanyProfile = require('../models/CompanyProfile');
const VulnerabilityScan = require('../models/VulnerabilityScan');

const generatePDFReport = async (reportData) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return `https://api.cybervista.com/reports/${Date.now()}.pdf`;
};

exports.generateReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reportType = 'security_assessment', title, description } = req.body;
    
    const report = await AuditReport.create({
      userId,
      reportType,
      title: title || `${reportType.replace('_', ' ')} Report`,
      description: description || `Automated ${reportType.replace('_', ' ')} report`,
      status: 'generating'
    });
    
    setTimeout(async () => {
      try {
        const profile = await CompanyProfile.findOne({ userId });
        const latestScan = await VulnerabilityScan.findOne({ userId })
          .sort({ scanDate: -1 })
          .limit(1);
        
        const reportData = {
          securityScore: profile?.overallSecurityScore || 50,
          vulnerabilities: latestScan?.results || {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
          },
          complianceStatus: profile?.complianceStatus || {
            pciDss: false,
            iso27001: false,
            gdpr: false
          },
          recommendations: [
            'Implement regular security assessments',
            'Enable multi-factor authentication',
            'Conduct employee security training',
            'Perform regular vulnerability scans'
          ]
        };
        
        const fileUrl = await generatePDFReport(reportData);
        
        await AuditReport.findByIdAndUpdate(report._id, {
          status: 'completed',
          data: reportData,
          fileUrl,
          generatedAt: new Date()
        });
        
      } catch (error) {
        console.error('Report generation error:', error);
        
        await AuditReport.findByIdAndUpdate(report._id, {
          status: 'failed',
          data: { error: error.message }
        });
      }
    }, 1000);
    
    res.status(201).json({
      success: true,
      message: 'Report generation started',
      data: {
        report: {
          id: report._id,
          title: report.title,
          reportType: report.reportType,
          status: report.status,
          generatedAt: report.generatedAt
        }
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reports = await AuditReport.find({ userId })
      .sort({ generatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await AuditReport.countDocuments({ userId });
    
    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};