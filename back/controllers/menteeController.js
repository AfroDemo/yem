const db = require("../models");
const { Op } = require("sequelize");

const User = db.User;
const Mentorship = db.Mentorship;
const Session = db.Session;
const Message = db.Message;
const Resource = db.Resource;
const Report = db.Report;
const Review = db.Review;
const Conversation = db.Conversation;

exports.getAllMentees = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch all users with role 'mentee'
    const mentees = await User.findAll({
      where: { role: "mentee" },
      attributes: ["id", "firstName", "lastName", "profileImage"],
    });

    res.status(200).json(mentees);
  } catch (error) {
    console.error("Get all mentees error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMenteeDashboardMetrics = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Active mentors (count of accepted mentorships)
    const activeMentors = await Mentorship.count({
      where: { menteeId, status: "accepted" },
    });

    // Upcoming sessions (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingSessions = await Session.count({
      where: {
        menteeId,
        startTime: { [Op.between]: [today, nextWeek] },
        status: "upcoming",
      },
    });

    // Hours mentored (this month)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const sessions = await Session.findAll({
      where: {
        menteeId,
        startTime: { [Op.gte]: startOfMonth },
        status: "completed",
      },
    });
    const hoursMentored = sessions.reduce((total, session) => {
      const duration =
        (new Date(session.endTime) - new Date(session.startTime)) /
        (1000 * 60 * 60);
      return total + duration;
    }, 0);

    // Average mentor rating
    const mentorships = await Mentorship.findAll({
      where: { menteeId, status: "accepted" },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id"],
        },
      ],
    });
    const mentorIds = mentorships.map((m) => m.mentor.id);
    const reviews = await Review.findAll({
      where: {
        mentorId: { [Op.in]: mentorIds },
      },
    });
    const averageMentorRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    // New connections (placeholder)
    const newConnections = await User.count({
      where: {
        id: { [Op.ne]: menteeId },
        role: { [Op.in]: ["mentor", "mentee"] },
        createdAt: { [Op.gte]: startOfMonth },
      },
    });

    res.json({
      activeMentors,
      upcomingSessions,
      hoursMentored,
      averageMentorRating,
      reviewCount: reviews.length,
      newConnections,
    });
  } catch (error) {
    console.error("Get mentee dashboard metrics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTodaysSessions = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const sessions = await Session.findAll({
      where: {
        menteeId,
        startTime: { [Op.between]: [startOfDay, endOfDay] },
      },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
    });

    res.json(sessions);
  } catch (error) {
    console.error("Get today's sessions error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getRecentMessages = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const conversations = await Conversation.findAll({
      where: db.sequelize.literal(
        `JSON_CONTAINS(participants, '[${menteeId}]')`
      ),
      include: [
        {
          model: Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "firstName", "lastName", "profileImage"],
            },
            {
              model: User,
              as: "receiver",
              attributes: ["id", "firstName", "lastName", "profileImage"],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: 3,
    });

    const messages = conversations
      .filter((conv) => conv.messages && conv.messages.length > 0)
      .map((conv) => conv.messages[0]);

    res.json(messages);
  } catch (error) {
    console.error("Get recent messages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMenteeProgress = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const mentorships = await Mentorship.findAll({
      where: { menteeId, status: "accepted" },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
    });

    const progressData = mentorships.map((mentorship) => ({
      id: mentorship.mentee.id,
      firstName: mentorship.mentee.firstName,
      lastName: mentorship.mentee.lastName,
      profileImage: mentorship.mentee.profileImage,
      progress: mentorship.progress,
      goals: mentorship.goals,
    }));

    res.json(progressData);
  } catch (error) {
    console.error("Get mentee progress error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSharedResources = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const resources = await Resource.findAll({
      include: [
        {
          model: User,
          as: "creator", // Use the correct alias from Resource model
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: User,
          as: "sharedWith",
          through: { attributes: [] }, // Exclude ResourceShares attributes
          where: { id: menteeId }, // Filter for the specific mentee
          attributes: [], // No need to include sharedWith user details
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    res.json(
      resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        category: resource.category || resource.type, // Use type as fallback
        mentor: resource.creator, // Use creator instead of createdBy
        sharedAt: resource.createdAt,
      }))
    );
  } catch (error) {
    console.error("Get shared resources error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUpcomingReports = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const reports = await Report.findAll({
      where: {
        menteeId,
        dueDate: { [Op.between]: [today, nextMonth] },
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["dueDate", "ASC"]],
      limit: 3,
    });

    res.json(reports);
  } catch (error) {
    console.error("Get upcoming reports error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getNewConnections = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;
    if (req.user.id != menteeId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Assuming a Connection model or similar logic for tracking connections
    // This is a placeholder; adjust based on your actual Connection model
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const connections = await User.findAll({
      where: {
        id: { [Op.ne]: menteeId },
        role: { [Op.in]: ["mentor", "mentee"] },
        createdAt: { [Op.gte]: startOfMonth },
      },
      attributes: ["id", "firstName", "lastName", "profileImage", "role"],
      limit: 3,
    });

    // Simulate mutual connections (adjust based on your actual logic)
    const connectionsWithMutual = connections.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      role: user.role,
      mutualConnections: Math.floor(Math.random() * 10), // Placeholder
    }));

    res.json(connectionsWithMutual);
  } catch (error) {
    console.error("Get new connections error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMentors = async (req, res) => {
  try {
    const { menteeId } = req.params;

    // Verify mentee exists
    const mentee = await User.findByPk(menteeId);
    if (!mentee || mentee.role !== "mentee") {
      return res.status(404).json({ message: "Mentee not found" });
    }

    // Fetch accepted mentorships with mentor details
    const mentorships = await Mentorship.findAll({
      where: {
        menteeId,
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
    });

    // Extract mentor data
    const mentors = mentorships.map((mentorship) => ({
      id: mentorship.mentor.id,
      firstName: mentorship.mentor.firstName,
      lastName: mentorship.mentor.lastName,
      profileImage: mentorship.mentor.profileImage,
    }));

    res.status(200).json(mentors);
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
