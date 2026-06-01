const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { 
  getMyProfile, 
  getUserById, 
  updateProfile, 
  deleteAccount,
  getIncomingPairRequests,
  getOutgoingPairRequests,
  handlePairRequest,
  cancelPairRequest
} = require('../controllers/user.controller');

const router = express.Router();

// GET /users/me
router.get('/me', authenticateToken, getMyProfile);

// GET /users/:id
router.get('/:id', authenticateToken, getUserById);

// PUT /users/:id
router.put('/:id', authenticateToken, updateProfile);

// DELETE /users/:id
router.delete('/:id', authenticateToken, deleteAccount);

// Pair request routes
router.get('/pair-requests/incoming', authenticateToken, getIncomingPairRequests);
router.get('/pair-requests/outgoing', authenticateToken, getOutgoingPairRequests);
router.post('/pair-requests/:requestId/:action', authenticateToken, handlePairRequest);
router.delete('/pair-requests/:requestId', authenticateToken, cancelPairRequest);

module.exports = router;