const router = express.Router();
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
const { check, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const participantCheck = require('../middleware/participantCheck');

// Rate limiting for conversation routes
const conversationLimiter = require('../middleware/rateLimiters').conversationLimiter;

/**
 * @route   POST /api/conversations
 * @desc    Create a new conversation
 * @access  Private
 */
router.post(
  '/',
  auth,
  [
    check('title').optional().trim().isLength({ max: 100 }),
    check('participants').isArray({ min: 1 }).withMessage('At least one participant required'),
    check('participants.*').isInt().withMessage('Participant IDs must be integers'),
    check('isGroup').optional().isBoolean()
  ],
  validateRequest,
  conversationLimiter,
  createConversation
);

/**
 * @route   GET /api/conversations/user
 * @desc    Get all conversations for current user
 * @access  Private
 */
router.get(
  '/user',
  auth,
  [
    check('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    check('offset').optional().isInt({ min: 0 }).toInt()
  ],
  validateRequest,
  conversationLimiter,
  getConversationsByUser
);

/**
 * @route   GET /api/conversations/:id
 * @desc    Get conversation by ID
 * @access  Private (must be participant)
 */
router.get(
  '/:id',
  auth,
  [
    param('id').isInt().withMessage('Conversation ID must be an integer')
  ],
  validateRequest,
  participantCheck,
  conversationLimiter,
  getConversationById
);

/**
 * @route   PUT /api/conversations/:id
 * @desc    Update conversation details
 * @access  Private (must be participant)
 */
router.put(
  '/:id',
  auth,
  [
    param('id').isInt().withMessage('Conversation ID must be an integer'),
    check('title').optional().trim().isLength({ max: 100 }),
    check('isGroup').optional().isBoolean()
  ],
  validateRequest,
  participantCheck,
  conversationLimiter,
  updateConversation
);

/**
 * @route   POST /api/conversations/:id/participants
 * @desc    Add participant to conversation
 * @access  Private (must be participant)
 */
router.post(
  '/:id/participants',
  auth,
  [
    param('id').isInt().withMessage('Conversation ID must be an integer'),
    check('userId').isInt().withMessage('User ID must be an integer')
  ],
  validateRequest,
  participantCheck,
  conversationLimiter,
  addParticipant
);

/**
 * @route   DELETE /api/conversations/:id/participants/:userId
 * @desc    Remove participant from conversation
 * @access  Private (must be participant or admin)
 */
router.delete(
  '/:id/participants/:userId',
  auth,
  [
    param('id').isInt().withMessage('Conversation ID must be an integer'),
    param('userId').isInt().withMessage('User ID must be an integer')
  ],
  validateRequest,
  participantCheck,
  conversationLimiter,
  removeParticipant
);

/**
 * @route   DELETE /api/conversations/:id/leave
 * @desc    Leave conversation
 * @access  Private (must be participant)
 */
router.delete(
  '/:id/leave',
  auth,
  [
    param('id').isInt().withMessage('Conversation ID must be an integer')
  ],
  validateRequest,
  participantCheck,
  conversationLimiter,
  leaveConversation
);

module.exports = router;