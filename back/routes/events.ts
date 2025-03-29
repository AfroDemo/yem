import express from 'express';
import { 
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  searchEvents
} from '../controllers/eventController';
import { auth, mentorAuth } from '../middleware/auth';

const router = express.Router();

// Create event (mentors and admins only)
router.post('/', auth, mentorAuth, createEvent);

// Get all events
router.get('/', getAllEvents);

// Get event by ID
router.get('/:id', getEventById);

// Update event
router.put('/:id', auth, updateEvent);

// Delete event
router.delete('/:id', auth, deleteEvent);

// Get upcoming events
router.get('/upcoming', getUpcomingEvents);

// Search events
router.get('/search', searchEvents);

export default router;
