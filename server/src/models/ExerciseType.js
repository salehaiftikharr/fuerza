const db = require('../config/database');

const ExerciseType = {
  // Get all exercise types
  async getAll() {
    const [rows] = await db.execute(
      'SELECT exercise_type_id, name, muscle_group FROM ExerciseType ORDER BY muscle_group, name'
    );
    return rows;
  },

  // Get by ID
  async getById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM ExerciseType WHERE exercise_type_id = ?',
      [id]
    );
    return rows[0];
  },

  // Get by muscle group
  async getByMuscleGroup(muscleGroup) {
    const [rows] = await db.execute(
      'SELECT * FROM ExerciseType WHERE muscle_group = ? ORDER BY name',
      [muscleGroup]
    );
    return rows;
  }
};

module.exports = ExerciseType;
