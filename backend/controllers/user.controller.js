const pool = require('../db');

// Get current user profile (same as auth.getMe but in user controller)
const getMyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, name, age, gender, relationship_status, 
              profile_picture, created_at, updated_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user by ID (public profile)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, username, name, age, gender, relationship_status, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only update their own profile
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile'
      });
    }

    const { name, age, gender, relationship_status, profile_picture } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           age = COALESCE($2, age),
           gender = COALESCE($3, gender),
           relationship_status = COALESCE($4, relationship_status),
           profile_picture = COALESCE($5, profile_picture),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, username, email, name, age, gender, relationship_status, profile_picture, updated_at`,
      [name, age, gender, relationship_status, profile_picture, id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user can only delete their own account
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own account'
      });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get incoming pair requests
const getIncomingPairRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT pr.*, u.name as requester_name 
       FROM pair_requests pr
       JOIN users u ON pr.requester_id = u.id
       WHERE pr.receiver_id = $1 AND pr.status = 'pending'
       ORDER BY pr.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get incoming pair requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get outgoing pair requests
const getOutgoingPairRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT pr.*, u.name as receiver_name 
       FROM pair_requests pr
       LEFT JOIN users u ON pr.receiver_id = u.id
       WHERE pr.requester_id = $1
       ORDER BY pr.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get outgoing pair requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Accept or reject pair request
const handlePairRequest = async (req, res) => {
  try {
    const { requestId, action } = req.params;
    const userId = req.user.id;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be accept or reject'
      });
    }

    // Verify the request exists and belongs to this user
    const requestResult = await pool.query(
      'SELECT * FROM pair_requests WHERE id = $1 AND receiver_id = $2 AND status = $3',
      [requestId, userId, 'pending']
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pair request not found'
      });
    }

    const request = requestResult.rows[0];

    // Update request status
    await pool.query(
      'UPDATE pair_requests SET status = $1, responded_at = CURRENT_TIMESTAMP WHERE id = $2',
      [action === 'accept' ? 'accepted' : 'rejected', requestId]
    );

    // If accepted, create couple connection
    if (action === 'accept') {
      await pool.query(
        'INSERT INTO couples (partner_a_id, partner_b_id) VALUES ($1, $2)',
        [request.requester_id, userId]
      );

      // Create notifications
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
        [
          request.requester_id,
          'Pair Request Accepted!',
          `${req.user.name} accepted your pair request. You are now connected!`,
          'pair_accepted'
        ]
      );
    }

    res.json({
      success: true,
      message: `Pair request ${action}ed successfully`
    });
  } catch (error) {
    console.error('Handle pair request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Cancel outgoing pair request
const cancelPairRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Verify the request exists and belongs to this user
    const result = await pool.query(
      'DELETE FROM pair_requests WHERE id = $1 AND requester_id = $2 AND status = $3 RETURNING *',
      [requestId, userId, 'pending']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pair request not found or cannot be cancelled'
      });
    }

    res.json({
      success: true,
      message: 'Pair request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel pair request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getMyProfile,
  getUserById,
  updateProfile,
  deleteAccount,
  getIncomingPairRequests,
  getOutgoingPairRequests,
  handlePairRequest,
  cancelPairRequest
};