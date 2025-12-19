const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new post
router.post('/', [
  body('caption').optional().trim(),
  body('isPrivate').optional().isBoolean(),
  body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required'),
  body('exercises.*.exerciseTypeId').isInt().withMessage('Exercise type is required'),
  body('exercises.*.reps').isInt({ min: 1 }).withMessage('Reps must be a positive number'),
  body('exercises.*.sets').isInt({ min: 1 }).withMessage('Sets must be a positive number'),
  body('exercises.*.weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('exercises.*.restTime').isInt({ min: 0 }).withMessage('Rest time must be a positive number')
], postController.createPost);

// Get feed (posts from followed users)
router.get('/feed', postController.getFeed);

// Get explore (all public posts)
router.get('/explore', postController.getExplore);

// Get posts by specific user
router.get('/user/:uid', postController.getUserPosts);

// Get single post
router.get('/:pid', postController.getPost);

// Delete post
router.delete('/:pid', postController.deletePost);

module.exports = router;
