const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  userId: { 
    type: String,  // Changed from ObjectId to String
    required: true,
    unique: true
  },
  securityQuestionnaire: {
    dataEncryption: { type: Boolean, default: false },
    hasIncidentResponse: { type: Boolean, default: false },
    multiFactorAuth: { type: Boolean, default: false },
    regularBackups: { type: Boolean, default: false },
    employeeTraining: { type: Boolean, default: false },
    thirdPartyAudits: { type: Boolean, default: false }
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
});

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);