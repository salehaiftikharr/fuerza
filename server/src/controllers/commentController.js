const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pid = parseInt(req.params.pid);
    const { content } = req.body;

    // Check if post exists
    const post = await Post.getById(pid);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const commentId = await Comment.create(pid, req.user.uid, content);
    const commentCount = await Comment.getCount(pid);

    res.status(201).json({
      message: 'Comment added',
      commentId,
      commentCount
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);

    const deleted = await Comment.delete(commentId, req.user.uid);
    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found or not authorized' });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const comments = await Comment.getByPost(pid, limit, offset);
    const commentCount = await Comment.getCount(pid);

    res.json({ comments, commentCount });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Error getting comments' });
  }
};
