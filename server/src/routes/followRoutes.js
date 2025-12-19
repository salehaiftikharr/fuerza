const express = require('express');
const followController = require('../controllers/followController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Follow a user
router.post('/:uid', followController.follow);

// Unfollow a user
router.delete('/:uid', followController.unfollow);

// Get user's followers
router.get('/:uid/followers', followController.getFollowers);

// Get who user follows
router.get('/:uid/following', followController.getFollowing);

// Check if current user follows this user
router.get('/:uid/status', followController.checkStatus);

module.exports = router;
