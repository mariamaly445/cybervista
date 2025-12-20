const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile = await CompanyProfile.findOne({ userId });

    if (profile) {
      profile = await CompanyProfile.findOneAndUpdate(
        { userId },
        { $set: profileData },
        { new: true, runValidators: true }
      );
      
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        profile
      });
    } else {
      profile = await CompanyProfile.create({
        userId,
        ...profileData
      });

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        profile
      });
    }
  } catch (error) {
    console.error('Profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.userId })
      .populate('userId', 'companyName email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create a profile first.'
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateQuestionnaire = async (req, res) => {
  try {
    const { questionnaire } = req.body;
    
    if (!questionnaire || typeof questionnaire !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Questionnaire data is required'
      });
    }

    let profile = await CompanyProfile.findOne({ userId: req.user.userId });

    if (!profile) {
      profile = await CompanyProfile.create({
        userId: req.user.userId,
        securityQuestionnaire: questionnaire
      });
    } else {
      profile.securityQuestionnaire = {
        ...profile.securityQuestionnaire,
        ...questionnaire,
        lastUpdated: new Date()
      };
      await profile.save();
    }

    res.json({
      success: true,
      message: 'Questionnaire updated successfully',
      profile
    });
  } catch (error) {
    console.error('Questionnaire error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};