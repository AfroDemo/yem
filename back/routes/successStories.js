const express = require('express');
const { 
  createSuccessStory,
  getAllSuccessStories,
  getSuccessStoryById,
  updateSuccessStory,
  deleteSuccessStory,
  getFeaturedSuccessStories
} = require('../controllers/successStoryController');
const { auth, adminAuth } = require('../middleware/auth');

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

module.exports = router;
