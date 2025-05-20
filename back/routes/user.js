const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
  getMatches,
  getAllMentors,
  searchUsers,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");
const upload = require("../utils/upload");

const router = express.Router();

// Put specific routes BEFORE dynamic routes
router.get("/search", auth, searchUsers); // Moved this up
router.get("/matches/:id", auth, getMatches); // Moved this up

// General routes
router.get("/", auth, adminAuth, getAllUsers);
router.get("/:id", auth, getUserById); // This should come after specific routes
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, adminAuth, deleteUser);
router.put(
  "/:id/upload",
  auth,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
