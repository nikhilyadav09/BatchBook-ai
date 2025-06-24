// server/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// JWT Token Generation
const generateToken = (userId) => {
  return jwt.sign(
    { userId, timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// JWT Token Verification
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, avatar: true }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Password Hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// OTP Generation and Storage
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = async (identifier, otp, type = 'email') => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return await prisma.otp.upsert({
    where: { identifier },
    update: { 
      code: otp, 
      expiresAt, 
      attempts: 0, 
      isUsed: false 
    },
    create: { 
      identifier, 
      code: otp, 
      type, 
      expiresAt, 
      attempts: 0, 
      isUsed: false 
    }
  });
};

const verifyOTP = async (identifier, code) => {
  const otpRecord = await prisma.otp.findUnique({
    where: { identifier }
  });

  if (!otpRecord) {
    throw new Error('OTP not found');
  }

  if (otpRecord.isUsed) {
    throw new Error('OTP already used');
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new Error('OTP expired');
  }

  if (otpRecord.attempts >= 3) {
    throw new Error('Too many failed attempts');
  }

  if (otpRecord.code !== code) {
    await prisma.otp.update({
      where: { identifier },
      data: { attempts: otpRecord.attempts + 1 }
    });
    throw new Error('Invalid OTP');
  }

  // Mark OTP as used
  await prisma.otp.update({
    where: { identifier },
    data: { isUsed: true }
  });

  return true;
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  hashPassword,
  comparePassword,
  generateOTP,
  storeOTP,
  verifyOTP
};