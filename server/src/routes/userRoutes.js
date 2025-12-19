const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user profile by username
router.get('/:username', userController.getProfile);

// Update own profile
router.put('/profile', [
  body('name').optional().trim().isLength({ max: 100 }),
  body('profile_bio').optional().trim().isLength({ max: 500 })
], userController.updateProfile);

// Upload profile picture
router.post('/profile/picture', upload.single('picture'), userController.uploadProfilePicture);

// Search users
router.get('/search/query', userController.search);

module.exports = router;
