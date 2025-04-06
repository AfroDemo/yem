const db = require("../models");
const User = db.User;
const MentorProfile = db.MentorProfile;
const { Op } = require("sequelize");

// Create mentor profile
exports.createMentorProfile = async (req, res) => {
  try {
    const {
      expertise,
      experience,
      company,
      position,
      availability,
      mentorshipStyle,
      maxMentees,
    } = req.body;

    // Check if user exists and is a mentor
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "mentor" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only mentors can create mentor profiles" });
    }

    // Check if mentor profile already exists
    const existingProfile = await MentorProfile.findOne({
      where: { userId: req.user.id },
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Mentor profile already exists for this user" });
    }

    // Create new mentor profile
    const newMentorProfile = await MentorProfile.create({
      userId: req.user.id,
      expertise,
      experience,
      company,
      position,
      availability,
      mentorshipStyle,
      maxMentees: maxMentees || 3,
      currentMenteeCount: 0,
      acceptingMentees: true,
    });

    res.status(201).json(newMentorProfile);
  } catch (error) {
    console.error("Create mentor profile error:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all mentor profiles with user details
exports.getAllMentorProfiles = async (req, res) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
    } = req.query;

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = { role: "mentor" };

    
    // Get mentors with pagination and sorting
    const mentors = await User.findAll({
      where: whereConditions,
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (!mentors || mentors.length === 0) {

      return res.status(404).json({ message: "No mentors found" });
    }

    res.json({
      mentors,
    });
  } catch (error) {
    console.error("Get all mentors error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get mentor profile by ID with user details
exports.getMentorProfileById = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "profileImage",
            "bio",
            "location",
            "socialLinks",
          ],
          as: "user",
        },
      ],
    });

    if (!mentorProfile) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    res.json(mentorProfile);
  } catch (error) {
    console.error("Get mentor profile by ID error:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update mentor profile
exports.updateMentorProfile = async (req, res) => {
  try {
    const {
      expertise,
      experience,
      company,
      position,
      availability,
      mentorshipStyle,
      maxMentees,
      acceptingMentees,
    } = req.body;

    // Find mentor profile
    const mentorProfile = await MentorProfile.findByPk(req.params.id);
    if (!mentorProfile) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    // Check if user is authorized to update this profile
    if (mentorProfile.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this mentor profile" });
    }

    // Update fields
    const updatedFields = {};
    if (expertise) updatedFields.expertise = expertise;
    if (experience) updatedFields.experience = experience;
    if (company) updatedFields.company = company;
    if (position) updatedFields.position = position;
    if (availability) updatedFields.availability = availability;
    if (mentorshipStyle) updatedFields.mentorshipStyle = mentorshipStyle;
    if (maxMentees) updatedFields.maxMentees = maxMentees;
    if (acceptingMentees !== undefined)
      updatedFields.acceptingMentees = acceptingMentees;

    const updatedProfile = await mentorProfile.update(updatedFields);

    res.json(updatedProfile);
  } catch (error) {
    console.error("Update mentor profile error:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get featured mentors
exports.getFeaturedMentors = async (req, res) => {
  try {
    const featuredMentors = await MentorProfile.findAll({
      where: { acceptingMentees: true },
      order: [["rating", "DESC"]],
      limit: 6,
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "profileImage",
            "bio",
          ],
          as: "user",
        },
      ],
    });

    res.json(featuredMentors);
  } catch (error) {
    console.error("Get featured mentors error:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search mentors by expertise
exports.searchMentorsByExpertise = async (req, res) => {
  try {
    const { expertise } = req.query;

    if (!expertise) {
      return res
        .status(400)
        .json({ message: "Expertise query parameter is required" });
    }

    // Search for mentors with matching expertise (case-insensitive)
    const mentors = await MentorProfile.findAll({
      where: {
        expertise: { [Op.like]: `%${expertise}%` },
        acceptingMentees: true,
      },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "profileImage",
            "bio",
          ],
          as: "user",
        },
      ],
    });

    res.json(mentors);
  } catch (error) {
    console.error("Search mentors by expertise error:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
