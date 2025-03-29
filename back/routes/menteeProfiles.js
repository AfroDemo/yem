const express = require('express');
const { 
  createMenteeProfile, 
  getAllMenteeProfiles, 
  getMenteeProfileById, 
  updateMenteeProfile 
} = require('../controllers/menteeProfileController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create mentee profile
router.post('/', auth, createMenteeProfile);

// Get all mentee profiles
router.get('/', auth, getAllMenteeProfiles);

// Get mentee profile by ID
router.get('/:id', auth, getMenteeProfileById);

// Update mentee profile
router.put('/:id', auth, updateMenteeProfile);

module.exports = router;
