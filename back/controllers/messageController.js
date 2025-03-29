const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user?.id;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (
      conversation.participants.findIndex(
        (participant) => participant.toString() === senderId
      ) === -1
    ) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }

    // Create new message
    const newMessage = new Message({
      conversationId,
      senderId,
      content,
      timestamp: new Date(),
      isRead: false
    });

    const savedMessage = await newMessage.save();

    // Update conversation's last message and timestamp
    conversation.lastMessage = savedMessage._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages by conversation
exports.getMessagesByConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user?.id;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (
      conversation.participants.findIndex(
        (participant) => participant.toString() === userId
      ) === -1
    ) {
      return res.status(403).json({ message: 'Not authorized to view messages in this conversation' });
    }

    // Get messages
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 })
      .populate('senderId', 'firstName lastName profileImage');
    
    res.json(messages);

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId,
        senderId: { $ne: userId },
        isRead: false
      },
      { isRead: true }
    );
  } catch (error) {
    console.error('Get messages by conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user?.id;

    // Find message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is authorized to delete this message
    if (message.senderId.toString() !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.remove();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark message as read
exports.markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user?.id;

    // Find message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the recipient
    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (
      message.senderId.toString() === userId ||
      conversation.participants.findIndex(
        (participant) => participant.toString() === userId
      ) === -1
    ) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    // Mark message as read
    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
