import express from 'express';
import { 
  createMentorship,
  getAllMentorships,
  getMentorshipById,
  updateMentorship,
  updateMentorshipStatus,
  getMentorshipsByMentor,
  getMentorshipsByMentee,
  addProgressUpdate,
  addFeedback
} from '../controllers/mentorshipController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Create mentorship request
router.post('/', auth, createMentorship);

// Get all mentorships (admin only)
router.get('/', auth, getAllMentorships);

// Get mentorship by ID
router.get('/:id', auth, getMentorshipById);

// Update mentorship
router.put('/:id', auth, updateMentorship);

// Update mentorship status
router.put('/:id/status', auth, updateMentorshipStatus);

// Get mentorships by mentor
router.get('/mentor/:mentorId', auth, getMentorshipsByMentor);

// Get mentorships by mentee
router.get('/mentee/:menteeId', auth, getMentorshipsByMentee);

// Add progress update
router.post('/:id/progress', auth, addProgressUpdate);

// Add feedback
router.post('/:id/feedback', auth, addFeedback);

export default router;
