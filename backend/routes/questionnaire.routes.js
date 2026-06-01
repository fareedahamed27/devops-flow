const express = require('express');
const { validateRequest, answerSchema } = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const { startQuestionnaire, saveAnswer, completeQuestionnaire } = require('../controllers/questionnaire.controller');

const router = express.Router();

// POST /questionnaire/start
router.post('/start', authenticateToken, startQuestionnaire);

// POST /questionnaire/:sessionId/answer
router.post('/:sessionId/answer', authenticateToken, validateRequest(answerSchema), saveAnswer);

// POST /questionnaire/:sessionId/complete
router.post('/:sessionId/complete', authenticateToken, completeQuestionnaire);

module.exports = router;