const db = require('../config/database');

const Comment = {
  // Create a comment
  async create(pid, uid, content) {
    const [result] = await db.execute(
      'INSERT INTO Comment (pid, uid, content) VALUES (?, ?, ?)',
      [pid, uid, content]
    );
    return result.insertId;
  },

  // Delete a comment (only by owner)
  async delete(commentId, uid) {
    const [result] = await db.execute(
      'DELETE FROM Comment WHERE comment_id = ? AND uid = ?',
      [commentId, uid]
    );
    return result.affectedRows > 0;
  },

  // Get comments for a post
  async getByPost(pid, limit = 50, offset = 0) {
    const [rows] = await db.query(`
      SELECT c.comment_id, c.content, c.created_at,
             u.uid, u.username, u.name, u.profile_picture
      FROM Comment c
      JOIN User u ON c.uid = u.uid
      WHERE c.pid = ?
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `, [pid, limit, offset]);
    return rows;
  },

  // Get comment count for a post
  async getCount(pid) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM Comment WHERE pid = ?',
      [pid]
    );
    return rows[0].count;
  },

  // Get a single comment by ID
  async getById(commentId) {
    const [rows] = await db.execute(
      'SELECT * FROM Comment WHERE comment_id = ?',
      [commentId]
    );
    return rows[0];
  }
};

module.exports = Comment;
