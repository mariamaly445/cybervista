const mongoose = require('mongoose');

const SecurityAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Alert message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  alertLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  alertType: {
    type: String,
    enum: ['security', 'compliance', 'vulnerability', 'system', 'user_activity'],
    default: 'security'
  },
  source: {
    type: String,
    enum: ['automated_scan', 'manual_entry', 'system_generated', 'third_party'],
    default: 'system_generated'
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
  relatedScan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VulnerabilityScan'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SecurityAlert', SecurityAlertSchema);