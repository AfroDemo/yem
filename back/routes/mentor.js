const express = require("express");
const {
  getDashboardMetrics,
  getTodaysSessions,
  getRecentMessages,
  getMenteeProgress,
  getSharedResources,
  getUpcomingReports,
  getMentees,
  getAllMentors,
} = require("../controllers/mentorController");
const { auth } = require("../middleware/auth");
const { getMentorSessions } = require("../controllers/sessionController");

const router = express.Router();
router.get("/", auth, getAllMentors);
router.get("/:mentorId/dashboard-metrics", auth, getDashboardMetrics);
router.get("/:mentorId/sessions/today", auth, getTodaysSessions);
router.get("/:mentorId/messages/recent", auth, getRecentMessages);
router.get("/:mentorId/mentees/progress", auth, getMenteeProgress);
router.get("/:mentorId/resources/shared", auth, getSharedResources);
router.get("/:mentorId/reports/upcoming", auth, getUpcomingReports);
router.get("/:mentorId/mentees", auth, getMentees);
router.get("/:mentorId/sessions", auth, getMentorSessions);

module.exports = router;
