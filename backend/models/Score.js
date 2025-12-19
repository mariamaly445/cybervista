const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  overallScore: { type: Number, min: 0, max: 100, required: true },
  categoryScores: {
    vulnerability: Number,
    compliance: Number,
    incident: Number,
    governance: Number
  },
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  calculatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
