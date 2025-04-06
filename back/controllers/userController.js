const db = require("../models");
const User = db.User;
const MentorProfile = db.MentorProfile;
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const getUsersBySpecificRole = async (role) => {
  try {
    return await User.findAll({
      where: { role },
      attributes: { exclude: ["password"] },
    });
  } catch (error) {
    console.error(`Error fetching ${role}s:`, error);
    throw error;
  }
};

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

    // Role-based matching (mentor/mentee)
    const matchQuery = {
      where: {
        role: user.role === "mentee" ? "mentor" : "mentee",
      },
    };

    // Fetch potential matches
    const potentialMatches = await User.findAll({
      where: matchQuery.where,
      attributes: { exclude: ["password"] },
    });

    console.log(`Found ${potentialMatches.length} potential role matches`);

    // --- Helper Functions ---
    const stringToArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        const cleaned = value.replace(/\\"/g, "").replace(/"/g, "").trim();
        return cleaned.includes(",")
          ? cleaned.split(",").map((item) => item.trim())
          : [cleaned];
      }
      return [];
    };

    // Case-insensitive comparison
    const includes = (array, value) => {
      return array.some((item) => item.toLowerCase() === value.toLowerCase());
    };

    // --- Parse User Attributes ---
    const userIndustries = stringToArray(user.industries);
    const userInterests =
      user.role === "mentee" ? stringToArray(user.interests) : [];
    const userSkills = user.role === "mentor" ? stringToArray(user.skills) : [];
    const userBusinessStage =
      user.role === "mentee" ? stringToArray(user.businessStage) : [];
    const userPreferredBusinessStage =
      user.role === "mentor" ? stringToArray(user.preferredBusinessStages) : [];

    // Calculate user's maximum possible score (for normalization)
    const maxPossibleScore =
      userIndustries.length * 10 +
        userBusinessStage.length * 10 +
        (user.role === "mentee"
          ? userInterests.length * 10
          : userSkills.length * 10) || // Reduced to 10pts per skill/interest
      1; // Avoid division by zero

    // --- Score and Normalize Matches ---
    const scoredMatches = potentialMatches
      .map((match) => {
        let matchScore = 0;
        let matchReasons = [];

        // Parse match attributes
        const matchIndustries = stringToArray(match.industries);
        const matchSkills =
          match.role === "mentor" ? stringToArray(match.skills) : [];
        const matchInterests =
          match.role === "mentee" ? stringToArray(match.interests) : [];
        const matchBusinessStage =
          match.role === "mentee" ? stringToArray(match.businessStage) : [];
        const matchPreferredBusinessStage =
          match.role === "mentor"
            ? stringToArray(match.preferredBusinessStages)
            : [];

        // 1. Industry Matching (10pts per match)
        if (userIndustries.length > 0 && matchIndustries.length > 0) {
          const commonIndustries = userIndustries.filter((industry) =>
            includes(matchIndustries, industry)
          );
          if (commonIndustries.length > 0) {
            matchScore += commonIndustries.length * 10;
            matchReasons.push(
              `${commonIndustries.length} shared industries: ${commonIndustries.join(", ")}`
            );
          }
        }

        // 2. Business Stage Matching (10pts per match)
        if (user.role === "mentee") {
          // Mentee vs. Mentor's preferred stages
          if (
            userBusinessStage.length > 0 &&
            matchPreferredBusinessStage.length > 0
          ) {
            const matchedStages = userBusinessStage.filter((stage) =>
              includes(matchPreferredBusinessStage, stage)
            );
            if (matchedStages.length > 0) {
              matchScore += matchedStages.length * 10;
              matchReasons.push(
                `${matchedStages.length} business stage matches: ${matchedStages.join(", ")}`
              );
            }
          }
        } else {
          // Mentor vs. Mentee's stages
          if (
            userPreferredBusinessStage.length > 0 &&
            matchBusinessStage.length > 0
          ) {
            const matchedStages = userPreferredBusinessStage.filter((stage) =>
              includes(matchBusinessStage, stage)
            );
            if (matchedStages.length > 0) {
              matchScore += matchedStages.length * 10;
              matchReasons.push(
                `${matchedStages.length} business stage matches: ${matchedStages.join(", ")}`
              );
            }
          }
        }

        // 3. Skills/Interests Matching (10pts per match, reduced from 20)
        if (user.role === "mentee") {
          // Mentee interests vs. Mentor skills
          if (userInterests.length > 0 && matchSkills.length > 0) {
            const matchedSkills = userInterests.filter((interest) =>
              includes(matchSkills, interest)
            );
            if (matchedSkills.length > 0) {
              matchScore += matchedSkills.length * 10;
              matchReasons.push(
                `${matchedSkills.length} skill/interest matches: ${matchedSkills.join(", ")}`
              );
            }
          }
        } else {
          // Mentor skills vs. Mentee interests
          if (userSkills.length > 0 && matchInterests.length > 0) {
            const matchedInterests = userSkills.filter((skill) =>
              includes(matchInterests, skill)
            );
            if (matchedInterests.length > 0) {
              matchScore += matchedInterests.length * 10;
              matchReasons.push(
                `${matchedInterests.length} skill/interest matches: ${matchedInterests.join(", ")}`
              );
            }
          }
        }

        // Normalize to 0-100% and round
        const normalizedScore = Math.round(
          Math.min((matchScore / maxPossibleScore) * 100, 100)
        );

        return {
          user: match,
          matchScore: normalizedScore, // 0-100%
          rawScore: matchScore, // Optional: original points
          matchReasons,
        };
      })
      .filter((match) => match.matchScore > 0) // Exclude 0% matches
      .sort((a, b) => b.matchScore - a.matchScore); // Best matches first

    res.json(scoredMatches);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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
      industries,
      businessStage,
      preferredBusinessStages,
      availability,
      experienceYears,
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
      industries: industries !== undefined ? industries : user.industries,
      location: location !== undefined ? location : user.location,
      profileImage:
        profileImage !== undefined ? profileImage : user.profileImage,
      businessStage:
        businessStage !== undefined ? businessStage : user.businessStage,
      preferredBusinessStages:
        preferredBusinessStages !== undefined
          ? preferredBusinessStages
          : user.preferredBusinessStages,
      availability:
        availability !== undefined ? availability : user.availability,
      experienceYears:
        experienceYears !== undefined ? experienceYears : user.experienceYears,
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
      const oldImagePath = path.join(__dirname, "../public", user.profileImage);
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
