const { validationResult } = require('express-validator');
const User = require('../models/User');
const Follow = require('../models/Follow');

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get follow counts
    const counts = await Follow.getCounts(user.uid);

    // Check if current user follows this user
    let isFollowing = false;
    if (req.user.uid !== user.uid) {
      isFollowing = await Follow.isFollowing(req.user.uid, user.uid);
    }

    res.json({
      uid: user.uid,
      username: user.username,
      name: user.name,
      profile_picture: user.profile_picture,
      profile_bio: user.profile_bio,
      followers: counts.followers,
      following: counts.following,
      isFollowing,
      isOwnProfile: req.user.uid === user.uid
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error getting profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, profile_bio } = req.body;

    await User.updateProfile(req.user.uid, { name, profile_bio });

    const user = await User.findById(req.user.uid);

    res.json({
      message: 'Profile updated',
      user: {
        uid: user.uid,
        username: user.username,
        name: user.name,
        profile_picture: user.profile_picture,
        profile_bio: user.profile_bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const picturePath = '/uploads/' + req.file.filename;
    await User.updateProfilePicture(req.user.uid, picturePath);

    res.json({
      message: 'Profile picture updated',
      profile_picture: picturePath
    });
  } catch (error) {
    console.error('Upload picture error:', error);
    res.status(500).json({ message: 'Error uploading picture' });
  }
};

exports.search = async (req, res) => {
  try {
    const { term, searchBy } = req.query;

    if (!term || term.trim().length === 0) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    const users = await User.search(term.trim(), searchBy);

    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
};
