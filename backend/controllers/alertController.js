const SecurityAlert = require('../models/SecurityAlert');

exports.getAlerts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      page = 1, 
      limit = 20, 
      isRead, 
      alertLevel,
      alertType 
    } = req.query;
    
    const filter = { userId };
    
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (alertLevel) filter.alertLevel = alertLevel;
    if (alertType) filter.alertType = alertType;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const alerts = await SecurityAlert.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await SecurityAlert.countDocuments(filter);
    const unreadCount = await SecurityAlert.countDocuments({
      userId,
      isRead: false
    });
    
    res.json({
      success: true,
      data: {
        alerts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        summary: {
          totalAlerts: total,
          unreadCount
        }
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const alert = await SecurityAlert.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Alert marked as read',
      data: { alert }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};