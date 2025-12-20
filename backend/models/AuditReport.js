const mongoose = require('mongoose');

const AuditReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['security_assessment', 'compliance', 'vulnerability', 'incident'],
    default: 'security_assessment'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  data: {
    securityScore: Number,
    vulnerabilities: {
      critical: Number,
      high: Number,
      medium: Number,
      low: Number
    },
    complianceStatus: {
      pciDss: Boolean,
      iso27001: Boolean,
      gdpr: Boolean
    },
    recommendations: [String]
  },
  fileUrl: {
    type: String
  },
  format: {
    type: String,
    enum: ['pdf', 'html', 'json'],
    default: 'pdf'
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditReport', AuditReportSchema);