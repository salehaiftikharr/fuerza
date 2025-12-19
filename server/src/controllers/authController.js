const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwtConfig = require('../config/jwt');

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { uid: user.uid, username: user.username },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  const refreshToken = crypto.randomBytes(64).toString('hex');

  return { accessToken, refreshToken };
};

// Parse duration string to milliseconds
const parseDuration = (duration) => {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, name } = req.body;

    // Check if username exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Check if email exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const uid = await User.create({ username, email, password, name });
    const user = await User.findById(uid);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    const expiresAt = new Date(Date.now() + parseDuration(jwtConfig.refreshExpiresIn));
    await RefreshToken.create(uid, refreshToken, expiresAt);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: user.uid,
        username: user.username,
        email: user.email,
        name: user.name,
        profile_picture: user.profile_picture
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    const expiresAt = new Date(Date.now() + parseDuration(jwtConfig.refreshExpiresIn));
    await RefreshToken.create(user.uid, refreshToken, expiresAt);

    res.json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        username: user.username,
        email: user.email,
        name: user.name,
        profile_picture: user.profile_picture,
        profile_bio: user.profile_bio
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Find valid refresh token
    const tokenDoc = await RefreshToken.findByToken(refreshToken);
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Get user
    const user = await User.findById(tokenDoc.uid);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Delete old refresh token
    await RefreshToken.delete(refreshToken);

    // Generate new tokens
    const tokens = generateTokens(user);

    // Save new refresh token
    const expiresAt = new Date(Date.now() + parseDuration(jwtConfig.refreshExpiresIn));
    await RefreshToken.create(user.uid, tokens.refreshToken, expiresAt);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.delete(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      uid: user.uid,
      username: user.username,
      email: user.email,
      name: user.name,
      profile_picture: user.profile_picture,
      profile_bio: user.profile_bio
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Error getting user info' });
  }
};
