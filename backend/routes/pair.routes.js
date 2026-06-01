const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { 
  generatePairId, 
  connectWithPairId, 
  getPairStatus, 
  disconnectPartner 
} = require('../controllers/pair.controller');

const router = express.Router();

// POST /pair/generate-id
router.post('/pair/generate-id', authenticateToken, generatePairId);

// POST /pair/connect
router.post('/pair/connect', authenticateToken, connectWithPairId);

// GET /pair/status
router.get('/pair/status', authenticateToken, getPairStatus);

// POST /pair/disconnect
router.post('/pair/disconnect', authenticateToken, disconnectPartner);

module.exports = router;