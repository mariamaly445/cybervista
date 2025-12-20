const mongoose = require('mongoose');

const ComplianceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  standardName: {
    type: String,
    required: true,
    enum: ['PCI-DSS', 'ISO-27001', 'GDPR', 'HIPAA', 'SOC-2', 'NIST']
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'compliant', 'non_compliant'],
    default: 'not_started'
  },
  complianceLevel: {
    type: String,
    enum: ['level-1', 'level-2', 'level-3', 'level-4'],
    default: 'level-1'
  },
  lastAuditDate: {
    type: Date
  },
  nextAuditDate: {
    type: Date,
    default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  requirements: [{
    requirementId: String,
    description: String,
    status: {
      type: String,
      enum: ['not_applicable', 'not_implemented', 'partially_implemented', 'fully_implemented'],
      default: 'not_implemented'
    },
    evidence: [{
      name: String,
      url: String
    }],
    notes: String
  }],
  gaps: [{
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    remediationPlan: String,
    targetDate: Date,
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved']
    }
  }],
  documents: [{
    name: String,
    type: String,
    url: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Compliance', ComplianceSchema);