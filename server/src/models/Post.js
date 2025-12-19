const db = require('../config/database');

const Post = {
  // Create a post with workout and exercises (transaction)
  async create(uid, postData) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const { caption, isPrivate, exercises } = postData;
      const date = new Date().toISOString().split('T')[0];

      // Create workout
      const [workoutResult] = await connection.execute(
        'INSERT INTO Workout (uid, date) VALUES (?, ?)',
        [uid, date]
      );
      const wid = workoutResult.insertId;

      // Create post
      const [postResult] = await connection.execute(
        'INSERT INTO Post (uid, wid, caption, is_private, date) VALUES (?, ?, ?, ?, ?)',
        [uid, wid, caption || '', isPrivate ? 1 : 0, date]
      );
      const pid = postResult.insertId;

      // Create exercises with rep schemes
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];

        // Create rep scheme
        const [repResult] = await connection.execute(
          'INSERT INTO RepScheme (reps, sets, weights, rest_time) VALUES (?, ?, ?, ?)',
          [ex.reps, ex.sets, ex.weight, ex.restTime]
        );

        // Create exercise
        await connection.execute(
          'INSERT INTO Exercise (wid, rid, exercise_type_id, exercise_order) VALUES (?, ?, ?, ?)',
          [wid, repResult.insertId, ex.exerciseTypeId, i + 1]
        );
      }

      await connection.commit();
      return pid;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get single post with exercises
  async getById(pid) {
    const [posts] = await db.execute(`
      SELECT p.*, u.username, u.name, u.profile_picture,
             w.date as workout_date
      FROM Post p
      JOIN User u ON p.uid = u.uid
      JOIN Workout w ON p.wid = w.wid
      WHERE p.pid = ?
    `, [pid]);

    if (posts.length === 0) return null;

    const post = posts[0];
    post.exercises = await this.getExercises(post.wid);
    return post;
  },

  // Get exercises for a workout
  async getExercises(wid) {
    const [rows] = await db.execute(`
      SELECT e.exercise_order, et.name as exercise_name, et.muscle_group,
             r.reps, r.sets, r.weights, r.rest_time
      FROM Exercise e
      JOIN ExerciseType et ON e.exercise_type_id = et.exercise_type_id
      JOIN RepScheme r ON e.rid = r.rid
      WHERE e.wid = ?
      ORDER BY e.exercise_order
    `, [wid]);
    return rows;
  },

  // Delete post
  async delete(pid, uid) {
    const [result] = await db.execute(
      'DELETE FROM Post WHERE pid = ? AND uid = ?',
      [pid, uid]
    );
    return result.affectedRows > 0;
  },

  // Get feed (posts from followed users)
  async getFeed(uid, limit = 20, offset = 0) {
    const [rows] = await db.execute(`
      SELECT p.*, u.username, u.name, u.profile_picture
      FROM Post p
      JOIN User u ON p.uid = u.uid
      JOIN Follows f ON p.uid = f.following_uid
      WHERE f.follower_uid = ? AND p.is_private = 0
      ORDER BY p.post_time DESC
      LIMIT ? OFFSET ?
    `, [uid, limit, offset]);

    // Get exercises for each post
    for (const post of rows) {
      post.exercises = await this.getExercises(post.wid);
    }
    return rows;
  },

  // Get explore (all public posts)
  async getExplore(limit = 20, offset = 0) {
    const [rows] = await db.execute(`
      SELECT p.*, u.username, u.name, u.profile_picture
      FROM Post p
      JOIN User u ON p.uid = u.uid
      WHERE p.is_private = 0
      ORDER BY p.post_time DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    // Get exercises for each post
    for (const post of rows) {
      post.exercises = await this.getExercises(post.wid);
    }
    return rows;
  },

  // Get user's posts
  async getByUser(uid, viewerUid, limit = 20, offset = 0) {
    // If viewing own profile, show all posts; otherwise only public
    const privateFilter = uid === viewerUid ? '' : 'AND p.is_private = 0';

    const [rows] = await db.execute(`
      SELECT p.*, u.username, u.name, u.profile_picture
      FROM Post p
      JOIN User u ON p.uid = u.uid
      WHERE p.uid = ? ${privateFilter}
      ORDER BY p.post_time DESC
      LIMIT ? OFFSET ?
    `, [uid, limit, offset]);

    // Get exercises for each post
    for (const post of rows) {
      post.exercises = await this.getExercises(post.wid);
    }
    return rows;
  }
};

module.exports = Post;
