const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword, 
  verifyEmail 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').not().isEmpty().trim().escape(),
    body('lastName').not().isEmpty().trim().escape()
  ], authLimiter,register);

// @route   POST api/auth/login
// @desc    Login user and get JWT token
// @access  Public
router.post('/login', authLimiter,login);

// @route   GET api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, getCurrentUser);

// @route   POST api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST api/auth/reset-password
// @desc    Reset user password
// @access  Public
router.post('/reset-password', resetPassword);

// @route   POST api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post('/verify-email', verifyEmail);

module.exports = router;