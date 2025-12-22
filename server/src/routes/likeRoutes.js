const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Like a post
router.post('/:pid', likeController.likePost);

// Unlike a post
router.delete('/:pid', likeController.unlikePost);

// Get like status for a post
router.get('/:pid/status', likeController.getLikeStatus);

// Get users who liked a post
router.get('/:pid/users', likeController.getLikers);

module.exports = router;
