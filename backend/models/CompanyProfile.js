const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
    default: '1-10'
  },
  industry: {
    type: String,
    enum: ['FinTech', 'Banking', 'Insurance', 'E-commerce', 'Healthcare', 'Other'],
    default: 'FinTech'
  },
  country: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  securityQuestionnaire: {
    dataEncryption: { type: Boolean, default: false },
    hasIncidentResponse: { type: Boolean, default: false },
    multiFactorAuth: { type: Boolean, default: false },
    regularBackups: { type: Boolean, default: false },
    employeeTraining: { type: Boolean, default: false },
    thirdPartyAudits: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  },
  overallSecurityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  complianceStatus: {
    pciDss: { type: Boolean, default: false },
    iso27001: { type: Boolean, default: false },
    gdpr: { type: Boolean, default: false },
    hipaa: { type: Boolean, default: false }
  },
  lastAssessmentDate: {
    type: Date,
    default: Date.now
  },
  settings: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    alertFrequency: { 
      type: String, 
      enum: ['immediate', 'daily', 'weekly'],
      default: 'immediate'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);