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

    // Start with just role matching
    const matchQuery = {
      where: {
        role: user.role === "mentee" ? "mentor" : "mentee",
      },
    };

    // Get all potential role matches
    const potentialMatches = await User.findAll({
      where: matchQuery.where,
      attributes: { exclude: ["password"] },
    });

    console.log(
      `Found ${potentialMatches.length} potential matches based on role`
    );

    // Helper function to convert string to array
    const stringToArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;

      // If it's a string, clean it up and split if it contains commas
      if (typeof value === "string") {
        // Remove any trailing quotes and clean whitespace
        const cleaned = value.replace(/\\"/g, "").replace(/"/g, "").trim();

        // If it contains commas, split it
        if (cleaned.includes(",")) {
          return cleaned.split(",").map((item) => item.trim());
        }

        // Otherwise return as single-item array
        return [cleaned];
      }

      return [];
    };

    // Parse user fields as simple strings
    const userIndustries = stringToArray(user.industries);
    const userInterests =
      user.role === "mentee" ? stringToArray(user.interests) : [];
    const userSkills = user.role === "mentor" ? stringToArray(user.skills) : [];

    // Handle business stages (might be comma-separated or single value)
    const userPreferredStages =
      user.role === "mentor" ? stringToArray(user.preferredBusinessStages) : [];

    console.log("User industries (processed):", userIndustries);
    console.log(
      "User interests/skills (processed):",
      user.role === "mentee" ? userInterests : userSkills
    );

    // Process and score matches
    const scoredMatches = potentialMatches
      .map((match) => {
        let matchScore = 0;
        let matchReasons = [];

        // Parse match string fields
        const matchIndustries = stringToArray(match.industries);
        const matchSkills =
          match.role === "mentor" ? stringToArray(match.skills) : [];
        const matchInterests =
          match.role === "mentee" ? stringToArray(match.interests) : [];

        // Case-insensitive compare function
        const includes = (array, value) => {
          return array.some(
            (item) => item.toLowerCase() === value.toLowerCase()
          );
        };

        // Check industries overlap
        if (userIndustries.length > 0 && matchIndustries.length > 0) {
          const commonIndustries = userIndustries.filter((industry) =>
            includes(matchIndustries, industry)
          );

          if (commonIndustries.length > 0) {
            // Add 10 points for each common industry
            matchScore += commonIndustries.length * 10;
            matchReasons.push(
              `${commonIndustries.length} shared industries: ${commonIndustries.join(", ")}`
            );
          }
        }

        // Check skills/interests match
        if (user.role === "mentee") {
          // Mentee looking for mentor with matching skills
          if (userInterests.length > 0 && matchSkills.length > 0) {
            const matchedSkills = userInterests.filter((interest) =>
              includes(matchSkills, interest)
            );

            if (matchedSkills.length > 0) {
              // Add 20 points for each matched skill/interest
              matchScore += matchedSkills.length * 20;
              matchReasons.push(
                `${matchedSkills.length} interests match mentor skills: ${matchedSkills.join(", ")}`
              );
            }
          }
        } else {
          // Mentor looking for mentee with matching interests
          if (userSkills.length > 0 && matchInterests.length > 0) {
            const matchedInterests = userSkills.filter((skill) =>
              includes(matchInterests, skill)
            );

            if (matchedInterests.length > 0) {
              // Add 20 points for each matched skill/interest
              matchScore += matchedInterests.length * 20;
              matchReasons.push(
                `${matchedInterests.length} skills match mentee interests: ${matchedInterests.join(", ")}`
              );
            }
          }

          // Business stage matching (for mentors)
          if (userPreferredStages.length > 0 && match.businessStage) {
            if (includes(userPreferredStages, match.businessStage)) {
              matchScore += 15;
              matchReasons.push(`Business stage match: ${match.businessStage}`);
            }
          }
        }

        return {
          user: match,
          matchScore,
          matchReasons,
        };
      })
      .filter((match) => match.matchScore > 0) // Only return matches with a score
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log(`Found ${scoredMatches.length} matches with scores`);
    res.json(scoredMatches);
  } catch (error) {
    console.error("Get matches error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
