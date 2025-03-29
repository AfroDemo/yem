import express from 'express';
import { 
  createSuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  updateSuccessStory,
  deleteSuccessStory,
  getFeaturedSuccessStories
} from '../controllers/successStoryController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Create success story
router.post('/', auth, createSuccessStory);

// Get all success stories
router.get('/', getAllSuccessStories);

// Get success story by ID
router.get('/:id', getSuccessStoryById);

// Update success story
router.put('/:id', auth, updateSuccessStory);

// Delete success story
router.delete('/:id', auth, deleteSuccessStory);

// Get featured success stories
router.get('/featured', getFeaturedSuccessStories);

export default router;
