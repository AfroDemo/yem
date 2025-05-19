const { Op } = require("sequelize");
const {
  Session,
  User,
  Resource,
  SessionResource,
  Mentorship,
} = require("../models");

const createSession = async (req, res) => {
  try {
    const { mentorId, menteeId, topic, startTime, endTime, type, agenda } =
      req.body;

    // Validate mentorId matches authenticated user
    if (mentorId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Mentor ID does not match authenticated user",
      });
    }

    // Validate active mentorship
    const mentorship = await Mentorship.findOne({
      where: { mentorId, menteeId, status: "active" },
    });
    if (!mentorship) {
      return res.status(400).json({
        message: "No active mentorship found for this mentor-mentee pair",
      });
    }

    // Validate session times
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start < now || end <= start) {
      return res.status(400).json({
        message:
          "Invalid session times: Start time must be in the future and before end time",
      });
    }

    // Check for time conflicts
    const conflict = await Session.findOne({
      where: {
        mentorId,
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } },
            ],
          },
        ],
      },
    });
    if (conflict) {
      return res
        .status(400)
        .json({ message: "Time conflict with another session" });
    }

    // Create session
    const session = await Session.create({
      mentorId,
      menteeId,
      topic,
      startTime,
      endTime,
      type,
      agenda,
      status: "upcoming",
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create session" });
  }
};

const getMentorSessions = async (req, res) => {
  try {
    const { mentorId } = req.params;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (parseInt(mentorId) !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Mentor ID does not match authenticated user",
        });
    }
    const sessions = await Session.findAll({
      where: { mentorId },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Resource,
          as: "resources",
          attributes: ["id", "title"],
          through: { attributes: [] },
          required: false, // Allow sessions without resources
        },
      ],
      order: [["startTime", "ASC"]],
    });
    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      title: session.topic,
      dateTime: session.startTime,
      duration:
        (new Date(session.endTime) - new Date(session.startTime)) / 60000,
      type: session.type,
      agenda: session.agenda || "",
      mentee: session.mentee
        ? {
            id: session.mentee.id,
            name: `${session.mentee.firstName} ${session.mentee.lastName}`,
          }
        : null,
      resources: session.resources || [], // Default to empty array
    }));
    res.status(200).json(formattedSessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch sessions" });
  }
};

const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { mentorId, menteeId, topic, startTime, endTime, type, agenda } =
      req.body;

    // Find the session
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate mentorId matches authenticated user
    if (mentorId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Mentor ID does not match authenticated user",
      });
    }

    // Validate active mentorship
    const mentorship = await Mentorship.findOne({
      where: { mentorId, menteeId, status: "active" },
    });
    if (!mentorship) {
      return res.status(400).json({
        message: "No active mentorship found for this mentor-mentee pair",
      });
    }

    // Validate session times
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start < now || end <= start) {
      return res.status(400).json({
        message:
          "Invalid session times: Start time must be in the future and before end time",
      });
    }

    // Check for time conflicts (excluding current session)
    const conflict = await Session.findOne({
      where: {
        mentorId,
        id: { [Op.ne]: sessionId },
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } },
            ],
          },
        ],
      },
    });
    if (conflict) {
      return res
        .status(400)
        .json({ message: "Time conflict with another session" });
    }

    // Update session
    await session.update({
      mentorId,
      menteeId,
      topic,
      startTime,
      endTime,
      type,
      agenda,
      status: session.status, // Preserve existing status
    });

    res.status(200).json(session);
  } catch (error) {
    console.error("Update session error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update session" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find the session
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate mentorId matches authenticated user
    if (session.mentorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your session" });
    }

    // Delete session
    await session.destroy();

    res.status(204).json();
  } catch (error) {
    console.error("Delete session error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to delete session" });
  }
};

const getMentees = async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Validate mentorId matches authenticated user
    if (parseInt(mentorId) !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Mentor ID does not match authenticated user",
      });
    }

    const mentorships = await Mentorship.findAll({
      where: { mentorId, status: "active" },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    const mentees = mentorships.map((mentorship) => ({
      id: mentorship.mentee.id,
      firstName: mentorship.mentee.firstName,
      lastName: mentorship.mentee.lastName,
    }));

    res.status(200).json(mentees);
  } catch (error) {
    console.error("Get mentees error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch mentees" });
  }
};

const associateResources = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { resourceIds } = req.body;

    // Find the session
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate mentorId matches authenticated user
    if (session.mentorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your session" });
    }

    // Validate resources belong to mentor
    const resources = await Resource.findAll({
      where: {
        id: resourceIds,
        createdById: req.user.id,
      },
    });
    if (resources.length !== resourceIds.length) {
      return res.status(400).json({
        message: "Invalid resource IDs: Some resources do not belong to you",
      });
    }

    // Clear existing associations
    await SessionResource.destroy({ where: { sessionId } });

    // Create new associations
    const associations = resourceIds.map((resourceId) => ({
      sessionId,
      resourceId,
    }));
    await SessionResource.bulkCreate(associations);

    // Optionally share resources with mentee via ResourceShare
    const existingShares = await ResourceShare.findAll({
      where: { resourceId: resourceIds, userId: session.menteeId },
    });
    const existingShareIds = existingShares.map((share) => share.resourceId);
    const newShares = resourceIds
      .filter((resourceId) => !existingShareIds.includes(resourceId))
      .map((resourceId) => ({
        resourceId,
        userId: session.menteeId,
      }));
    if (newShares.length > 0) {
      await ResourceShare.bulkCreate(newShares);
    }

    res
      .status(200)
      .json({ message: "Resources associated and shared successfully" });
  } catch (error) {
    console.error("Associate resources error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to associate resources" });
  }
};

module.exports = {
  createSession,
  getMentorSessions,
  updateSession,
  deleteSession,
  getMentees,
  associateResources,
};
