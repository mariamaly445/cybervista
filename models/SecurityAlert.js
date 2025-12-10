const mongoose = require('mongoose');

const SecurityAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Alert message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  alertLevel: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High', 'Critical'],
      message: '{VALUE} is not a valid alert level'
    },
    default: 'Medium'
  },
  alertType: {
    type: String,
    enum: ['Security', 'Compliance', 'Vulnerability', 'System', 'Other'],
    default: 'Security'
  },
  source: {
    type: String,
    enum: ['Automated Scan', 'Manual Entry', 'System Generated', 'Third Party'],
    default: 'System Generated'
  },
  dateGenerated: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
SecurityAlertSchema.index({ userId: 1, dateGenerated: -1 });
SecurityAlertSchema.index({ isRead: 1, alertLevel: -1 });
SecurityAlertSchema.index({ isResolved: 1 });

// Virtual for alert age (in hours)
SecurityAlertSchema.virtual('ageInHours').get(function() {
  const now = new Date();
  const diffMs = now - this.dateGenerated;
  return Math.floor(diffMs / (1000 * 60 * 60));
});

// Method to mark as read
SecurityAlertSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to mark as resolved
SecurityAlertSchema.methods.markAsResolved = function() {
  this.isResolved = true;
  this.resolvedAt = new Date();
  return this.save();
};

// Static method to get unread count
SecurityAlertSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, isRead: false });
};

// Static method to get critical alerts
SecurityAlertSchema.statics.getCriticalAlerts = async function(userId, limit = 10) {
  return await this.find({ 
    userId, 
    alertLevel: 'Critical',
    isResolved: false 
  })
  .sort({ dateGenerated: -1 })
  .limit(limit);
};

module.exports = mongoose.model('SecurityAlert', SecurityAlertSchema);
