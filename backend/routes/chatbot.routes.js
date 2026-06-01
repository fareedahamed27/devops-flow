//chatbot.routes.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/message', authenticateToken, chatbotController.sendMessage);

module.exports = router;