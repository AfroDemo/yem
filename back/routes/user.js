const express = require("express");
const router = express.Router();
const { check, param } = require("express-validator");
const multer = require("../config/multer");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");

// Custom middleware to check if user is self or admin
const selfOrAdmin = (req, res, next) => {
  if (req.user.id === parseInt(req.params.id) || req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: "Unauthorized to perform this action",
  });
};

/**
 * @route   GET /api/users?page=1&limit=10
 * @desc    Get paginated list of users (admin only)
 * @access  Private/Admin
 */
router.get(
  "/",
  auth,
  adminAuth,
  [
    check("page").optional().isInt({ min: 1 }).toInt(),
    check("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  "/:id",
  auth,
  [param("id").isInt().withMessage("ID must be an integer")],
  getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private (self or admin)
 */
router.put(
  "/:id",
  auth,
  selfOrAdmin,
  [
    param("id").isInt().withMessage("ID must be an integer"),
    check("firstName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name cannot be empty"),
    check("lastName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Last name cannot be empty"),
    check("email")
      .optional()
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    check("bio").optional().trim().escape(),
    check("skills").optional().isArray(),
    check("socialLinks.*")
      .optional()
      .isURL()
      .withMessage("Must be a valid URL"),
  ],
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  auth,
  adminAuth,
  [param("id").isInt().withMessage("ID must be an integer")],
  deleteUser
);

/**
 * @route   PUT /api/users/:id/profile-image
 * @desc    Upload profile image (5MB max, JPG/PNG only)
 * @access  Private (self or admin)
 */
router.put(
  "/:id/profile-image",
  auth,
  selfOrAdmin,
  multer.single("image"),
  [param("id").isInt().withMessage("ID must be an integer")],
  uploadProfileImage
);

module.exports = router;
const express = require("express");
const router = express.Router();
const { check, param } = require("express-validator");
const multer = require("../config/multer");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");

// Custom middleware to check if user is self or admin
const selfOrAdmin = (req, res, next) => {
  if (req.user.id === parseInt(req.params.id) || req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: "Unauthorized to perform this action",
  });
};

/**
 * @route   GET /api/users?page=1&limit=10
 * @desc    Get paginated list of users (admin only)
 * @access  Private/Admin
 */
router.get(
  "/",
  auth,
  adminAuth,
  [
    check("page").optional().isInt({ min: 1 }).toInt(),
    check("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  "/:id",
  auth,
  [param("id").isInt().withMessage("ID must be an integer")],
  getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private (self or admin)
 */
router.put(
  "/:id",
  auth,
  selfOrAdmin,
  [
    param("id").isInt().withMessage("ID must be an integer"),
    check("firstName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("First name cannot be empty"),
    check("lastName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Last name cannot be empty"),
    check("email")
      .optional()
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    check("bio").optional().trim().escape(),
    check("skills").optional().isArray(),
    check("socialLinks.*")
      .optional()
      .isURL()
      .withMessage("Must be a valid URL"),
  ],
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
router.delete(
  "/:id",
  auth,
  adminAuth,
  [param("id").isInt().withMessage("ID must be an integer")],
  deleteUser
);

/**
 * @route   PUT /api/users/:id/profile-image
 * @desc    Upload profile image (5MB max, JPG/PNG only)
 * @access  Private (self or admin)
 */
router.put(
  "/:id/profile-image",
  auth,
  selfOrAdmin,
  multer.single("image"),
  [param("id").isInt().withMessage("ID must be an integer")],
  uploadProfileImage
);

module.exports = router;
