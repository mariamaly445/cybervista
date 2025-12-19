const Score = require('../models/Score');

// Create a new security score
exports.createScore = async (req, res) => {
  try {
    // For now, generate mock score (70-100)
    const mockScore = Math.floor(Math.random() * 30) + 70;
    
    const score = new Score({
      userId: req.user.id,
      overallScore: mockScore,
      categoryScores: {
        vulnerability: 80,
        compliance: 75,
        incident: 90,
        governance: 85
      },
      riskLevel: mockScore > 85 ? 'low' : mockScore > 70 ? 'medium' : 'high'
    });
    
    await score.save();
    res.status(201).json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all scores for a user
exports.getScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id }).sort('-calculatedAt');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
