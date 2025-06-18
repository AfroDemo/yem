const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const { validationResult } = require("express-validator");

// Models
const Conversation = db.Conversation;
const Message = db.Message;
const User = db.User;
const Mentorship = db.Mentorship;

// Utility to validate and fix unreadCount
const fixUnreadCount = (unreadCount, participantIds) => {
  if (typeof unreadCount === "string") {
    try {
      unreadCount = JSON.parse(unreadCount);
    } catch (e) {
      console.error("Failed to parse unreadCount:", e);
      return participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
    }
  }
  // Ensure unreadCount is a valid object with participant IDs
  if (!unreadCount || typeof unreadCount !== "object") {
    return participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  }
  // Remove invalid keys and ensure participant IDs are present
  const validUnreadCount = participantIds.reduce(
    (acc, id) => ({
      ...acc,
      [id]: Number.isInteger(unreadCount[id]) ? unreadCount[id] : 0,
    }),
    {}
  );
  return validUnreadCount;
};

const getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user.id;

    // Validate inputs
    if (!participantId || participantId === currentUserId) {
      return res.status(400).json({
        error: "Invalid participant ID",
      });
    }

    // Check if users have an active or pending mentorship
    const mentorship = await Mentorship.findOne({
      where: {
        [Op.or]: [
          { mentorId: currentUserId, menteeId: participantId },
          { mentorId: participantId, menteeId: currentUserId },
        ],
        status: ["pending", "accepted"],
      },
    });

    if (!mentorship) {
      return res.status(403).json({ error: "No active mentorship exists" });
    }

    // Use Sequelize.fn and Sequelize.literal for JSON querying
    let conversation = await Conversation.findOne({
      where: Sequelize.literal(`
        JSON_CONTAINS(participants, '${currentUserId}') AND 
        JSON_CONTAINS(participants, '${participantId}')
      `),
      raw: true,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, participantId],
        lastMessage: {},
        unreadCount: { [currentUserId]: 0, [participantId]: 0 },
      });
      // Fetch the full conversation after creation
      conversation = await Conversation.findByPk(conversation.id, {
        raw: true,
      });
    }

    // Parse JSON fields
    let participantIds = conversation.participants;
    if (typeof participantIds === "string") {
      participantIds = JSON.parse(participantIds);
    }
    let lastMessage = conversation.lastMessage;
    if (typeof lastMessage === "string") {
      lastMessage = JSON.parse(lastMessage);
    }
    let unreadCount = fixUnreadCount(conversation.unreadCount, participantIds);

    // Fetch participant details manually
    const participants = await User.findAll({
      where: {
        id: { [Op.in]: participantIds },
      },
      attributes: ["id", "firstName", "lastName", "profileImage"],
      raw: true,
    });

    // Combine conversation with participant details
    const fullConversation = {
      ...conversation,
      participants: participantIds,
      lastMessage,
      unreadCount,
      participantDetails: participants,
    };

    res.status(200).json(fullConversation);
  } catch (error) {
    console.error("Conversation creation error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    console.log("Sending message:", { content, conversationId, senderId });

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Ensure participants is an array
    let participantIds = conversation.participants;
    if (typeof participantIds === "string") {
      participantIds = JSON.parse(participantIds);
    }

    // Verify sender is a participant
    if (!participantIds.includes(senderId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Find receiver ID
    const receiverId = participantIds.find((id) => id !== senderId);
    if (!receiverId) {
      return res.status(400).json({ error: "No valid receiver found" });
    }

    // Verify mentorship still exists
    const mentorship = await Mentorship.findOne({
      where: {
        [Op.or]: [
          { mentorId: senderId, menteeId: receiverId },
          { mentorId: receiverId, menteeId: senderId },
        ],
        status: ["pending", "accepted"],
      },
    });

    if (!mentorship) {
      return res.status(403).json({ error: "No active mentorship exists" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      receiverId,
      content,
      read: false,
    });

    // Fix and update unreadCount
    let unreadCount = fixUnreadCount(conversation.unreadCount, participantIds);
    const updatedUnreadCount = {
      ...unreadCount,
      [receiverId]: (unreadCount[receiverId] || 0) + 1,
      [senderId]: 0,
    };

    await conversation.update({
      lastMessage: {
        senderId,
        content,
        createdAt: message.createdAt,
      },
      unreadCount: updatedUnreadCount,
    });

    console.log("Updated conversation:", {
      conversationId,
      lastMessage: { senderId, content, createdAt: message.createdAt },
      unreadCount: updatedUnreadCount,
    });

    const fullMessage = await Message.findByPk(message.id, {
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
    });

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error("Send message error:", {
      message: error.message,
      stack: error.stack,
      conversationId,
      senderId,
    });
    res.status(500).json({ error: "Server error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    // Find conversations where user is a participant using JSON_CONTAINS
    const { count, rows: conversations } = await Conversation.findAndCountAll({
      where: Sequelize.literal(`JSON_CONTAINS(participants, '${userId}')`),
      include: [
        {
          model: Message,
          as: "messages",
          order: [["createdAt", "DESC"]],
          limit: 1,
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
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Parse JSON fields and fetch participant details
    const conversationsWithParticipants = await Promise.all(
      conversations.map(async (conv) => {
        let participantIds = conv.participants;
        if (typeof participantIds === "string") {
          try {
            participantIds = JSON.parse(participantIds);
          } catch (parseError) {
            console.error("Failed to parse participants:", parseError);
            return null;
          }
        }
        let lastMessage = conv.lastMessage;
        if (typeof lastMessage === "string") {
          try {
            lastMessage = JSON.parse(lastMessage);
          } catch (parseError) {
            console.error("Failed to parse lastMessage:", parseError);
            return null;
          }
        }
        let unreadCount = fixUnreadCount(conv.unreadCount, participantIds);

        const participants = await User.findAll({
          where: {
            id: { [Op.in]: participantIds },
          },
          attributes: ["id", "firstName", "lastName", "profileImage"],
          raw: true,
        });
        return {
          ...conv.toJSON(),
          participants: participantIds,
          lastMessage,
          unreadCount,
          participantDetails: participants,
        };
      })
    );

    // Filter out null entries (from failed JSON parsing)
    const validConversations = conversationsWithParticipants.filter(
      (conv) => conv !== null
    );

    console.log("Convo data:", JSON.stringify(validConversations, null, 2));

    res.json({
      conversations: validConversations,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Fetch conversations error:", {
      message: error.message,
      stack: error.stack,
      userId,
      sql: error.sql,
    });
    res.status(500).json({ error: "Server error fetching conversations" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    let participantIds = conversation.participants;
    if (typeof participantIds === "string") {
      try {
        participantIds = JSON.parse(participantIds);
      } catch (parseError) {
        console.error("Failed to parse participants:", parseError);
        return res.status(500).json({ error: "Invalid conversation data" });
      }
    }
    let unreadCount = fixUnreadCount(conversation.unreadCount, participantIds);
    if (!participantIds.includes(userId)) {
      return res.status(403).json({ error: "Not authorized to view messages" });
    }

    // Fetch messages with pagination
    const { count, rows: messages } = await Message.findAndCountAll({
      where: { conversationId },
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
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (count === 0) {
      return res.json({
        messages: [],
        totalPages: 0,
        currentPage: parseInt(page),
      });
    }

    // Mark messages as read for the current user
    await Message.update(
      { read: true },
      { where: { conversationId, receiverId: userId, read: false } }
    );

    // Reset unread count for the user
    await conversation.update({
      unreadCount: {
        ...unreadCount,
        [userId]: 0,
      },
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Fetch messages error:", {
      message: error.message,
      stack: error.stack,
      userId,
      sql: error.sql,
    });
    res.status(500).json({ error: "Server error fetching messages" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    let participantIds = conversation.participants;
    if (typeof participantIds === "string") {
      participantIds = JSON.parse(participantIds);
    }

    // Check if user is a participant
    if (!participantIds.includes(userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete conversation" });
    }

    // Soft delete or actual delete based on your requirements
    await conversation.destroy();

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Conversation deletion error:", error);
    res.status(500).json({ error: "Server error deleting conversation" });
  }
};

module.exports = {
  getOrCreateConversation,
  sendMessage,
  getConversations,
  getMessages,
  deleteConversation,
};
