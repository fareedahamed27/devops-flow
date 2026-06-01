const pool = require('../db');

// Get all questions grouped by category
const getQuestions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        q.id,
        q.question_text,
        q.type,
        q.priority,
        qc.name as category,
        COALESCE(
          json_agg(
            json_build_object(
              'id', qo.id,
              'text', qo.option_text,
              'value', qo.option_value
            )
          ) FILTER (WHERE qo.id IS NOT NULL), 
          '[]'
        ) as options
      FROM questions q
      JOIN question_categories qc ON q.category_id = qc.id
      LEFT JOIN question_options qo ON q.id = qo.question_id
      GROUP BY q.id, q.question_text, q.type, q.priority, qc.name
      ORDER BY q.priority ASC
    `);

    // Group questions by category
    const questionsByCategory = {};
    result.rows.forEach(question => {
      if (!questionsByCategory[question.category]) {
        questionsByCategory[question.category] = [];
      }
      questionsByCategory[question.category].push({
        id: question.id,
        text: question.question_text,
        type: question.type,
        category: question.category,
        options: question.options.filter(opt => opt.id !== null).map(opt => opt.text)
      });
    });

    res.json({
      success: true,
      data: questionsByCategory
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getQuestions
};