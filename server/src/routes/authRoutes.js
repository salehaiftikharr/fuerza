const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters')
], authController.signup);

// Login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Refresh token
router.post('/refresh', authController.refresh);

// Logout
router.post('/logout', authController.logout);

// Get current user
router.get('/me', auth, authController.me);

module.exports = router;
