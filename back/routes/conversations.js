const express = require('express');
const { 
  createConversation,
  getConversationsByUser,
  getConversationById,
  updateConversation,
  addParticipant,
  removeParticipant,
  leaveConversation
} = require('../controllers/conversationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a new conversation
router.post('/', auth, createConversation);

// Get all conversations of the authenticated user
router.get('/', auth, getConversationsByUser);

// Get a specific conversation by ID
router.get('/:id', auth, getConversationById);

// Update conversation details
router.put('/:id', auth, updateConversation);

// Add a new participant to an existing conversation
router.post('/:id/participants', auth, addParticipant);

// Remove a participant from a conversation (different from leaving the conversation)
router.delete('/:id/participants', auth, removeParticipant);

// A user leaves a conversation (removes them from the conversation)
router.delete('/:id/leave', auth, leaveConversation);

module.exports = router;
