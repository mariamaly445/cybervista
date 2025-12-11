// controllers/profileController.js

const CompanyProfile = require('../models/CompanyProfile');

/**
 * CREATE PROFILE (POST /api/profile)
 */
const createProfile = async (req, res) => {
  try {
    console.log("🔍 req.user =", req.user);

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required (no userId found)"
      });
    }

    // Prevent duplicate profile
    const existing = await CompanyProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user",
        data: existing
      });
    }

    const profileData = {
      userId,
      securityQuestionnaire: req.body.securityQuestionnaire || {},
      overallSecurityScore: req.body.overallSecurityScore ?? 50,
    };

    const profile = await CompanyProfile.create(profileData);

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile
    });

  } catch (error) {
    console.error("❌ CREATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * GET PROFILE (GET /api/profile)
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const profile = await CompanyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error("❌ GET PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * UPDATE PROFILE (PUT /api/profile)
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const updatedProfile = await CompanyProfile.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("❌ UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { createProfile, getProfile, updateProfile };
