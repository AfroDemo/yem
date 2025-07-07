const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  createSession,
  updateSession,
  getMentorSessions,
  deleteSession,
  associateResources,
  getMenteeSessions,
} = require("../controllers/sessionController");
const { getMentees } = require("../controllers/mentorController");

// Create a session
router.post("/", auth, createSession);

// Get sessions for a mentor
router.get("/mentees/:menteeId/sessions", auth, getMenteeSessions);
router.get("/mentors/:mentorId/sessions", auth, getMentorSessions);

// Update a session
router.put("/:sessionId", auth, updateSession);

// Delete a session
router.delete("/:sessionId", auth, deleteSession);

// Get mentees for a mentor
router.get("/mentors/:mentorId/mentees", auth, getMentees);

// Associate resources with a session
router.post("/:sessionId/resources", auth, associateResources);

module.exports = router;
