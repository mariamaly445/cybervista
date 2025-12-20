const Score = require('../models/Score');
const CompanyProfile = require('../models/CompanyProfile');
const VulnerabilityScan = require('../models/VulnerabilityScan');

exports.calculateScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const profile = await CompanyProfile.findOne({ userId });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentScans = await VulnerabilityScan.find({
      userId,
      scanDate: { $gte: thirtyDaysAgo },
      status: 'completed'
    });
    
    let baseScore = profile?.overallSecurityScore || 50;
    let scanAdjustment = 0;
    
    if (recentScans.length > 0) {
      const totalVulnerabilities = recentScans.reduce((sum, scan) => 
        sum + (scan.results?.critical || 0) * 10 + (scan.results?.high || 0) * 5, 0
      );
      scanAdjustment = Math.min(-totalVulnerabilities, -30);
    }
    
    let finalScore = baseScore + scanAdjustment;
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    let riskLevel = 'medium';
    if (finalScore >= 80) riskLevel = 'low';
    else if (finalScore >= 60) riskLevel = 'medium';
    else if (finalScore >= 40) riskLevel = 'high';
    else riskLevel = 'critical';
    
    const previousScore = await Score.findOne({ userId })
      .sort({ calculatedAt: -1 })
      .limit(1);
    
    let trend = 'stable';
    if (previousScore) {
      if (finalScore > previousScore.overallScore + 5) trend = 'improving';
      else if (finalScore < previousScore.overallScore - 5) trend = 'declining';
    }
    
    const score = await Score.create({
      userId,
      overallScore: finalScore,
      categoryScores: {
        vulnerability: Math.max(0, 100 - (scanAdjustment * 3)),
        compliance: profile?.complianceStatus ? 
          (Object.values(profile.complianceStatus).filter(v => v).length / 
           Object.values(profile.complianceStatus).length) * 100 : 0,
        incidentResponse: 75,
        dataProtection: profile?.securityQuestionnaire?.dataEncryption ? 90 : 50,
        accessControl: profile?.securityQuestionnaire?.multiFactorAuth ? 85 : 60
      },
      riskLevel,
      trend,
      calculatedAt: new Date()
    });
    
    await CompanyProfile.findOneAndUpdate(
      { userId },
      { 
        overallSecurityScore: finalScore,
        lastAssessmentDate: new Date()
      }
    );
    
    res.status(201).json({
      success: true,
      message: 'Security score calculated successfully',
      data: { score }
    });
  } catch (error) {
    console.error('Calculate score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};