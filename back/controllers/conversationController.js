// controllers/conversationController.js
const db = require("../models");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

// Models
const Conversation = db.Conversation;
const Message = db.Message;
const User = db.User;
const Mentorship = db.Mentorship;

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
      where: db.Sequelize.literal(`
        JSON_CONTAINS(participants, '${currentUserId}') AND 
        JSON_CONTAINS(participants, '${participantId}')
      `),
      raw: true, // Improve performance by returning plain object
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, participantId], // Store as JSON array
        lastMessage: {},
        unreadCount: { [currentUserId]: 0, [participantId]: 0 },
      });
      // Fetch the full conversation after creation
      conversation = await Conversation.findByPk(conversation.id, {
        raw: true,
      });
    }

    // Fetch participant details manually
    const participantIds = conversation.participants; // JSON array of IDs
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

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Verify sender is a participant
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Verify mentorship still exists
    const receiverId = conversation.participants.find((id) => id !== senderId);
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

    // Update conversation's lastMessage and unreadCount
    await conversation.update({
      lastMessage: {
        senderId,
        content,
        createdAt: message.createdAt,
      },
      unreadCount: {
        ...conversation.unreadCount,
        [receiverId]: (conversation.unreadCount[receiverId] || 0) + 1,
      },
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
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    // Find conversations where user is a participant
    const { count, rows: conversations } = await Conversation.findAndCountAll({
      where: {
        participants: { [Op.contains]: [userId] },
      },
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

    // Fetch participant details for each conversation
    const conversationsWithParticipants = await Promise.all(
      conversations.map(async (conv) => {
        const participants = await User.findAll({
          where: {
            id: { [Op.in]: conv.participants },
          },
          attributes: ["id", "firstName", "lastName", "profileImage"],
          raw: true,
        });
        return {
          ...conv.toJSON(),
          participantDetails: participants,
        };
      })
    );

    res.json({
      conversations: conversationsWithParticipants,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Fetch conversations error:", error);
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

    if (!conversation.participants.includes(userId)) {
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

    // Mark messages as read for the current user
    await Message.update(
      { read: true },
      { where: { conversationId, receiverId: userId, read: false } }
    );

    // Reset unread count for the user
    await conversation.update({
      unreadCount: {
        ...conversation.unreadCount,
        [userId]: 0,
      },
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
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

    // Check if user is a participant
    if (!conversation.participants.includes(userId)) {
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
