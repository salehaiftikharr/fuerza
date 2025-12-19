const express = require('express');
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get list of conversations
router.get('/conversations', messageController.getConversations);

// Get unread count
router.get('/unread', messageController.getUnreadCount);

// Get messages with specific user
router.get('/:uid', messageController.getMessages);

// Send message to user
router.post('/:uid', [
  body('contents').trim().notEmpty().withMessage('Message cannot be empty')
], messageController.sendMessage);

// Mark messages as read
router.put('/:uid/read', messageController.markAsRead);

module.exports = router;
