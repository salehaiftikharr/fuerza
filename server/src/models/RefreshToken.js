const db = require('../config/database');

const RefreshToken = {
  // Create a refresh token
  async create(uid, token, expiresAt) {
    await db.execute(
      'INSERT INTO RefreshToken (uid, token, expires_at) VALUES (?, ?, ?)',
      [uid, token, expiresAt]
    );
  },

  // Find token
  async findByToken(token) {
    const [rows] = await db.execute(
      'SELECT * FROM RefreshToken WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    return rows[0];
  },

  // Delete token
  async delete(token) {
    await db.execute('DELETE FROM RefreshToken WHERE token = ?', [token]);
  },

  // Delete all tokens for user
  async deleteAllForUser(uid) {
    await db.execute('DELETE FROM RefreshToken WHERE uid = ?', [uid]);
  },

  // Clean expired tokens
  async cleanExpired() {
    await db.execute('DELETE FROM RefreshToken WHERE expires_at <= NOW()');
  }
};

module.exports = RefreshToken;
