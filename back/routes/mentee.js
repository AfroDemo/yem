const express = require("express");
const {
  getMenteeDashboardMetrics,
  getTodaysSessions,
  getRecentMessages,
  getMenteeProgress,
  getSharedResources,
  getUpcomingReports,
  getNewConnections,
  getMentors,
  getAllMentees,
} = require("../controllers/menteeController");
const { auth } = require("../middleware/auth");
const { getMentorSessions } = require("../controllers/sessionController");

const router = express.Router();

router.get("/", auth, getAllMentees);
router.get("/:menteeId/dashboard-metrics", auth, getMenteeDashboardMetrics);
router.get("/:menteeId/sessions/today", auth, getTodaysSessions);
router.get("/:menteeId/messages/recent", auth, getRecentMessages);
router.get("/:menteeId/progress", auth, getMenteeProgress);
router.get("/:menteeId/resources/shared", auth, getSharedResources);
router.get("/:menteeId/reports/upcoming", auth, getUpcomingReports);
router.get("/:menteeId/connections/new", auth, getNewConnections);
router.get("/:menteeId/mentors", auth, getMentors);
router.get("/:menteeId/sessions", auth, getMentorSessions); // Reusing getMentorSessions for mentee sessions

module.exports = router;
