const { Request, Response } = require('express');
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const User = require('../models/User');

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if event has reached maximum capacity
    if (event.maxAttendees > 0 && event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event has reached maximum capacity' });
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId,
      userId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Create new registration
    const newRegistration = new EventRegistration({
      eventId,
      userId,
      registrationDate: new Date(),
      status: 'confirmed'
    });

    const savedRegistration = await newRegistration.save();

    // Update event attendee count
    event.currentAttendees += 1;
    await event.save();

    res.status(201).json(savedRegistration);
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get registrations by event
exports.getRegistrationsByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is authorized to view registrations
    if (event.organizerId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }

    const registrations = await EventRegistration.find({ eventId })
      .populate('userId', 'firstName lastName email profileImage');
    
    res.json(registrations);
  } catch (error) {
    console.error('Get registrations by event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get registrations by user
exports.getRegistrationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user is authorized to view registrations
    if (userId !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }

    const registrations = await EventRegistration.find({ userId })
      .populate({
        path: 'eventId',
        populate: {
          path: 'organizerId',
          select: 'firstName lastName'
        }
      })
      .sort({ 'eventId.startDate': 1 });
    
    res.json(registrations);
  } catch (error) {
    console.error('Get registrations by user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;

    // Find registration
    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user is authorized to cancel this registration
    if (registration.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    // Update registration status
    registration.status = 'cancelled';
    registration.cancellationDate = new Date();
    await registration.save();

    // Update event attendee count
    const event = await Event.findById(registration.eventId);
    if (event && event.currentAttendees > 0) {
      event.currentAttendees -= 1;
      await event.save();
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update registration status (for organizers)
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registrationId = req.params.id;

    if (!['confirmed', 'cancelled', 'attended', 'no-show'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find registration
    const registration = await EventRegistration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user is authorized to update this registration
    const event = await Event.findById(registration.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizerId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this registration' });
    }

    // Update registration status
    registration.status = status;
    
    if (status === 'cancelled') {
      registration.cancellationDate = new Date();
      
      // Update event attendee count if cancelling
      if (event.currentAttendees > 0) {
        event.currentAttendees -= 1;
        await event.save();
      }
    }

    await registration.save();
    res.json(registration);
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
