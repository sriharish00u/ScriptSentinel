const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'scriptsentinel_jwt_secret_2026_super_secure';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

// Middleware to verify JWT
const protect = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, token missing.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token invalid or expired.' });
  }
};

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const apiKey = 'sk_live_' + crypto.randomBytes(16).toString('hex');

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      apiKey,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        apiKey: user.apiKey,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/auth/login
 * @desc Authenticate user and get token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        apiKey: user.apiKey,
        customTriggers: user.customTriggers,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user profile
 */
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

/**
 * @route POST /api/v1/auth/custom-rules
 * @desc Add a custom brand restriction rule
 */
router.post('/custom-rules', protect, async (req, res) => {
  try {
    const { term, safeAlternative, severity = 'high', reason } = req.body;
    if (!term || !safeAlternative) {
      return res.status(400).json({ success: false, error: 'Term and Safe Alternative are required.' });
    }

    req.user.customTriggers.push({ term, safeAlternative, severity, reason });
    await req.user.save();

    return res.json({ success: true, data: req.user.customTriggers });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  router,
  protect,
};
