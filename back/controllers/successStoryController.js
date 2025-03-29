const { Request, Response } = require("express");
const SuccessStory = require("../models/SuccessStory");
const User = require("../models/User");

// Create success story
exports.createSuccessStory = async (req, res) => {
  try {
    const {
      title,
      content,
      menteeId,
      mentorId,
      businessName,
      achievements,
      tags,
      testimonial,
    } = req.body;

    const authorId = req.user?.id;

    // Check if users exist
    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Create new success story
    const newSuccessStory = new SuccessStory({
      title,
      content,
      menteeId,
      mentorId,
      businessName,
      achievements: achievements || [],
      tags: tags || [],
      testimonial,
      authorId,
      publishDate: new Date(),
      featured: false,
    });

    const savedSuccessStory = await newSuccessStory.save();
    res.status(201).json(savedSuccessStory);
  } catch (error) {
    console.error("Create success story error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all success stories
exports.getAllSuccessStories = async (req, res) => {
  try {
    const successStories = await SuccessStory.find()
      .populate("menteeId", "firstName lastName profileImage")
      .populate("mentorId", "firstName lastName profileImage")
      .sort({ publishDate: -1 });

    res.json(successStories);
  } catch (error) {
    console.error("Get all success stories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get success story by ID
exports.getSuccessStoryById = async (req, res) => {
  try {
    const successStory = await SuccessStory.findById(req.params.id)
      .populate("menteeId", "firstName lastName profileImage bio")
      .populate("mentorId", "firstName lastName profileImage bio")
      .populate("authorId", "firstName lastName");

    if (!successStory) {
      return res.status(404).json({ message: "Success story not found" });
    }

    res.json(successStory);
  } catch (error) {
    console.error("Get success story by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update success story
exports.updateSuccessStory = async (req, res) => {
  try {
    const {
      title,
      content,
      businessName,
      achievements,
      tags,
      testimonial,
      featured,
    } = req.body;

    // Find success story
    const successStory = await SuccessStory.findById(req.params.id);
    if (!successStory) {
      return res.status(404).json({ message: "Success story not found" });
    }

    // Check if user is authorized to update this success story
    if (
      successStory.authorId.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this success story" });
    }

    // Update fields
    if (title) successStory.title = title;
    if (content) successStory.content = content;
    if (businessName) successStory.businessName = businessName;
    if (achievements) successStory.achievements = achievements;
    if (tags) successStory.tags = tags;
    if (testimonial) successStory.testimonial = testimonial;

    // Only admins can set featured status
    if (featured !== undefined && req.user?.role === "admin") {
      successStory.featured = featured;
    }

    successStory.lastUpdated = new Date();

    const updatedSuccessStory = await successStory.save();
    res.json(updatedSuccessStory);
  } catch (error) {
    console.error("Update success story error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete success story
exports.deleteSuccessStory = async (req, res) => {
  try {
    // Find success story
    const successStory = await SuccessStory.findById(req.params.id);
    if (!successStory) {
      return res.status(404).json({ message: "Success story not found" });
    }

    // Check if user is authorized to delete this success story
    if (
      successStory.authorId.toString() !== req.user?.id &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this success story" });
    }

    await successStory.remove();
    res.json({ message: "Success story deleted successfully" });
  } catch (error) {
    console.error("Delete success story error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get featured success stories
exports.getFeaturedSuccessStories = async (req, res) => {
  try {
    const featuredStories = await SuccessStory.find({ featured: true })
      .populate("menteeId", "firstName lastName profileImage")
      .populate("mentorId", "firstName lastName profileImage")
      .limit(6);

    res.json(featuredStories);
  } catch (error) {
    console.error("Get featured success stories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
