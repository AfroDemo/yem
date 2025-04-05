const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
  getMatches,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");
const upload = require("../utils/upload");

const router = express.Router();

router.get("/", auth, adminAuth, getAllUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, adminAuth, deleteUser);
router.put(
  "/:id/upload",
  auth,
  upload.single("profileImage"),
  uploadProfileImage
);
router.get("/matches/:id",getMatches)

module.exports = router;
