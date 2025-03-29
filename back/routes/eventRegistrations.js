const express = require('express');
const { 
  registerForEvent,
  getRegistrationsByEvent,
  getRegistrationsByUser,
  cancelRegistration,
  updateRegistrationStatus
} = require('../controllers/eventRegistrationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register for event
router.post('/', auth, registerForEvent);

// Get registrations by event
router.get('/event/:eventId', auth, getRegistrationsByEvent);

// Get registrations by user
router.get('/user/:userId', auth, getRegistrationsByUser);

// Cancel registration
router.put('/:id/cancel', auth, cancelRegistration);

// Update registration status (for organizers)
router.put('/:id/status', auth, updateRegistrationStatus);

module.exports = router;
