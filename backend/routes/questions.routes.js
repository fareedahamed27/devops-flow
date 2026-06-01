const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { getQuestions } = require('../controllers/questions.controller');

const router = express.Router();

// GET /questions
router.get('/', authenticateToken, getQuestions);

module.exports = router;