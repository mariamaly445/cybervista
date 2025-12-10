const mongoose = require('mongoose');

const AuditReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  securityScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  vulnerabilitiesFound: {
    type: Number,
    default: 0
  },
  complianceStatus: {
    pciDss: { type: Boolean, default: false },
    iso27001: { type: Boolean, default: false },
    gdpr: { type: Boolean, default: false }
  },
  recommendations: [{
    type: String
  }],
  pdfUrl: {
    type: String,
    default: ''
  },
  generatedBy: {
    type: String,
    default: 'CyberVista System'
  }
});

module.exports = mongoose.model('AuditReport', AuditReportSchema);
