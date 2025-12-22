const db = require('../config/database');

const Like = {
  // Like a post
  async like(pid, uid) {
    try {
      await db.execute(
        'INSERT INTO PostLike (pid, uid) VALUES (?, ?)',
        [pid, uid]
      );
      return true;
    } catch (error) {
      // If duplicate (already liked), ignore
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  },

  // Unlike a post
  async unlike(pid, uid) {
    const [result] = await db.execute(
      'DELETE FROM PostLike WHERE pid = ? AND uid = ?',
      [pid, uid]
    );
    return result.affectedRows > 0;
  },

  // Check if user liked a post
  async hasLiked(pid, uid) {
    const [rows] = await db.execute(
      'SELECT 1 FROM PostLike WHERE pid = ? AND uid = ?',
      [pid, uid]
    );
    return rows.length > 0;
  },

  // Get like count for a post
  async getCount(pid) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM PostLike WHERE pid = ?',
      [pid]
    );
    return rows[0].count;
  },

  // Get users who liked a post
  async getLikers(pid, limit = 20, offset = 0) {
    const [rows] = await db.query(`
      SELECT u.uid, u.username, u.name, u.profile_picture
      FROM PostLike pl
      JOIN User u ON pl.uid = u.uid
      WHERE pl.pid = ?
      ORDER BY pl.created_at DESC
      LIMIT ? OFFSET ?
    `, [pid, limit, offset]);
    return rows;
  }
};

module.exports = Like;
