const db = require('../config/database');

const Follow = {
  // Follow a user
  async follow(followerUid, followingUid) {
    await db.execute(
      'INSERT IGNORE INTO Follows (follower_uid, following_uid) VALUES (?, ?)',
      [followerUid, followingUid]
    );
  },

  // Unfollow a user
  async unfollow(followerUid, followingUid) {
    await db.execute(
      'DELETE FROM Follows WHERE follower_uid = ? AND following_uid = ?',
      [followerUid, followingUid]
    );
  },

  // Check if following
  async isFollowing(followerUid, followingUid) {
    const [rows] = await db.execute(
      'SELECT 1 FROM Follows WHERE follower_uid = ? AND following_uid = ?',
      [followerUid, followingUid]
    );
    return rows.length > 0;
  },

  // Get followers
  async getFollowers(uid) {
    const [rows] = await db.execute(`
      SELECT u.uid, u.username, u.name, u.profile_picture
      FROM User u
      JOIN Follows f ON u.uid = f.follower_uid
      WHERE f.following_uid = ?
      ORDER BY f.created_at DESC
    `, [uid]);
    return rows;
  },

  // Get following
  async getFollowing(uid) {
    const [rows] = await db.execute(`
      SELECT u.uid, u.username, u.name, u.profile_picture
      FROM User u
      JOIN Follows f ON u.uid = f.following_uid
      WHERE f.follower_uid = ?
      ORDER BY f.created_at DESC
    `, [uid]);
    return rows;
  },

  // Get follow counts
  async getCounts(uid) {
    const [followers] = await db.execute(
      'SELECT COUNT(*) as count FROM Follows WHERE following_uid = ?',
      [uid]
    );
    const [following] = await db.execute(
      'SELECT COUNT(*) as count FROM Follows WHERE follower_uid = ?',
      [uid]
    );
    return {
      followers: followers[0].count,
      following: following[0].count
    };
  }
};

module.exports = Follow;
