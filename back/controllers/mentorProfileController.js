const express = require('express');
const MentorProfile = require('../models/MentorProfile');
const User = require('../models/User');

// Create mentor profile
exports.createMentorProfile = async (req, res) => {
  try {
    const { expertise, experience, company, position, availability, mentorshipStyle, maxMentees } = req.body;

    // Check if user exists and is a mentor
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'mentor' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only mentors can create mentor profiles' });
    }

    // Check if mentor profile already exists
    const existingProfile = await MentorProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Mentor profile already exists for this user' });
    }

    // Create new mentor profile
    const newMentorProfile = new MentorProfile({
      userId: req.user.id,
      expertise,
      experience,
      company,
      position,
      availability,
      mentorshipStyle,
      maxMentees: maxMentees || 3,
      currentMenteeCount: 0
    });

    const savedProfile = await newMentorProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Create mentor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all mentor profiles
exports.getAllMentorProfiles = async (req, res) => {
  try {
    const mentorProfiles = await MentorProfile.find().populate('userId', 'firstName lastName email profileImage');
    res.json(mentorProfiles);
  } catch (error) {
    console.error('Get all mentor profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mentor profile by ID
exports.getMentorProfileById = async (req, res) => {
  try {
    const mentorProfile = await MentorProfile.findById(req.params.id).populate('userId', 'firstName lastName email profileImage bio location socialLinks');
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }
    res.json(mentorProfile);
  } catch (error) {
    console.error('Get mentor profile by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update mentor profile
exports.updateMentorProfile = async (req, res) => {
  try {
    const { expertise, experience, company, position, availability, mentorshipStyle, maxMentees, acceptingMentees } = req.body;

    // Find mentor profile
    const mentorProfile = await MentorProfile.findById(req.params.id);
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // Check if user is authorized to update this profile
    if (mentorProfile.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this mentor profile' });
    }

    // Update fields
    if (expertise) mentorProfile.expertise = expertise;
    if (experience) mentorProfile.experience = experience;
    if (company) mentorProfile.company = company;
    if (position) mentorProfile.position = position;
    if (availability) mentorProfile.availability = availability;
    if (mentorshipStyle) mentorProfile.mentorshipStyle = mentorshipStyle;
    if (maxMentees) mentorProfile.maxMentees = maxMentees;
    if (acceptingMentees !== undefined) mentorProfile.acceptingMentees = acceptingMentees;

    const updatedProfile = await mentorProfile.save();
    res.json(updatedProfile);
  } catch (error) {
    console.error('Update mentor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured mentors
exports.getFeaturedMentors = async (req, res) => {
  try {
    // In a real application, you might have a "featured" field or use rating/review count
    // For this demo, we'll just get mentors with the highest ratings
    const featuredMentors = await MentorProfile.find({ acceptingMentees: true })
      .sort({ rating: -1 })
      .limit(6)
      .populate('userId', 'firstName lastName email profileImage bio');
    
    res.json(featuredMentors);
  } catch (error) {
    console.error('Get featured mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search mentors by expertise
exports.searchMentorsByExpertise = async (req, res) => {
  try {
    const { expertise } = req.query;
    
    if (!expertise) {
      return res.status(400).json({ message: 'Expertise query parameter is required' });
    }

    // Search for mentors with matching expertise (case-insensitive)
    const mentors = await MentorProfile.find({
      expertise: { $regex: expertise, $options: 'i' },
      acceptingMentees: true
    }).populate('userId', 'firstName lastName email profileImage bio');
    
    res.json(mentors);
  } catch (error) {
    console.error('Search mentors by expertise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
