const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const emailService = require('../services/emailService');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, name, age, gender, relationship_status, phone } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, name, age, gender, relationship_status, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, username, email, name, age, gender, relationship_status`,
      [username, email, password_hash, name, age, gender, relationship_status, phone]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          age: user.age,
          gender: user.gender,
          relationshipStatus: user.relationship_status,
          questionnaireTaken: false,
          reportGenerated: false
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or username
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check questionnaire and report status
    const sessionResult = await pool.query(
      'SELECT id, status FROM user_questionnaire_sessions WHERE user_id = $1  LIMIT 1',
      [user.id]
    );

    const questionnaireTaken = sessionResult.rows.length > 0 && sessionResult.rows[0].status === 'completed';

    const reportResult = await pool.query(
      'SELECT id FROM ai_reports WHERE user_id = $1 LIMIT 1',
      [user.id]
    );

    const reportGenerated = reportResult.rows.length > 0;

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          age: user.age,
          gender: user.gender,
          relationshipStatus: user.relationship_status,
          questionnaireTaken,
          reportGenerated
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, name, age, gender, relationship_status
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    // Check if user has completed questionnaire
    const sessionResult = await pool.query(
      'SELECT id, status FROM user_questionnaire_sessions WHERE user_id = $1  LIMIT 1',
      [req.user.id]
    );

    const questionnaireTaken = sessionResult.rows.length > 0 && sessionResult.rows[0].status === 'completed';

    // Check if AI report exists
    const reportResult = await pool.query(
      'SELECT id FROM ai_reports WHERE user_id = $1 LIMIT 1',
      [req.user.id]
    );

    const reportGenerated = reportResult.rows.length > 0;

    res.json({
      success: true,
      data: {
        ...user,
        relationshipStatus: user.relationship_status,
        questionnaireTaken,
        reportGenerated
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};