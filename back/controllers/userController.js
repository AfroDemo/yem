const db = require("../models");
const User = db.User;
const MentorProfile = db.MentorProfile;
const { Op } = require("sequelize");
const { processProfileImage } = require("../services/imageProcessor");
const upload = require("../utils/upload");
const path = require("path");

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Verify User model is properly accessible
    if (!User || typeof User.findAll !== "function") {
      throw new Error("User model not properly initialized");
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getMatches = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let matchQuery = {
      where: {
        role: user.role === "entrepreneur" ? "mentor" : "entrepreneur",
      },
    };

    // For array contains operations in Sequelize
    if (user.industries && user.industries.length > 0) {
      matchQuery.where.industries = {
        [Sequelize.Op.overlap]: user.industries,
      };
    }

    if (user.role === "entrepreneur") {
      if (user.interests && user.interests.length > 0) {
        matchQuery.where.skills = {
          [Sequelize.Op.overlap]: user.interests,
        };
      }
    } else {
      if (user.skills && user.skills.length > 0) {
        matchQuery.where.interests = {
          [Sequelize.Op.overlap]: user.skills,
        };
      }

      if (
        user.preferredBusinessStages &&
        user.preferredBusinessStages.length > 0
      ) {
        matchQuery.where.businessStage = {
          [Sequelize.Op.in]: user.preferredBusinessStages,
        };
      }
    }

    const matches = await User.findAll({
      ...matchQuery,
      attributes: { exclude: ["password"] },
    });

    const scoredMatches = matches
      .map((match) => {
        // ... same scoring logic as before ...
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(scoredMatches);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Verify User model
    if (!User || typeof User.findByPk !== "function") {
      throw new Error("User model not properly initialized");
    }

    const {
      firstName,
      lastName,
      bio,
      skills,
      interests,
      location,
      socialLinks,
      profileImage,
    } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check authorization
    if (req.user?.id != req.params.id && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    const updatedUser = await user.update({
      firstName: firstName !== undefined ? firstName : user.firstName,
      lastName: lastName !== undefined ? lastName : user.lastName,
      bio: bio !== undefined ? bio : user.bio,
      skills: skills !== undefined ? skills : user.skills,
      interests: interests !== undefined ? interests : user.interests,
      location: location !== undefined ? location : user.location,
      profileImage:
        profileImage !== undefined ? profileImage : user.profileImage,
    });

    const userJson = updatedUser.toJSON();
    delete userJson.password;
    delete userJson.resetPasswordToken;
    delete userJson.resetPasswordExpires;

    res.json(userJson);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is a mentor, delete their mentor profile
    if (user.role === "mentor") {
      await MentorProfile.destroy({ where: { userId: user.id } });
    }

    // Delete user
    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    // 1. Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // 2. Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      // Clean up the uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Authorization check - user can only update their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      fs.unlinkSync(req.file.path); // Clean up file
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    // 4. Process the image (resize and convert to webp)
    const uploadsDir = path.join(__dirname, "../public/uploads");
    const filename = `profile-${user._id}-${Date.now()}.webp`;
    const outputPath = path.join(uploadsDir, filename);

    await sharp(req.file.path)
      .resize(500, 500)
      .webp({ quality: 80 })
      .toFile(outputPath);

    // 5. Delete the original uploaded file
    fs.unlinkSync(req.file.path);

    // 6. Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, "../public", user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // 7. Update user profile with new image path
    user.profileImage = `/uploads/${filename}`;
    await user.save();

    // 8. Return success response
    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: user.profileImage,
    });
  } catch (error) {
    console.error("Profile upload error:", error);

    // Clean up any uploaded files if error occurred
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
      error: error.message,
    });
  }
};
