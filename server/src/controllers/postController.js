const { validationResult } = require('express-validator');
const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { caption, isPrivate, exercises } = req.body;

    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ message: 'At least one exercise is required' });
    }

    const pid = await Post.create(req.user.uid, { caption, isPrivate, exercises });

    res.status(201).json({
      message: 'Post created successfully',
      pid
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const post = await Post.getById(pid);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is private and user is not the owner
    if (post.is_private && post.uid !== req.user.uid) {
      return res.status(403).json({ message: 'This post is private' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Error getting post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const deleted = await Post.delete(pid, req.user.uid);

    if (!deleted) {
      return res.status(404).json({ message: 'Post not found or not authorized' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await Post.getFeed(req.user.uid, limit, offset);

    res.json(posts);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Error getting feed' });
  }
};

exports.getExplore = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await Post.getExplore(limit, offset);

    res.json(posts);
  } catch (error) {
    console.error('Get explore error:', error);
    res.status(500).json({ message: 'Error getting explore posts' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const uid = parseInt(req.params.uid);
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await Post.getByUser(uid, req.user.uid, limit, offset);

    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ message: 'Error getting user posts' });
  }
};
