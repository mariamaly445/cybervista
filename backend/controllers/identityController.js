const Identity = require('../models/Identity');

exports.getAllVerifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, verificationType } = req.query;
    
    const filter = { userId };
    if (status) filter.status = status;
    if (verificationType) filter.verificationType = verificationType;
    
    const verifications = await Identity.find(filter).sort({ submittedAt: -1 });
    
    const total = await Identity.countDocuments({ userId });
    const verified = await Identity.countDocuments({ userId, status: 'verified' });
    const pending = await Identity.countDocuments({ userId, status: 'pending' });
    
    res.json({
      success: true,
      data: {
        verifications,
        stats: {
          total,
          verified,
          pending,
          verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.submitVerification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { verificationType, documents, metadata } = req.body;
    
    if (!verificationType || !documents || documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Verification type and documents are required'
      });
    }
    
    const existing = await Identity.findOne({
      userId,
      verificationType,
      status: { $in: ['pending', 'in_review', 'verified'] }
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${verificationType} verification already exists`
      });
    }
    
    const verification = await Identity.create({
      userId,
      verificationType,
      documents: documents.map(doc => ({
        ...doc,
        uploadDate: new Date(),
        verified: false
      })),
      metadata,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      message: 'Verification submitted successfully',
      data: { verification }
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};