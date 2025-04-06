const express = require("express");
const mentorshipRequestController = require("../controllers/mentorshipRequestController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/",auth, mentorshipRequestController.createRequest);
router.get("/mentor",auth, mentorshipRequestController.getMentorRequests);
router.get("/mentee",auth, mentorshipRequestController.getMenteeRequests);
router.get("/:requestId",auth, mentorshipRequestController.getRequestDetails);
router.put(
  "/:requestId/status",
  mentorshipRequestController.updateRequestStatus
);
router.delete("/:requestId", mentorshipRequestController.cancelRequest);

module.exports = router;
