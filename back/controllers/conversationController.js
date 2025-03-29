const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Message = require("../models/Message");

// Create conversation
exports.createConversation = async (req, res) => {
  try {
    const { participants, title } = req.body;
    const creatorId = req.user?.id;

    // Ensure creator is included in participants
    if (!participants.includes(creatorId)) {
      participants.push(creatorId);
    }

    // Check if all participants exist
    for (const participantId of participants) {
      const user = await User.findById(participantId);
      if (!user) {
        return res
          .status(404)
          .json({ message: `User with ID ${participantId} not found` });
      }
    }

    // Check if conversation already exists between these participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length },
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Create new conversation
    const newConversation = new Conversation({
      participants,
      title,
      createdBy: creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get conversations by user
exports.getConversationsByUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "firstName lastName profileImage")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Get unread message count for each conversation
    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          senderId: { $ne: userId },
          isRead: false,
        });

        return {
          ...conversation.toObject(),
          unreadCount,
        };
      })
    );

    res.json(conversationsWithUnreadCount);
  } catch (error) {
    console.error("Get conversations by user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user?.id;

    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "firstName lastName profileImage bio")
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some((p) => p._id.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this conversation" });
    }

    res.json(conversation);
  } catch (error) {
    console.error("Get conversation by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update conversation
exports.updateConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversationId = req.params.id;
    const userId = req.user?.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this conversation" });
    }

    // Update conversation
    if (title) conversation.title = title;
    conversation.updatedAt = new Date();

    const updatedConversation = await conversation.save();
    res.json(updatedConversation);
  } catch (error) {
    console.error("Update conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add participant to conversation
exports.addParticipant = async (req, res) => {
  try {
    const { participantId } = req.body;
    const conversationId = req.params.id;
    const userId = req.user?.id;

    // Check if user to add exists
    const userToAdd = await User.findById(participantId);
    if (!userToAdd) {
      return res.status(404).json({ message: "User to add not found" });
    }

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this conversation" });
    }

    // Check if user is already in the conversation
    if (conversation.participants.some((p) => p.toString() === participantId)) {
      return res
        .status(400)
        .json({ message: "User is already in this conversation" });
    }

    // Add participant
    conversation.participants.push(participantId);
    conversation.updatedAt = new Date();

    const updatedConversation = await conversation.save();
    res.json(updatedConversation);
  } catch (error) {
    console.error("Add participant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeParticipant = async (req, res) => {
  try {
    const { participantId } = req.body;
    const conversationId = req.params.id;
    const userId = req.user?.id;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this conversation" });
    }

    // Check if participant exists in the conversation
    if (
      !conversation.participants.some((p) => p.toString() === participantId)
    ) {
      return res
        .status(400)
        .json({ message: "User not part of this conversation" });
    }

    // Remove participant
    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== participantId
    );
    conversation.updatedAt = new Date();

    const updatedConversation = await conversation.save();
    res.json(updatedConversation);
  } catch (error) {
    console.error("Remove participant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Leave conversation
exports.leaveConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user?.id;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to leave this conversation" });
    }

    // Remove user from participants
    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== userId
    );

    // If no participants left, delete the conversation
    if (conversation.participants.length === 0) {
      await conversation.remove();
      return res.json({ message: "Conversation deleted successfully" });
    }

    conversation.updatedAt = new Date();
    const updatedConversation = await conversation.save();
    res.json(updatedConversation);
  } catch (error) {
    console.error("Leave conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
