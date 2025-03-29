import express from 'express';
import { 
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
  markMessageAsRead
} from '../controllers/messageController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Send message
router.post('/', auth, sendMessage);

// Get messages by conversation
router.get('/conversation/:conversationId', auth, getMessagesByConversation);

// Delete message
router.delete('/:id', auth, deleteMessage);

// Mark message as read
router.put('/:id/read', auth, markMessageAsRead);

export default router;
