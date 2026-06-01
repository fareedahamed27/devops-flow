const pool = require('../db');

// Start a new questionnaire session
const startQuestionnaire = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has an active session
    const existingSession = await pool.query(
      'SELECT id FROM user_questionnaire_sessions WHERE user_id = $1 AND status = $2',
      [userId, 'in_progress']
    );

    if (existingSession.rows.length > 0) {
      return res.json({
        success: true,
        message: 'Existing session found',
        data: {
          sessionId: existingSession.rows[0].id
        }
      });
    }

    // Create new session
    const result = await pool.query(
      'INSERT INTO user_questionnaire_sessions (user_id) VALUES ($1) RETURNING id, started_at',
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'Questionnaire session started',
      data: {
        sessionId: result.rows[0].id,
        startedAt: result.rows[0].started_at
      }
    });
  } catch (error) {
    console.error('Start questionnaire error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Save answer for a question
const saveAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { question_id, answer_text, selected_option_id } = req.body;

    // Verify session belongs to user
    const sessionResult = await pool.query(
      'SELECT id FROM user_questionnaire_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
      [sessionId, req.user.id, 'in_progress']
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or already completed'
      });
    }

    // Check if answer already exists for this question in this session
    const existingAnswer = await pool.query(
      'SELECT id FROM question_responses WHERE session_id = $1 AND question_id = $2',
      [sessionId, question_id]
    );

    let result;
    if (existingAnswer.rows.length > 0) {
      // Update existing answer
      result = await pool.query(
        `UPDATE question_responses 
         SET answer_text = $1, selected_option_id = $2, created_at = CURRENT_TIMESTAMP
         WHERE session_id = $3 AND question_id = $4
         RETURNING id`,
        [answer_text, selected_option_id, sessionId, question_id]
      );
    } else {
      // Insert new answer
      result = await pool.query(
        `INSERT INTO question_responses (session_id, question_id, answer_text, selected_option_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [sessionId, question_id, answer_text, selected_option_id]
      );
    }

    res.json({
      success: true,
      message: 'Answer saved successfully',
      data: {
        responseId: result.rows[0].id
      }
    });
  } catch (error) {
    console.error('Save answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Complete questionnaire session
const completeQuestionnaire = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify session belongs to user
    const sessionResult = await pool.query(
      'SELECT id FROM user_questionnaire_sessions WHERE id = $1 AND user_id = $2 AND status = $3',
      [sessionId, req.user.id, 'in_progress']
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or already completed'
      });
    }

    // Mark session as completed
    await pool.query(
      'UPDATE user_questionnaire_sessions SET status = $1, completed_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['completed', sessionId]
    );

    res.json({
      success: true,
      message: 'Questionnaire completed successfully'
    });
  } catch (error) {
    console.error('Complete questionnaire error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  startQuestionnaire,
  saveAnswer,
  completeQuestionnaire
};