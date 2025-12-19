const Follow = require('../models/Follow');
const User = require('../models/User');

exports.follow = async (req, res) => {
  try {
    const followingUid = parseInt(req.params.uid);

    if (req.user.uid === followingUid) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if user exists
    const user = await User.findById(followingUid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Follow.follow(req.user.uid, followingUid);

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Error following user' });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const followingUid = parseInt(req.params.uid);

    await Follow.unfollow(req.user.uid, followingUid);

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const uid = parseInt(req.params.uid);
    const followers = await Follow.getFollowers(uid);

    res.json(followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Error getting followers' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const uid = parseInt(req.params.uid);
    const following = await Follow.getFollowing(uid);

    res.json(following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Error getting following' });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const uid = parseInt(req.params.uid);
    const isFollowing = await Follow.isFollowing(req.user.uid, uid);

    res.json({ isFollowing });
  } catch (error) {
    console.error('Check follow status error:', error);
    res.status(500).json({ message: 'Error checking follow status' });
  }
};
