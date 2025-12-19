const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create a new user
  async create(userData) {
    const { username, email, password, name } = userData;
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO User (username, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, name || username]
    );

    return result.insertId;
  },

  // Find user by ID
  async findById(uid) {
    const [rows] = await db.execute(
      'SELECT uid, username, email, name, profile_picture, profile_bio, created_at FROM User WHERE uid = ?',
      [uid]
    );
    return rows[0];
  },

  // Find user by username
  async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM User WHERE username = ?',
      [username]
    );
    return rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Update user profile
  async updateProfile(uid, updates) {
    const { name, profile_bio } = updates;
    await db.execute(
      'UPDATE User SET name = ?, profile_bio = ? WHERE uid = ?',
      [name, profile_bio, uid]
    );
  },

  // Update profile picture
  async updateProfilePicture(uid, picturePath) {
    await db.execute(
      'UPDATE User SET profile_picture = ? WHERE uid = ?',
      [picturePath, uid]
    );
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Search users
  async search(term, searchBy = 'username') {
    let query;
    const searchTerm = `%${term}%`;

    switch (searchBy) {
      case 'name':
        query = 'SELECT uid, username, name, profile_picture FROM User WHERE name LIKE ?';
        break;
      case 'gym':
        query = `
          SELECT DISTINCT u.uid, u.username, u.name, u.profile_picture
          FROM User u
          JOIN MemberOf m ON u.uid = m.uid
          JOIN Gym g ON m.gym_id = g.gym_id
          WHERE g.gym_name LIKE ?
        `;
        break;
      default:
        query = 'SELECT uid, username, name, profile_picture FROM User WHERE username LIKE ?';
    }

    const [rows] = await db.execute(query, [searchTerm]);
    return rows;
  }
};

module.exports = User;
