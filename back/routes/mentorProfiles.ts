import express from 'express';
import { 
  createMentorProfile, 
  getAllMentorProfiles, 
  getMentorProfileById, 
  updateMentorProfile, 
  getFeaturedMentors, 
  searchMentorsByExpertise 
} from '../controllers/mentorProfileController';
import { auth, mentorAuth } from '../middleware/auth';

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

export default router;
