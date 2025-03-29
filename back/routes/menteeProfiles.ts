import express from 'express';
import { 
  createMenteeProfile, 
  getAllMenteeProfiles, 
  getMenteeProfileById, 
  updateMenteeProfile 
} from '../controllers/menteeProfileController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Create mentee profile
router.post('/', auth, createMenteeProfile);

// Get all mentee profiles
router.get('/', auth, getAllMenteeProfiles);

// Get mentee profile by ID
router.get('/:id', auth, getMenteeProfileById);

// Update mentee profile
router.put('/:id', auth, updateMenteeProfile);

export default router;
