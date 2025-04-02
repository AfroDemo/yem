const db = require("../models");
const User = db.User;
const MentorProfile = db.MentorProfile;
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new filename
    const filename = `profile-${user.id}-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "../public/uploads", filename);

    // Process image to memory first, then save
    const processedImage = await sharp(req.file.path)
      .resize(500, 500)
      .webp({ quality: 80 })
      .toBuffer();

    // Save processed image
    await sharp(processedImage).toFile(outputPath);

    // Delete original uploaded file
    fs.unlinkSync(req.file.path);

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(
        __dirname,
        "../public",
        user.profileImage
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new image path
    const imageUrl = `/uploads/${filename}`;
    await user.update({ profileImage: imageUrl });

    return res.json({
      success: true,
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up any files if error occurred
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      error: error.message || "Failed to upload profile image",
    });
  }
};
