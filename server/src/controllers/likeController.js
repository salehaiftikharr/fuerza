const Like = require('../models/Like');
const Post = require('../models/Post');

exports.likePost = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    // Check if post exists
    const post = await Post.getById(pid);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Like.like(pid, req.user.uid);
    const likeCount = await Like.getCount(pid);

    res.json({
      message: 'Post liked',
      liked: true,
      likeCount
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Error liking post' });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    await Like.unlike(pid, req.user.uid);
    const likeCount = await Like.getCount(pid);

    res.json({
      message: 'Post unliked',
      liked: false,
      likeCount
    });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Error unliking post' });
  }
};

exports.getLikeStatus = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    const liked = await Like.hasLiked(pid, req.user.uid);
    const likeCount = await Like.getCount(pid);

    res.json({ liked, likeCount });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ message: 'Error getting like status' });
  }
};

exports.getLikers = async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const likers = await Like.getLikers(pid, limit, offset);

    res.json(likers);
  } catch (error) {
    console.error('Get likers error:', error);
    res.status(500).json({ message: 'Error getting likers' });
  }
};
