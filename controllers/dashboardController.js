// controllers/dashboardController.js
const CompanyProfile = require('../models/CompanyProfile');
const VulnerabilityScan = require('../models/VulnerabilityScan');
const SecurityAlert = require('../models/SecurityAlert');

// Get dashboard data for a user
const getDashboardData = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get profile data
    const profile = await CompanyProfile.findOne({ userId }).populate(
      'userId',
      'companyName email'
    );

    // Get latest scan
    const latestScan = await VulnerabilityScan.findOne({ userId })
      .sort({ scanDate: -1 })
      .exec();

    // Get unread alerts count
    const unreadAlerts = await SecurityAlert.countDocuments({
      userId,
      isRead: false
    });

    // Get total scans
    const totalScans = await VulnerabilityScan.countDocuments({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'No profile found for this user' });
    }

    const dashboardData = {
      companyInfo: {
        name: profile.userId?.companyName || 'Unknown',
        email: profile.userId?.email || ''
      },
      securityMetrics: {
        overallScore: profile.overallSecurityScore || 0,
        lastAssessment: profile.lastAssessmentDate,
        complianceStatus: profile.complianceStatus || {}
      },
      scanInfo: {
        latestScan: latestScan
          ? {
              date: latestScan.scanDate,
              status: latestScan.status,
              vulnerabilities: latestScan.results || {}
            }
          : null,
        totalScans: totalScans
      },
      alerts: {
        unreadCount: unreadAlerts,
        totalUnread: unreadAlerts
      },
      questionnaireProgress: {
        // if you later add questionsAnswered, this will just start working
        answered: profile.securityQuestionnaire?.questionsAnswered || 0,
        total: 6,
        percentage: Math.round(
          ((profile.securityQuestionnaire?.questionsAnswered || 0) / 6) * 100
        )
      }
    };

    return res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };
