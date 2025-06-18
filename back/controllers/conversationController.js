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
  if (!unreadCount || typeof unreadCount !== "object") {
    return participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  }
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

    if (!participantId || participantId === currentUserId) {
      return res.status(400).json({ error: "Invalid participant ID" });
    }

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
      conversation = await Conversation.findByPk(conversation.id, {
        raw: true,
      });
    }

    let participantIds = conversation.participants;
    if (typeof participantIds === "string") {
      participantIds = JSON.parse(participantIds);
    }
    let lastMessage = conversation.lastMessage;
    if (typeof lastMessage === "string") {
      lastMessage = JSON.parse(lastMessage);
    }
    let unreadCount = fixUnreadCount(conversation.unreadCount, participantIds);

    const participants = await User.findAll({
      where: { id: { [Op.in]: participantIds } },
      attributes: ["id", "firstName", "lastName", "profileImage"],
      raw: true,
    });

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

    let participantIds = conversation.participants;
    if (typeof participantIds === "string") {
      participantIds = JSON.parse(participantIds);
    }

    if (!participantIds.includes(senderId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const receiverId = participantIds.find((id) => id !== senderId);
    if (!receiverId) {
      return res.status(400).json({ error: "No valid receiver found" });
    }

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

    let unreadCount = fixUnreadCount(conversation.unreadCount, participantIds);
    const updatedUnreadCount = {
      ...unreadCount,
      [receiverId]: (unreadCount[receiverId] || 0) + 1,
      [senderId]: 0,
    };

    await conversation.update({
      lastMessage: { senderId, content, createdAt: message.createdAt },
      unreadCount: updatedUnreadCount,
    });

    console.log("Updated conversation:", {
      conversationId,
      lastMessage: { senderId, content, createdAt: message.createdAt },
      unreadCount: updatedUnreadCount,
      dbUnreadCount: conversation.unreadCount,
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
          where: { id: { [Op.in]: participantIds } },
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

    const validConversations = conversationsWithParticipants.filter(
      (conv) => conv !== null
    );

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
    const { page = 1, limit = 50, markAsRead } = req.query;

    const offset = (page - 1) * limit;

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

    if (markAsRead === "true") {
      const updatedCount = await Message.update(
        { read: true },
        { where: { conversationId, receiverId: userId, read: false } }
      );
      if (updatedCount[0] > 0) {
        const newUnreadCount = {};
        for (const id of participantIds) {
          const count = await Message.count({
            where: { conversationId, receiverId: id, read: false },
          });
          newUnreadCount[id] = count;
        }
        await conversation.update({ unreadCount: newUnreadCount });
        console.log("Marked messages as read:", {
          conversationId,
          userId,
          updatedMessages: updatedCount[0],
          unreadCountBefore: unreadCount,
          unreadCountAfter: newUnreadCount,
        });
      } else {
        console.log("No messages to mark as read:", { conversationId, userId });
      }
    }

    res.json({
      messages: messages.reverse(),
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

    if (!participantIds.includes(userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete conversation" });
    }

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
