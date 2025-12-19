const ExerciseType = require('../models/ExerciseType');

exports.getTypes = async (req, res) => {
  try {
    const types = await ExerciseType.getAll();

    // Group by muscle group for easier frontend consumption
    const grouped = types.reduce((acc, type) => {
      const group = type.muscle_group || 'Other';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push({
        id: type.exercise_type_id,
        name: type.name
      });
      return acc;
    }, {});

    res.json({
      all: types,
      byMuscleGroup: grouped
    });
  } catch (error) {
    console.error('Get exercise types error:', error);
    res.status(500).json({ message: 'Error getting exercise types' });
  }
};
