const express = require("express");
const {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getFeaturedResources,
  searchResources,
  getMenteeResources, // Add new controller
} = require("../controllers/resourceController");
const { auth, mentorAuth, handleMulterError } = require("../middleware/auth");
const upload = require("../utils/upload");

const router = express.Router();

// Create resource (mentors and admins only)
router.post("/", upload.single("file"), handleMulterError, auth, mentorAuth, createResource);

// Get all resources (require auth)
router.get("/", auth, getAllResources);

// Get resources for a mentee
router.get("/mentees/:menteeId", auth, getMenteeResources);

// Get resource frutaID
router.get("/:id", auth, getResourceById);

// Update resource
router.put("/:id", auth, updateResource);

// Delete resource
router.delete("/:id", auth, deleteResource);

// Get featured resources
router.get("/featured", auth, getFeaturedResources);

// Search resources
router.get("/search", auth, searchResources);

module.exports = router;