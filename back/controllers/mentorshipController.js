const Mentorship = require("../models/Mentorship");
const MentorProfile = require("../models/MentorProfile");
const User = require("../models/User");

// Create mentorship request
exports.createMentorship = async (req, res) => {
  try {
    const { mentorId, goals, meetingFrequency } = req.body;
    const menteeId = req.user?.id;

    // Check if mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if mentee exists
    const mentee = await User.findById(menteeId);
    if (!mentee || mentee.role !== "mentee") {
      return res.status(404).json({ message: "Mentee not found" });
    }

    // Check if mentor profile exists and is accepting mentees
    const mentorProfile = await MentorProfile.findOne({ userId: mentorId });
    if (!mentorProfile) {
      return res.status(404).json({ message: "Mentor profile not found" });
    }

    if (!mentorProfile.acceptingMentees) {
      return res
        .status(400)
        .json({
          message: "This mentor is not accepting new mentees at this time",
        });
    }

    if (mentorProfile.currentMenteeCount >= mentorProfile.maxMentees) {
      return res
        .status(400)
        .json({
          message: "This mentor has reached their maximum number of mentees",
        });
    }

    // Check if mentorship already exists between these users
    const existingMentorship = await Mentorship.findOne({
      mentorId,
      menteeId,
      status: { $in: ["pending", "active"] },
    });

    if (existingMentorship) {
      return res
        .status(400)
        .json({
          message: "A mentorship request already exists between these users",
        });
    }

    // Create new mentorship
    const newMentorship = new Mentorship({
      mentorId,
      menteeId,
      status: "pending",
      goals: goals || [],
      meetingFrequency,
      progress: [],
    });

    const savedMentorship = await newMentorship.save();
    res.status(201).json(savedMentorship);
  } catch (error) {
    console.error("Create mentorship error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all mentorships
exports.getAllMentorships = async (req, res) => {
  try {
    const mentorships = await Mentorship.find()
      .populate("mentorId", "firstName lastName email profileImage")
      .populate("menteeId", "firstName lastName email profileImage");
    res.json(mentorships);
  } catch (error) {
    console.error("Get all mentorships error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get mentorship by ID
exports.getMentorshipById = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate("mentorId", "firstName lastName email profileImage bio")
      .populate("menteeId", "firstName lastName email profileImage bio");

    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    // Check if user is authorized to view this mentorship
    if (
      req.user?.id !== mentorship.mentorId._id.toString() &&
      req.user?.id !== mentorship.menteeId._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this mentorship" });
    }

    res.json(mentorship);
  } catch (error) {
    console.error("Get mentorship by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update mentorship
exports.updateMentorship = async (req, res) => {
  try {
    const { goals, meetingFrequency, nextMeetingDate } = req.body;

    // Find mentorship
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    // Check if user is authorized to update this mentorship
    if (
      req.user?.id !== mentorship.mentorId.toString() &&
      req.user?.id !== mentorship.menteeId.toString() &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this mentorship" });
    }

    // Update fields
    if (goals) mentorship.goals = goals;
    if (meetingFrequency) mentorship.meetingFrequency = meetingFrequency;
    if (nextMeetingDate) mentorship.nextMeetingDate = new Date(nextMeetingDate);

    const updatedMentorship = await mentorship.save();
    res.json(updatedMentorship);
  } catch (error) {
    console.error("Update mentorship error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update mentorship status
exports.updateMentorshipStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "active", "completed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find mentorship
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    // Check if user is authorized to update this mentorship status
    // Only mentors can accept/reject requests, both can complete
    if (status === "active" || status === "rejected") {
      if (
        req.user?.id !== mentorship.mentorId.toString() &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({
            message: "Only the mentor can accept or reject mentorship requests",
          });
      }
    } else if (
      req.user?.id !== mentorship.mentorId.toString() &&
      req.user?.id !== mentorship.menteeId.toString() &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this mentorship" });
    }

    // If accepting a mentorship, update mentor's currentMenteeCount
    if (status === "active" && mentorship.status !== "active") {
      const mentorProfile = await MentorProfile.findOne({
        userId: mentorship.mentorId,
      });
      if (mentorProfile) {
        mentorProfile.currentMenteeCount += 1;
        await mentorProfile.save();
      }
    }

    // If completing or rejecting a previously active mentorship, decrease mentor's currentMenteeCount
    if (
      (status === "completed" || status === "rejected") &&
      mentorship.status === "active"
    ) {
      const mentorProfile = await MentorProfile.findOne({
        userId: mentorship.mentorId,
      });
      if (mentorProfile && mentorProfile.currentMenteeCount > 0) {
        mentorProfile.currentMenteeCount -= 1;
        await mentorProfile.save();
      }
    }

    // Update status and dates
    mentorship.status = status;

    if (status === "active") {
      mentorship.startDate = new Date();
    } else if (status === "completed") {
      mentorship.endDate = new Date();
    }

    const updatedMentorship = await mentorship.save();
    res.json(updatedMentorship);
  } catch (error) {
    console.error("Update mentorship status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get mentorships by mentor
exports.getMentorshipsByMentor = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;

    // Check if user is authorized to view these mentorships
    if (req.user?.id !== mentorId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view these mentorships" });
    }

    const mentorships = await Mentorship.find({ mentorId })
      .populate("menteeId", "firstName lastName email profileImage")
      .sort({ createdAt: -1 });

    res.json(mentorships);
  } catch (error) {
    console.error("Get mentorships by mentor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get mentorships by mentee
exports.getMentorshipsByMentee = async (req, res) => {
  try {
    const menteeId = req.params.menteeId;

    // Check if user is authorized to view these mentorships
    if (req.user?.id !== menteeId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view these mentorships" });
    }

    const mentorships = await Mentorship.find({ menteeId })
      .populate("mentorId", "firstName lastName email profileImage")
      .sort({ createdAt: -1 });

    res.json(mentorships);
  } catch (error) {
    console.error("Get mentorships by mentee error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add progress update
exports.addProgressUpdate = async (req, res) => {
  try {
    const { note, achievements } = req.body;

    // Find mentorship
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    // Check if user is authorized to add progress
    if (
      req.user?.id !== mentorship.mentorId.toString() &&
      req.user?.id !== mentorship.menteeId.toString() &&
      req.user?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this mentorship" });
    }

    // Check if mentorship is active
    if (mentorship.status !== "active") {
      return res
        .status(400)
        .json({ message: "Can only add progress to active mentorships" });
    }

    // Add progress update
    const progressUpdate = {
      date: new Date(),
      note,
      achievements: achievements || [],
    };

    mentorship.progress.push(progressUpdate);
    const updatedMentorship = await mentorship.save();

    res.json(updatedMentorship);
  } catch (error) {
    console.error("Add progress update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add feedback
exports.addFeedback = async (req, res) => {
  try {
    const { mentorFeedback, menteeFeedback, mentorRating, menteeRating } =
      req.body;

    // Find mentorship
    const mentorship = await Mentorship.findById(req.params.id);
    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    // Initialize feedback object if it doesn't exist
    if (!mentorship.feedback) {
      mentorship.feedback = {};
    }

    // Check if user is authorized and update appropriate feedback
    if (
      req.user?.id === mentorship.mentorId.toString() ||
      req.user?.role === "admin"
    ) {
      if (mentorFeedback) mentorship.feedback.mentorFeedback = mentorFeedback;
      if (menteeRating) mentorship.feedback.menteeRating = menteeRating;
    } else if (
      req.user?.id === mentorship.menteeId.toString() ||
      req.user?.role === "admin"
    ) {
      if (menteeFeedback) mentorship.feedback.menteeFeedback = menteeFeedback;
      if (mentorRating) mentorship.feedback.mentorRating = mentorRating;

      // Update mentor's overall rating if mentee provided a rating
      if (mentorRating) {
        const mentorProfile = await MentorProfile.findOne({
          userId: mentorship.mentorId,
        });
        if (mentorProfile) {
          // Calculate new average rating
          const currentTotal =
            (mentorProfile.rating || 0) * (mentorProfile.reviewCount || 0);
          const newTotal = currentTotal + mentorRating;
          const newCount = (mentorProfile.reviewCount || 0) + 1;
          const newRating = newTotal / newCount;

          mentorProfile.rating = newRating;
          mentorProfile.reviewCount = newCount;
          await mentorProfile.save();
        }
      }
    } else {
      return res
        .status(403)
        .json({ message: "Not authorized to add feedback to this mentorship" });
    }

    const updatedMentorship = await mentorship.save();
    res.json(updatedMentorship);
  } catch (error) {
    console.error("Add feedback error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
