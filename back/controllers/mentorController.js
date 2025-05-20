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

exports.getAllMentors = async (req, res) => {
  try {
    console.log(req.user.role);
    // Check if the requesting user is an admin
    // if (req.user.role !== "admin"||req.user.role !== "mentee") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    // Fetch all users with role 'mentor'
    const mentors = await User.findAll({
      where: { role: "mentor" },
      attributes: ["id", "firstName", "lastName", "profileImage"],
    });

    res.status(200).json(mentors);
  } catch (error) {
    console.error("Get all mentors error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get dashboard metrics
exports.getDashboardMetrics = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (req.user.id != mentorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Active mentees (count of accepted mentorships)
    const activeMentees = await Mentorship.count({
      where: { mentorId, status: "accepted" },
    });

    // Upcoming sessions (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingSessions = await Session.count({
      where: {
        mentorId,
        startTime: { [Op.between]: [today, nextWeek] },
        status: "upcoming",
      },
    });

    // Hours mentored (this month)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const sessions = await Session.findAll({
      where: {
        mentorId,
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

    // Average rating
    const reviews = await Review.findAll({ where: { mentorId } });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.json({
      activeMentees: activeMentees,
      upcomingSessions,
      hoursMentored,
      averageRating,
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Get dashboard metrics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get today's sessions
exports.getTodaysSessions = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (req.user.id != mentorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const sessions = await Session.findAll({
      where: {
        mentorId,
        startTime: { [Op.between]: [startOfDay, endOfDay] },
      },
      include: [
        {
          model: User,
          as: "mentee",
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

// Get recent messages
exports.getRecentMessages = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (req.user.id != mentorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find conversations involving the mentor (MySQL compatible version)
    const conversations = await Conversation.findAll({
      where: db.sequelize.literal(
        `JSON_CONTAINS(participants, '[${mentorId}]')`
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

    // Rest of your code remains the same...
    const messages = conversations
      .filter((conv) => conv.messages && conv.messages.length > 0)
      .map((conv) => conv.messages[0]);

    res.json(messages);
  } catch (error) {
    console.error("Get recent messages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get mentee progress
exports.getMenteeProgress = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (req.user.id != mentorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const mentorships = await Mentorship.findAll({
      where: { mentorId, status: "accepted" },
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

// Get shared resources
exports.getSharedResources = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (req.user.id != mentorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const resources = await Resource.findAll({
      where: { createdById: mentorId },
      include: [
        {
          model: User,
          as: "sharedWith",
          attributes: ["id", "firstName", "lastName"],
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
        sharedWith: resource.sharedWith,
        sharedAt: resource.createdAt,
      }))
    );
  } catch (error) {
    console.error("Get shared resources error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get upcoming reports
exports.getUpcomingReports = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    if (req.user.id != mentorId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const reports = await Report.findAll({
      where: {
        mentorId,
        dueDate: { [Op.between]: [today, nextMonth] },
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "mentee",
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

exports.getMentees = async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Verify mentor exists
    const mentor = await User.findByPk(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Fetch accepted mentorships with mentee details
    const mentorships = await Mentorship.findAll({
      where: {
        mentorId,
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
    });

    // Extract mentee data
    const mentees = mentorships.map((mentorship) => ({
      id: mentorship.mentee.id,
      firstName: mentorship.mentee.firstName,
      lastName: mentorship.mentee.lastName,
      profileImage: mentorship.mentee.profileImage,
    }));

    res.status(200).json(mentees);
  } catch (error) {
    console.error("Get mentees error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Fetch mentee industries
exports.getMenteeIndustries = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    // if (req.user.id != mentorId && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    // Fetch accepted and completed mentorships
    const mentorships = await Mentorship.findAll({
      where: {
        mentorId,
        status: { [Op.in]: ["accepted", "completed"] },
      },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["industries"],
        },
      ],
    });

    // Aggregate industries
    const industryCounts = {};
    const colors = [
      "blue",
      "green",
      "purple",
      "amber",
      "red",
      "indigo",
      "cyan",
      "pink",
    ];
    let colorIndex = 0;

    mentorships.forEach((mentorship) => {
      const industries = JSON.parse(mentorship.mentee.industries || "[]");
      industries.forEach((industry) => {
        if (industry) {
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        }
      });
    });

    const industriesData = Object.entries(industryCounts).map(
      ([name, count]) => ({
        name,
        count,
        color: colors[colorIndex++ % colors.length],
      })
    );

    res.json(industriesData);
  } catch (error) {
    console.error("Get mentee industries error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch recent achievements
exports.getRecentAchievements = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    // if (req.user.id != mentorId && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    // Assuming achievements are stored in a Progress or Achievement model
    // Here, we'll derive from Mentorship progress as a placeholder
    const mentorships = await Mentorship.findAll({
      where: {
        mentorId,
        status: "accepted",
      },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
      order: [["updatedAt", "DESC"]],
      limit: 3,
    });

    const achievements = mentorships.map((mentorship) => ({
      name: `${mentorship.mentee.firstName} ${mentorship.mentee.lastName}`,
      avatar:
        mentorship.mentee.profileImage || "/placeholder.svg?height=24&width=24",
      description: mentorship.goals
        ? `Progressed on: ${mentorship.goals}`
        : "Made significant progress",
      date: new Date(mentorship.updatedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }));

    res.json(achievements);
  } catch (error) {
    console.error("Get recent achievements error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
