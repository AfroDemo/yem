const db = require("../models");
const { Op } = require("sequelize");

const User = db.User;
const Mentorship = db.Mentorship;
const Session = db.Session;
const Message = db.Message;
const Resource = db.Resource;
const Report = db.Report;
const Review = db.Review;

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
      activeMentees,
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

    const messages = await Message.findAll({
      where: { receiverId: mentorId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

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

    const progressData = mentorships.map((mentorship) => {
      // Parse goals (TEXT) to JSON array
      let goalsArray = [];
      try {
        goalsArray = JSON.parse(mentorship.goals);
        if (!Array.isArray(goalsArray)) {
          goalsArray = [{ title: mentorship.goals, status: "in-progress" }];
        }
      } catch (e) {
        goalsArray = [{ title: mentorship.goals, status: "in-progress" }];
      }

      // Parse progress (JSON) to a percentage
      let progressValue = 0;
      try {
        const progress = mentorship.progress || [];
        if (Array.isArray(progress)) {
          const completed = progress.filter((p) => p.completed).length;
          progressValue =
            progress.length > 0 ? (completed / progress.length) * 100 : 0;
        }
      } catch (e) {
        progressValue = 0;
      }

      return {
        id: mentorship.mentee.id,
        firstName: mentorship.mentee.firstName,
        lastName: mentorship.mentee.lastName,
        profileImage: mentorship.mentee.profileImage,
        progress: progressValue,
        goals: goalsArray,
      };
    });

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
          required: true,
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
