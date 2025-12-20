const mongoose = require('mongoose');

const IdentitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verificationType: {
    type: String,
    enum: ['company_registration', 'tax_id', 'director_id', 'bank_account', 'domain_ownership'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'verified', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    verified: Boolean
  }],
  metadata: {
    documentNumber: String,
    issuingAuthority: String,
    issueDate: Date,
    expiryDate: Date,
    country: String
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Identity', IdentitySchema);