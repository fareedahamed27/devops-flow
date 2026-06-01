const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { generateReport, getReport, generateCoupleReport, getCoupleReport } = require('../controllers/ai.controller');

const router = express.Router();

// POST /ai/generate-report/:sessionId
router.post('/generate-report/:sessionId', authenticateToken, generateReport);

// GET /ai/report
router.get('/report', authenticateToken, getReport);

// POST /ai/generate-couple-report
router.post('/generate-couple-report', authenticateToken, generateCoupleReport);

// GET /ai/couple-report
router.get('/couple-report', authenticateToken, getCoupleReport);

module.exports = router;