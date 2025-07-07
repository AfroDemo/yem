const { Op } = require("sequelize");
const {
  Session,
  User,
  Resource,
  SessionResource,
  Mentorship,
  sequelize,
} = require("../models");

const createSession = async (req, res) => {
  try {
    const { mentorId, menteeId, topic, startTime, endTime, type, agenda } =
      req.body;

    if (!req.user || mentorId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Mentor ID does not match authenticated user",
      });
    }

    const mentorship = await Mentorship.findOne({
      where: { mentorId, menteeId, status: "accepted" },
    });
    if (!mentorship) {
      return res.status(400).json({
        message: "No accepted mentorship found for this mentor-mentee pair",
      });
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start < now || end <= start) {
      return res.status(400).json({
        message:
          "Invalid session times: Start time must be in the future and before end time",
      });
    }

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
    console.log("Executing getMentorSessions");
    const { mentorId } = req.params;
    console.log("getMentorSessions called with mentorId:", mentorId);

    if (!mentorId) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    const sessions = await Session.findAll({
      where: { mentorId: parseInt(mentorId) },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["startTime", "ASC"]],
    });

    const formattedSessions = await Promise.all(
      sessions.map(async (session) => {
        const sessionResources = await sequelize.query(
          `SELECT r.id, r.title 
           FROM resources r
           JOIN session_resources sr ON sr.resourceId = r.id
           WHERE sr.sessionId = :sessionId`,
          {
            replacements: { sessionId: session.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        return {
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
          resources: sessionResources || [],
        };
      })
    );

    res.status(200).json(formattedSessions);
  } catch (error) {
    console.error("Get mentor sessions error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch sessions" });
  }
};

const getMenteeSessions = async (req, res) => {
  console.log("Hapooooooooooooooooooooooooooooooo")
  try {
    console.log("Executing getMenteeSessions");
    const { menteeId } = req.params;
    console.log(
      "getMenteeSessions called with menteeId:",
      menteeId,
      "user:",
      req.user
    );

    if (!menteeId) {
      return res.status(400).json({ message: "Mentee ID is required" });
    }

    const sessions = await Session.findAll({
      where: { menteeId: parseInt(menteeId), status: { [Op.ne]: "cancelled" } },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["startTime", "ASC"]],
    });

    console.log(
      "Found sessions for menteeId:",
      menteeId,
      "count:",
      sessions.length
    );

    const formattedSessions = await Promise.all(
      sessions.map(async (session) => {
        const sessionResources = await sequelize.query(
          `SELECT r.id, r.title 
           FROM resources r
           JOIN session_resources sr ON sr.resourceId = r.id
           WHERE sr.sessionId = :sessionId`,
          {
            replacements: { sessionId: session.id },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        return {
          id: session.id,
          title: session.topic,
          dateTime: session.startTime,
          duration:
            (new Date(session.endTime) - new Date(session.startTime)) / 60000,
          type: session.type,
          agenda: session.agenda || "",
          mentor: session.mentor
            ? {
                id: session.mentor.id,
                name: `${session.mentor.firstName} ${session.mentor.lastName}`,
              }
            : null,
          resources: sessionResources || [],
        };
      })
    );

    res.status(200).json(formattedSessions);
  } catch (error) {
    console.error("Get mentee sessions error:", error);
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

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!req.user || mentorId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Mentor ID does not match authenticated user",
      });
    }

    const mentorship = await Mentorship.findOne({
      where: { mentorId, menteeId, status: "accepted" },
    });
    if (!mentorship) {
      return res.status(400).json({
        message: "No accepted mentorship found for this mentor-mentee pair",
      });
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start < now || end <= start) {
      return res.status(400).json({
        message:
          "Invalid session times: Start time must be in the future and before end time",
      });
    }

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

    await session.update({
      mentorId,
      menteeId,
      topic,
      startTime,
      endTime,
      type,
      agenda,
      status: session.status,
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

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (
      !req.user ||
      (session.mentorId !== req.user.id && session.menteeId !== req.user.id)
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your session" });
    }

    await session.update({ status: "cancelled" });

    res.status(200).json({ message: "Session cancelled successfully" });
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

    if (!req.user || parseInt(mentorId) !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: Mentor ID does not match authenticated user",
      });
    }

    const mentorships = await Mentorship.findAll({
      where: { mentorId, status: "accepted" },
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
  const transaction = await sequelize.transaction();

  try {
    const { sessionId } = req.params;
    const { resourceIds } = req.body;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!req.user || session.mentorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your session" });
    }

    await sequelize.query(
      "DELETE FROM session_resources WHERE sessionId = :sessionId",
      {
        replacements: { sessionId },
        transaction,
      }
    );

    if (resourceIds && resourceIds.length > 0) {
      const insertQueries = resourceIds.map((resourceId) =>
        sequelize.query(
          "INSERT INTO session_resources (sessionId, resourceId) VALUES (:sessionId, :resourceId)",
          {
            replacements: { sessionId, resourceId },
            transaction,
          }
        )
      );
      await Promise.all(insertQueries);
    }

    await transaction.commit();
    res.status(200).json({ message: "Resources associated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Associate resources error:", error);
    res.status(500).json({
      message: "Failed to associate resources",
      error: error.message,
    });
  }
};

module.exports = {
  createSession,
  getMentorSessions,
  getMenteeSessions,
  updateSession,
  deleteSession,
  getMentees,
  associateResources,
};
