const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all exercise types
router.get('/types', exerciseController.getTypes);

module.exports = router;
