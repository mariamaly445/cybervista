const CompanyProfile = require('../models/CompanyProfile');
const VulnerabilityScan = require('../models/VulnerabilityScan');
const SecurityAlert = require('../models/SecurityAlert');
const Score = require('../models/Score');
const User = require('../models/User');

exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profile = await CompanyProfile.findOne({ userId });
    const latestScan = await VulnerabilityScan.findOne({ userId })
      .sort({ scanDate: -1 })
      .limit(1);
    
    const unreadAlerts = await SecurityAlert.countDocuments({
      userId,
      isRead: false
    });
    
    const criticalAlerts = await SecurityAlert.countDocuments({
      userId,
      alertLevel: 'critical',
      isResolved: false
    });
    
    const totalScans = await VulnerabilityScan.countDocuments({ userId });
    const completedScans = await VulnerabilityScan.countDocuments({
      userId,
      status: 'completed'
    });
    
    const recentAlerts = await SecurityAlert.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title message alertLevel alertType createdAt isRead');
    
    const recentScans = await VulnerabilityScan.find({ userId })
      .sort({ scanDate: -1 })
      .limit(5)
      .select('scanName targetUrl status scanDate results.total');

    const dashboardData = {
      userInfo: {
        companyName: user.companyName,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan
      },
      metrics: {
        securityScore: profile?.overallSecurityScore || 50,
        totalScans,
        completedScans,
        vulnerabilities: latestScan?.results?.total || 0,
        criticalVulnerabilities: latestScan?.results?.critical || 0
      },
      alerts: {
        unreadCount: unreadAlerts,
        criticalCount: criticalAlerts,
        recent: recentAlerts
      },
      recentActivity: {
        scans: recentScans,
        lastScanDate: latestScan?.scanDate || null
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};