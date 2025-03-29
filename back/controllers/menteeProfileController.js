const { Request, Response } = require('express');
const MenteeProfile = require('../models/MenteeProfile');
const User = require('../models/User');

// Create mentee profile
exports.createMenteeProfile = async (req, res) => {
  try {
    const { 
      entrepreneurshipStage, 
      businessIdea, 
      goals, 
      challenges, 
      preferredMentorExpertise,
      educationBackground,
      workExperience
    } = req.body;

    // Check if user exists and is a mentee
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'mentee' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only mentees can create mentee profiles' });
    }

    // Check if mentee profile already exists
    const existingProfile = await MenteeProfile.findOne({ userId: req.user?.id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Mentee profile already exists for this user' });
    }

    // Create new mentee profile
    const newMenteeProfile = new MenteeProfile({
      userId: req.user?.id,
      entrepreneurshipStage,
      businessIdea,
      goals,
      challenges,
      preferredMentorExpertise,
      educationBackground,
      workExperience
    });

    const savedProfile = await newMenteeProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Create mentee profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all mentee profiles
exports.getAllMenteeProfiles = async (req, res) => {
  try {
    const menteeProfiles = await MenteeProfile.find().populate('userId', 'firstName lastName email profileImage');
    res.json(menteeProfiles);
  } catch (error) {
    console.error('Get all mentee profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get mentee profile by ID
exports.getMenteeProfileById = async (req, res) => {
  try {
    const menteeProfile = await MenteeProfile.findById(req.params.id).populate('userId', 'firstName lastName email profileImage bio location socialLinks');
    if (!menteeProfile) {
      return res.status(404).json({ message: 'Mentee profile not found' });
    }
    res.json(menteeProfile);
  } catch (error) {
    console.error('Get mentee profile by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update mentee profile
exports.updateMenteeProfile = async (req, res) => {
  try {
    const { 
      entrepreneurshipStage, 
      businessIdea, 
      goals, 
      challenges, 
      preferredMentorExpertise,
      educationBackground,
      workExperience
    } = req.body;

    // Find mentee profile
    const menteeProfile = await MenteeProfile.findById(req.params.id);
    if (!menteeProfile) {
      return res.status(404).json({ message: 'Mentee profile not found' });
    }

    // Check if user is authorized to update this profile
    if (menteeProfile.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this mentee profile' });
    }

    // Update fields
    if (entrepreneurshipStage) menteeProfile.entrepreneurshipStage = entrepreneurshipStage;
    if (businessIdea) menteeProfile.businessIdea = businessIdea;
    if (goals) menteeProfile.goals = goals;
    if (challenges) menteeProfile.challenges = challenges;
    if (preferredMentorExpertise) menteeProfile.preferredMentorExpertise = preferredMentorExpertise;
    if (educationBackground) menteeProfile.educationBackground = educationBackground;
    if (workExperience) menteeProfile.workExperience = workExperience;

    const updatedProfile = await menteeProfile.save();
    res.json(updatedProfile);
  } catch (error) {
    console.error('Update mentee profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
