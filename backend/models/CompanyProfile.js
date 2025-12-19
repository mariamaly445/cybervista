// models/CompanyProfile.js
const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema(
  {
    // One profile per user (company)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    // Simple questionnaire flags (you can extend later)
    securityQuestionnaire: {
      dataEncryption: { type: Boolean, default: false },
      hasIncidentResponse: { type: Boolean, default: false },
      multiFactorAuth: { type: Boolean, default: false },
      regularBackups: { type: Boolean, default: false },
      employeeTraining: { type: Boolean, default: false },
      thirdPartyAudits: { type: Boolean, default: false },
      // you can still store extra dynamic fields in Mongo even if not listed here
    },

    overallSecurityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    lastAssessmentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);
