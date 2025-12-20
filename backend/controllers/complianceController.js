const Compliance = require('../models/Compliance');

exports.getAllCompliance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, standardName } = req.query;
    
    const filter = { userId };
    if (status) filter.status = status;
    if (standardName) filter.standardName = standardName;
    
    const compliance = await Compliance.find(filter).sort({ updatedAt: -1 });
    
    const totalStandards = await Compliance.countDocuments({ userId });
    const compliantStandards = await Compliance.countDocuments({ 
      userId, 
      status: 'compliant' 
    });
    
    res.json({
      success: true,
      data: {
        compliance,
        metrics: {
          totalStandards,
          compliantStandards,
          compliancePercentage: totalStandards > 0 
            ? Math.round((compliantStandards / totalStandards) * 100) 
            : 0,
          averageScore: compliance.length > 0
            ? Math.round(compliance.reduce((sum, std) => sum + std.overallScore, 0) / compliance.length)
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Get compliance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.createOrUpdateCompliance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { standardName, requirements, nextAuditDate } = req.body;
    
    if (!standardName) {
      return res.status(400).json({
        success: false,
        message: 'Standard name is required'
      });
    }
    
    let compliance = await Compliance.findOne({
      userId,
      standardName
    });
    
    if (compliance) {
      if (requirements) compliance.requirements = requirements;
      if (nextAuditDate) compliance.nextAuditDate = nextAuditDate;
      
      await compliance.save();
      
      return res.json({
        success: true,
        message: 'Compliance standard updated successfully',
        data: { compliance }
      });
    } else {
      compliance = await Compliance.create({
        userId,
        standardName,
        requirements: requirements || [],
        nextAuditDate: nextAuditDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      });
      
      res.status(201).json({
        success: true,
        message: 'Compliance standard created successfully',
        data: { compliance }
      });
    }
  } catch (error) {
    console.error('Create/update compliance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};