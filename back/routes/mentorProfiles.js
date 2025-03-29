const express = require('express');
const { 
  createMentorProfile, 
  getAllMentorProfiles, 
  getMentorProfileById, 
  updateMentorProfile, 
  getFeaturedMentors, 
  searchMentorsByExpertise 
} = require('../controllers/mentorProfileController');
const { auth, mentorAuth } = require('../middleware/auth');

const router = express.Router();

// Create mentor profile
router.post('/', auth, mentorAuth, createMentorProfile);

// Get all mentor profiles
router.get('/', getAllMentorProfiles);

// Get mentor profile by ID
router.get('/:id', getMentorProfileById);

// Update mentor profile
router.put('/:id', auth, updateMentorProfile);

// Get featured mentors
router.get('/featured', getFeaturedMentors);

// Search mentors by expertise
router.get('/search', searchMentorsByExpertise);

module.exports = router;
