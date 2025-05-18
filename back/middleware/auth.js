const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

/**
 * Authentication middleware to verify JWT token
 */
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

/**
 * Middleware to check if user is admin
 */
const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }
};

/**
 * Middleware to check if user is mentor or admin
 */
const mentorAuth = (req, res, next) => {
  if (req.user && (req.user.role === "mentor" || req.user.role === "admin")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Mentor privileges required." });
  }
};

/**
 * Middleware to check if user is mentee or admin
 */
const menteeAuth = (req, res, next) => {
  if (req.user && (req.user.role === "mentee" || req.user.role === "admin")) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied. Mentee privileges required." });
  }
};

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: `File upload error: ${err.message}` });
  } else if (err) {
    req.fileValidationError = err;
    next();
  } else {
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  mentorAuth,
  menteeAuth,
  handleMulterError,
};
