const express = require('express');
const { 
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  searchEvents
} = require('../controllers/eventController');
const { auth, mentorAuth } = require('../middleware/auth');

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

module.exports = router;
