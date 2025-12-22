const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get comments for a post
router.get('/:pid', commentController.getComments);

// Create a comment
router.post('/:pid', [
  body('content').trim().notEmpty().withMessage('Comment cannot be empty')
    .isLength({ max: 1000 }).withMessage('Comment too long')
], commentController.createComment);

// Delete a comment
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
