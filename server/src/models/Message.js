const db = require('../config/database');

const Message = {
  // Send a message
  async send(fromUid, toUid, contents) {
    const [result] = await db.execute(
      'INSERT INTO Message (from_uid, to_uid, contents) VALUES (?, ?, ?)',
      [fromUid, toUid, contents]
    );
    return result.insertId;
  },

  // Get messages between two users
  async getConversation(uid1, uid2, limit = 50, offset = 0) {
    const [rows] = await db.execute(`
      SELECT m.*,
             sender.username as from_username, sender.name as from_name, sender.profile_picture as from_picture,
             receiver.username as to_username, receiver.name as to_name
      FROM Message m
      JOIN User sender ON m.from_uid = sender.uid
      JOIN User receiver ON m.to_uid = receiver.uid
      WHERE (m.from_uid = ? AND m.to_uid = ?) OR (m.from_uid = ? AND m.to_uid = ?)
      ORDER BY m.post_time ASC
      LIMIT ? OFFSET ?
    `, [uid1, uid2, uid2, uid1, limit, offset]);
    return rows;
  },

  // Get list of conversations for a user
  async getConversations(uid) {
    const [rows] = await db.execute(`
      SELECT
        CASE WHEN m.from_uid = ? THEN m.to_uid ELSE m.from_uid END as other_uid,
        u.username, u.name, u.profile_picture,
        m.contents as last_message,
        m.post_time as last_message_time,
        (SELECT COUNT(*) FROM Message
         WHERE to_uid = ? AND from_uid = u.uid AND is_read = 0) as unread_count
      FROM Message m
      JOIN User u ON u.uid = CASE WHEN m.from_uid = ? THEN m.to_uid ELSE m.from_uid END
      WHERE m.mid IN (
        SELECT MAX(mid) FROM Message
        WHERE from_uid = ? OR to_uid = ?
        GROUP BY CASE WHEN from_uid = ? THEN to_uid ELSE from_uid END
      )
      ORDER BY m.post_time DESC
    `, [uid, uid, uid, uid, uid, uid]);
    return rows;
  },

  // Mark messages as read
  async markAsRead(fromUid, toUid) {
    await db.execute(
      'UPDATE Message SET is_read = 1 WHERE from_uid = ? AND to_uid = ? AND is_read = 0',
      [fromUid, toUid]
    );
  },

  // Get unread count
  async getUnreadCount(uid) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as count FROM Message WHERE to_uid = ? AND is_read = 0',
      [uid]
    );
    return rows[0].count;
  }
};

module.exports = Message;
