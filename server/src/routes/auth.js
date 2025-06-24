// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  requestOTP,
  verifyOTPLogin,
  getCurrentUser,
  logout
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRequest, 
  registerSchema, 
  loginSchema, 
  otpRequestSchema, 
  otpVerifySchema 
} = require('../utils/validation');
const rateLimiter = require('../middleware/rateLimiter');

// Rate limiting for auth endpoints
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later'
});

const otpLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // 2 OTP requests per minute
  message: 'Too many OTP requests, please wait before requesting again'
});

// Public routes
router.post('/register', validateRequest(registerSchema), authLimiter, register);
router.post('/login', validateRequest(loginSchema), authLimiter, login);
router.post('/request-otp', validateRequest(otpRequestSchema), otpLimiter, requestOTP);
router.post('/verify-otp', validateRequest(otpVerifySchema), authLimiter, verifyOTPLogin);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);

module.exports = router;
