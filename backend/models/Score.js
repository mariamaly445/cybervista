const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  categoryScores: {
    vulnerability: { type: Number, min: 0, max: 100 },
    compliance: { type: Number, min: 0, max: 100 },
    incidentResponse: { type: Number, min: 0, max: 100 },
    dataProtection: { type: Number, min: 0, max: 100 },
    accessControl: { type: Number, min: 0, max: 100 }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  trend: {
    type: String,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable'
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Score', ScoreSchema);