const { Request, Response } = require('express');
const Event = require('../models/Event');
const User = require('../models/User');

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      startDate, 
      endDate, 
      location, 
      isOnline, 
      maxAttendees,
      tags,
      category
    } = req.body;
    
    const organizerId = req.user?.id;

    // Check if user exists
    const user = await User.findById(organizerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new event
    const newEvent = new Event({
      title,
      description,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      isOnline: isOnline || false,
      maxAttendees: maxAttendees || 0,
      currentAttendees: 0,
      organizerId,
      tags: tags || [],
      category
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { type, category, upcoming, past } = req.query;
    
    // Build query based on filters
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    // Filter for upcoming or past events
    const now = new Date();
    if (upcoming === 'true') {
      query.startDate = { $gte: now };
    } else if (past === 'true') {
      query.startDate = { $lt: now };
    }
    
    const events = await Event.find(query)
      .populate('organizerId', 'firstName lastName profileImage')
      .sort({ startDate: upcoming === 'true' ? 1 : -1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'firstName lastName profileImage bio');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      startDate, 
      endDate, 
      location, 
      isOnline, 
      maxAttendees,
      tags,
      category
    } = req.body;

    // Find event
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is authorized to update this event
    if (event.organizerId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (type) event.type = type;
    if (startDate) event.startDate = new Date(startDate);
    if (endDate) event.endDate = new Date(endDate);
    if (location !== undefined) event.location = location;
    if (isOnline !== undefined) event.isOnline = isOnline;
    if (maxAttendees !== undefined) event.maxAttendees = maxAttendees;
    if (tags) event.tags = tags;
    if (category) event.category = category;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    // Find event
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is authorized to delete this event
    if (event.organizerId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get upcoming events
exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ startDate: { $gte: now } })
      .populate('organizerId', 'firstName lastName profileImage')
      .sort({ startDate: 1 })
      .limit(6);
    
    res.json(events);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search events
exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search in title, description, and location
    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
      .populate('organizerId', 'firstName lastName profileImage')
      .sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};