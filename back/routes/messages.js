const express = require('express');
const { 
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
  markMessageAsRead
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/', auth, sendMessage);

// Get messages by conversation
router.get('/conversation/:conversationId', auth, getMessagesByConversation);

// Delete message
router.delete('/:id', auth, deleteMessage);

// Mark message as read
router.put('/:id/read', auth, markMessageAsRead);

module.exports = router;
