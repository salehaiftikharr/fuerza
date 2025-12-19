const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.getConversations(req.user.uid);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error getting conversations' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const otherUid = parseInt(req.params.uid);
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // Mark messages as read
    await Message.markAsRead(otherUid, req.user.uid);

    const messages = await Message.getConversation(req.user.uid, otherUid, limit, offset);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const toUid = parseInt(req.params.uid);
    const { contents } = req.body;

    if (req.user.uid === toUid) {
      return res.status(400).json({ message: 'Cannot message yourself' });
    }

    // Check if recipient exists
    const recipient = await User.findById(toUid);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mid = await Message.send(req.user.uid, toUid, contents);

    res.status(201).json({
      message: 'Message sent',
      mid
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const fromUid = parseInt(req.params.uid);

    await Message.markAsRead(fromUid, req.user.uid);

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user.uid);

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Error getting unread count' });
  }
};
