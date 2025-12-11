console.log('🔄 Profile controller starting...');

const CompanyProfile = require('../models/CompanyProfile');
console.log('📦 CompanyProfile model loaded:', CompanyProfile ? '✅ Yes' : '❌ No');

const createProfile = async (req, res) => {
  console.log('🎯 createProfile function called');
  
  try {
    console.log('📝 Request body received:', req.body);
    
    // SIMPLEST POSSIBLE VERSION
    const profileData = {
      userId: req.body.userId || 'default-user',
      securityQuestionnaire: req.body.securityQuestionnaire || {},
      overallSecurityScore: 50
    };
    
    console.log('💾 Saving to DB:', profileData);
    
    const profile = new CompanyProfile(profileData);
    const savedProfile = await profile.save();
    
    console.log('✅ Saved successfully:', savedProfile._id);
    
    res.status(201).json({
      success: true,
      message: 'Profile created',
      data: savedProfile
    });
    
  } catch (error) {
    console.error('❌ ERROR in createProfile:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};

const getProfile = async (req, res) => {
  res.json({ message: 'getProfile not implemented yet' });
};

module.exports = { createProfile, getProfile };