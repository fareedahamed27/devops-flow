const express = require('express');
const { validateRequest, registerSchema, loginSchema } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const { register, login, getMe } = require('../controllers/auth.controller');

const router = express.Router();

// POST /auth/register
router.post('/register', validateRequest(registerSchema), register);

// POST /auth/login
router.post('/login', validateRequest(loginSchema), login);

// GET /auth/me
router.get('/me', authenticateToken, getMe);

module.exports = router;