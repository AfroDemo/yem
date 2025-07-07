const db = require("../models");
const User = db.User;
const SuccessStory = db.SuccessStory;
const Event = db.Event;
const { Op } = require("sequelize");

// Helper function to parse JSON fields safely
const parseJsonField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
  } catch (e) {
    console.warn(`Invalid JSON in field: ${value}`);
    const cleaned = value.replace(/\\"/g, "").replace(/"/g, "").trim();
    return cleaned.includes(",")
      ? cleaned.split(",").map((item) => item.trim())
      : cleaned
        ? [cleaned]
        : [];
  }
};

// Get homepage data
exports.getHomePageData = async (req, res) => {
  try {
    // 1. Fetch Featured Mentors (up to 3, sorted by createdAt)
    const featuredMentors = await User.findAll({
      where: { role: "mentor" },
      order: [["createdAt", "DESC"]],
      limit: 3,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "profileImage",
        "bio",
        "industries",
        "skills",
      ],
    });

    const formattedMentors = featuredMentors.map((mentor) => ({
      id: mentor.id,
      name: `${mentor.firstName} ${mentor.lastName}`,
      title: "Mentor",
      expertise: parseJsonField(mentor.skills || mentor.industries).join(", "),
      image: mentor.profileImage || "/placeholder.svg?height=128&width=128",
    }));

    // 4. Fetch Platform Statistics
    const mentorCount = await User.count({ where: { role: "mentor" } });
    const menteeCount = await User.count({ where: { role: "mentee" } });

    const stats = {
      activeMentors: mentorCount,
      youngEntrepreneurs: menteeCount,
    };

    res.json({
      featuredMentors: formattedMentors,
      stats,
    });
  } catch (error) {
    console.error("Get homepage data error:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
