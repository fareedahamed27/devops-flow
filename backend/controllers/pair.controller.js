// const pool = require('../db');
// const emailService = require('../services/emailService');

// // Generate a unique 5-digit pair ID
// const generatePairId = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Check if user already has a pair ID
//     const existingResult = await pool.query(
//       'SELECT pair_id FROM user_pair_ids WHERE user_id = $1',
//       [userId]
//     );

//     if (existingResult.rows.length > 0) {
//       return res.json({
//         success: true,
//         data: {
//           pairId: existingResult.rows[0].pair_id,
//           isConnected: false
//         }
//       });
//     }

//     // Generate unique 5-digit ID
//     let pairId;
//     let isUnique = false;
    
//     while (!isUnique) {
//       pairId = Math.random().toString(36).substring(2, 7).toUpperCase();
//       const checkResult = await pool.query(
//         'SELECT id FROM user_pair_ids WHERE pair_id = $1',
//         [pairId]
//       );
//       isUnique = checkResult.rows.length === 0;
//     }

//     // Store the pair ID
//     await pool.query(
//       'INSERT INTO user_pair_ids (user_id, pair_id) VALUES ($1, $2)',
//       [userId, pairId]
//     );

//     // Send notification email to user about pair ID generation
//     try {
//       await emailService.sendPairIdGeneratedEmail(req.user.email, req.user.name, pairId);
//     } catch (emailError) {
//       console.error('Failed to send pair ID email:', emailError);
//     }

//     res.json({
//       success: true,
//       message: 'Pair ID generated successfully',
//       data: {
//         pairId,
//         isConnected: false
//       }
//     });
//   } catch (error) {
//     console.error('Generate pair ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // Connect with a partner using their pair ID
// const connectWithPairId = async (req, res) => {
//   try {
//     const { pairId } = req.body;
//     const userId = req.user.id;

//     if (!pairId || pairId.length !== 5) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide a valid 5-digit Pair ID'
//       });
//     }

//     // Find the partner by pair ID
//     const partnerResult = await pool.query(
//       `SELECT upi.user_id, u.name, u.email 
//        FROM user_pair_ids upi
//        JOIN users u ON upi.user_id = u.id
//        WHERE upi.pair_id = $1 AND upi.user_id != $2`,
//       [pairId.toUpperCase(), userId]
//     );

//     if (partnerResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Pair ID not found or belongs to you'
//       });
//     }

//     const partner = partnerResult.rows[0];

//     // Check if already connected
//     const existingCouple = await pool.query(
//       'SELECT id FROM couples WHERE (partner_a_id = $1 AND partner_b_id = $2) OR (partner_a_id = $2 AND partner_b_id = $1)',
//       [userId, partner.user_id]
//     );

//     if (existingCouple.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'You are already connected with this partner'
//       });
//     }

//     // Create couple connection
//     const coupleResult = await pool.query(
//       'INSERT INTO couples (partner_a_id, partner_b_id) VALUES ($1, $2) RETURNING id, paired_at',
//       [userId, partner.user_id]
//     );

//     // Create notifications for both users
//     await pool.query(
//       'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
//       [
//         partner.user_id,
//         'New Partner Connection!',
//         `${req.user.name || req.user.username} connected with you using your Pair ID`,
//         'pair_connected'
//       ]
//     );

//     await pool.query(
//       'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
//       [
//         userId,
//         'Successfully Connected!',
//         `You are now connected with ${partner.name}! Explore your relationship insights together.`,
//         'pair_success'
//       ]
//     );

//     // Send pairing confirmation emails to both users
//     try {
//       await emailService.sendPairingSuccessEmail(req.user.email, req.user.name, partner.name);
//       await emailService.sendPairingSuccessEmail(partner.email, partner.name, req.user.name);
//     } catch (emailError) {
//       console.error('Failed to send pairing emails:', emailError);
//     }

//     res.json({
//       success: true,
//       message: 'Successfully connected with your partner!',
//       data: {
//         coupleId: coupleResult.rows[0].id,
//         isConnected: true,
//         partnerName: partner.name,
//         partnerEmail: partner.email,
//         pairedAt: coupleResult.rows[0].paired_at
//       }
//     });
//   } catch (error) {
//     console.error('Connect with pair ID error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // Get user's pair status
// const getPairStatus = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Get user's pair ID
//     const pairIdResult = await pool.query(
//       'SELECT pair_id FROM user_pair_ids WHERE user_id = $1',
//       [userId]
//     );

//     // Check if connected to a partner
//     const coupleResult = await pool.query(
//       `SELECT c.id, c.paired_at,
//               CASE 
//                 WHEN c.partner_a_id = $1 THEN u2.name
//                 ELSE u1.name
//               END as partner_name,
//               CASE 
//                 WHEN c.partner_a_id = $1 THEN u2.email
//                 ELSE u1.email
//               END as partner_email,
//               CASE 
//                 WHEN c.partner_a_id = $1 THEN u2.id
//                 ELSE u1.id
//               END as partner_id
//        FROM couples c
//        JOIN users u1 ON c.partner_a_id = u1.id
//        JOIN users u2 ON c.partner_b_id = u2.id
//        WHERE c.partner_a_id = $1 OR c.partner_b_id = $1`,
//       [userId]
//     );

//     const isConnected = coupleResult.rows.length > 0;
//     const pairId = pairIdResult.rows.length > 0 ? pairIdResult.rows[0].pair_id : '';

//     let partnerQuestionnaireTaken = false;
//     if (isConnected) {
//       const partnerId = coupleResult.rows[0].partner_id;
      
//       // Check if partner has completed questionnaire
//       const partnerSessionResult = await pool.query(
//         'SELECT id FROM user_questionnaire_sessions WHERE user_id = $1 AND status = $2',
//         [partnerId, 'completed']
//       );
      
//       partnerQuestionnaireTaken = partnerSessionResult.rows.length > 0;
//     }

//     res.json({
//       success: true,
//       data: {
//         pairId,
//         isConnected,
//         partnerName: isConnected ? coupleResult.rows[0].partner_name : null,
//         partnerEmail: isConnected ? coupleResult.rows[0].partner_email : null,
//         pairedAt: isConnected ? coupleResult.rows[0].paired_at : null,
//         partnerQuestionnaireTaken
//       }
//     });
//   } catch (error) {
//     console.error('Get pair status error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // Disconnect from partner
// const disconnectPartner = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Find and delete couple connection
//     const result = await pool.query(
//       'DELETE FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1 RETURNING *',
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No partner connection found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Successfully disconnected from partner'
//     });
//   } catch (error) {
//     console.error('Disconnect partner error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// module.exports = {
//   generatePairId,
//   connectWithPairId,
//   getPairStatus,
//   disconnectPartner
// };
const pool = require('../db');
const emailService = require('../services/emailService');

// Generate a unique 5-digit pair ID
const generatePairId = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has a pair ID
    const existingResult = await pool.query(
      'SELECT pair_id FROM user_pair_ids WHERE user_id = $1',
      [userId]
    );

    if (existingResult.rows.length > 0) {
      return res.json({
        success: true,
        data: {
          pairId: existingResult.rows[0].pair_id,
          isConnected: false
        }
      });
    }

    // Generate unique 5-digit ID
    let pairId;
    let isUnique = false;
    
    while (!isUnique) {
      pairId = Math.random().toString(36).substring(2, 7).toUpperCase();
      const checkResult = await pool.query(
        'SELECT id FROM user_pair_ids WHERE pair_id = $1',
        [pairId]
      );
      isUnique = checkResult.rows.length === 0;
    }

    // Store the pair ID
    await pool.query(
      'INSERT INTO user_pair_ids (user_id, pair_id) VALUES ($1, $2)',
      [userId, pairId]
    );

    // Send notification email to user about pair ID generation
    try {
      await emailService.sendPairIdGeneratedEmail(req.user.email, req.user.name, pairId);
    } catch (emailError) {
      console.error('Failed to send pair ID email:', emailError);
    }

    res.json({
      success: true,
      message: 'Pair ID generated successfully',
      data: {
        pairId,
        isConnected: false
      }
    });
  } catch (error) {
    console.error('Generate pair ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Connect with a partner using their pair ID
const connectWithPairId = async (req, res) => {
  try {
    const { pairId } = req.body;
    const userId = req.user.id;

    if (!pairId || pairId.length !== 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 5-digit Pair ID'
      });
    }

    // Find the partner by pair ID
    const partnerResult = await pool.query(
      `SELECT upi.user_id, u.name, u.email 
       FROM user_pair_ids upi
       JOIN users u ON upi.user_id = u.id
       WHERE upi.pair_id = $1 AND upi.user_id != $2`,
      [pairId.toUpperCase(), userId]
    );

    if (partnerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pair ID not found or belongs to you'
      });
    }

    const partner = partnerResult.rows[0];

    // Check if already connected
    const existingCouple = await pool.query(
      'SELECT id FROM couples WHERE (partner_a_id = $1 AND partner_b_id = $2) OR (partner_a_id = $2 AND partner_b_id = $1)',
      [userId, partner.user_id]
    );

    if (existingCouple.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already connected with this partner'
      });
    }

    // Create couple connection
    const coupleResult = await pool.query(
      'INSERT INTO couples (partner_a_id, partner_b_id) VALUES ($1, $2) RETURNING id, paired_at',
      [userId, partner.user_id]
    );

    // Create notifications for both users
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [
        partner.user_id,
        'New Partner Connection!',
        `${req.user.name || req.user.username} connected with you using your Pair ID`,
        'pair_connected'
      ]
    );

    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
      [
        userId,
        'Successfully Connected!',
        `You are now connected with ${partner.name}! Explore your relationship insights together.`,
        'pair_success'
      ]
    );

    // Send pairing confirmation emails to both users
    try {
      await emailService.sendPairingSuccessEmail(req.user.email, req.user.name, partner.name);
      await emailService.sendPairingSuccessEmail(partner.email, partner.name, req.user.name);
    } catch (emailError) {
      console.error('Failed to send pairing emails:', emailError);
    }

    res.json({
      success: true,
      message: 'Successfully connected with your partner!',
      data: {
        coupleId: coupleResult.rows[0].id,
        isConnected: true,
        partnerName: partner.name,
        partnerEmail: partner.email,
        pairedAt: coupleResult.rows[0].paired_at
      }
    });
  } catch (error) {
    console.error('Connect with pair ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's pair status with detailed partner information
const getPairStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's pair ID
    const pairIdResult = await pool.query(
      'SELECT pair_id FROM user_pair_ids WHERE user_id = $1',
      [userId]
    );

    // Check if connected to a partner
    const coupleResult = await pool.query(
      `SELECT c.id, c.paired_at,
              CASE 
                WHEN c.partner_a_id = $1 THEN u2.name
                ELSE u1.name
              END as partner_name,
              CASE 
                WHEN c.partner_a_id = $1 THEN u2.email
                ELSE u1.email
              END as partner_email,
              CASE 
                WHEN c.partner_a_id = $1 THEN u2.id
                ELSE u1.id
              END as partner_id
       FROM couples c
       JOIN users u1 ON c.partner_a_id = u1.id
       JOIN users u2 ON c.partner_b_id = u2.id
       WHERE c.partner_a_id = $1 OR c.partner_b_id = $1`,
      [userId]
    );

    const isConnected = coupleResult.rows.length > 0;
    const pairId = pairIdResult.rows.length > 0 ? pairIdResult.rows[0].pair_id : '';

    let partnerQuestionnaireTaken = false;
    let partnerReportGenerated = false;
    
    if (isConnected) {
      const partnerId = coupleResult.rows[0].partner_id;
      
      // Check if partner has completed questionnaire
      const partnerSessionResult = await pool.query(
        'SELECT id FROM user_questionnaire_sessions WHERE user_id = $1 AND status = $2',
        [partnerId, 'completed']
      );
      
      partnerQuestionnaireTaken = partnerSessionResult.rows.length > 0;

      // Check if partner has generated a report
      const partnerReportResult = await pool.query(
        'SELECT id FROM ai_reports WHERE user_id = $1',
        [partnerId]
      );
      
      partnerReportGenerated = partnerReportResult.rows.length > 0;
    }

    res.json({
      success: true,
      data: {
        pairId,
        isConnected,
        partnerName: isConnected ? coupleResult.rows[0].partner_name : null,
        partnerEmail: isConnected ? coupleResult.rows[0].partner_email : null,
        pairedAt: isConnected ? coupleResult.rows[0].paired_at : null,
        partnerQuestionnaireTaken,
        partnerReportGenerated
      }
    });
  } catch (error) {
    console.error('Get pair status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Disconnect from partner
const disconnectPartner = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find and delete couple connection
    const result = await pool.query(
      'DELETE FROM couples WHERE partner_a_id = $1 OR partner_b_id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No partner connection found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully disconnected from partner'
    });
  } catch (error) {
    console.error('Disconnect partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  generatePairId,
  connectWithPairId,
  getPairStatus,
  disconnectPartner
};