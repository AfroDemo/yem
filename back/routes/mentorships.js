const express = require("express");
const {
  createMentorship,
  getMenteeRequests,
  updateMentorshipStatus,
  getRequestDetails
} = require("../controllers/mentorshipController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Create mentorship request
router.post("/", auth, createMentorship);

// Get all mentorships (admin only)
router.get("/", auth, getMenteeRequests);

// Get mentorship by ID
router.get("/:id", auth, getRequestDetails);

// Update mentorship
// router.put("/:id", auth, updateMentorship);

// Update mentorship status
router.put("/:id/status", auth, updateMentorshipStatus);

// Get mentorships by mentor
// router.get("/mentor/:mentorId", auth, getMentorshipsByMentor);

// Get mentorships by mentee
// router.get("/mentee/:menteeId", auth, getMentorshipsByMentee);

// Add progress update
// router.post("/:id/progress", auth, addProgressUpdate);

// Add feedback
// router.post("/:id/feedback", auth, addFeedback);

module.exports = router;
