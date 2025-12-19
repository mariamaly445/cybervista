const SecurityAlert = require('../models/SecurityAlert');
const User = require('../models/User');

// Create a new security alert
const createAlert = async (req, res) => {
  try {
    const { userId, title, message, alertLevel, alertType, source, metadata } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create alert
    const alert = await SecurityAlert.create({
      userId,
      title,
      message,
      alertLevel: alertLevel || 'Medium',
      alertType: alertType || 'Security',
      source: source || 'Manual Entry',
      metadata: metadata || {}
    });

    // Prepare response
    const alertResponse = {
      id: alert._id,
      title: alert.title,
      message: alert.message,
      alertLevel: alert.alertLevel,
      alertType: alert.alertType,
      dateGenerated: alert.dateGenerated,
      isRead: alert.isRead,
      isResolved: alert.isResolved,
      ageInHours: alert.ageInHours
    };

    res.status(201).json({
      success: true,
      message: 'Security alert created successfully',
      data: alertResponse
    });

  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create security alert',
      error: error.message
    });
  }
};

// Get all alerts for a user with filtering and pagination
const getAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      isRead, 
      alertLevel, 
      alertType,
      sortBy = 'dateGenerated',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { userId };
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    if (alertLevel) {
      filter.alertLevel = alertLevel;
    }
    
    if (alertType) {
      filter.alertType = alertType;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const alerts = await SecurityAlert.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v -metadata');

    // Get total count for pagination
    const totalAlerts = await SecurityAlert.countDocuments(filter);
    const unreadCount = await SecurityAlert.countDocuments({ 
      userId, 
      isRead: false 
    });

    // Get critical alerts count
    const criticalCount = await SecurityAlert.countDocuments({
      userId,
      alertLevel: 'Critical',
      isResolved: false
    });

    res.json({
      success: true,
      data: alerts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAlerts / parseInt(limit)),
        totalItems: totalAlerts,
        itemsPerPage: parseInt(limit)
      },
      summary: {
        totalAlerts,
        unreadCount,
        criticalCount,
        resolvedCount: await SecurityAlert.countDocuments({ userId, isResolved: true })
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security alerts',
      error: error.message
    });
  }
};

// Mark alert as read
const markAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await SecurityAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.markAsRead();

    res.json({
      success: true,
      message: 'Alert marked as read',
      data: {
        id: alert._id,
        isRead: alert.isRead,
        updatedAt: alert.updatedAt
      }
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark alert as read',
      error: error.message
    });
  }
};

// Mark alert as resolved
const markAsResolved = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await SecurityAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.markAsResolved();

    res.json({
      success: true,
      message: 'Alert marked as resolved',
      data: {
        id: alert._id,
        isResolved: alert.isResolved,
        resolvedAt: alert.resolvedAt,
        updatedAt: alert.updatedAt
      }
    });

  } catch (error) {
    console.error('Mark as resolved error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark alert as resolved',
      error: error.message
    });
  }
};

// Get alert statistics for dashboard
const getAlertStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = {
      total: await SecurityAlert.countDocuments({ userId }),
      unread: await SecurityAlert.countDocuments({ userId, isRead: false }),
      critical: await SecurityAlert.countDocuments({ 
        userId, 
        alertLevel: 'Critical',
        isResolved: false 
      }),
      byLevel: {
        Critical: await SecurityAlert.countDocuments({ userId, alertLevel: 'Critical' }),
        High: await SecurityAlert.countDocuments({ userId, alertLevel: 'High' }),
        Medium: await SecurityAlert.countDocuments({ userId, alertLevel: 'Medium' }),
        Low: await SecurityAlert.countDocuments({ userId, alertLevel: 'Low' })
      },
      byType: {
        Security: await SecurityAlert.countDocuments({ userId, alertType: 'Security' }),
        Compliance: await SecurityAlert.countDocuments({ userId, alertType: 'Compliance' }),
        Vulnerability: await SecurityAlert.countDocuments({ userId, alertType: 'Vulnerability' }),
        System: await SecurityAlert.countDocuments({ userId, alertType: 'System' }),
        Other: await SecurityAlert.countDocuments({ userId, alertType: 'Other' })
      },
      recentActivity: {
        last24Hours: await SecurityAlert.countDocuments({
          userId,
          dateGenerated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }),
        last7Days: await SecurityAlert.countDocuments({
          userId,
          dateGenerated: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alert statistics',
      error: error.message
    });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  markAsRead,
  markAsResolved,
  getAlertStats
};
