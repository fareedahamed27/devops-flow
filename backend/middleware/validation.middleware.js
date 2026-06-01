const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(18).max(100).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  relationship_status: Joi.string().valid('dating', 'married', 'separated').required(),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(), // email or username
  password: Joi.string().required()
});


const answerSchema = Joi.object({
  question_id: Joi.number().integer().required(),
  answer_text: Joi.string().allow('', null).optional(),
  selected_option_id: Joi.number().integer().allow(null).optional()
});
const pairRequestSchema = Joi.object({
  identifier: Joi.string().required() // username, email, or phone
});

module.exports = {
  validateRequest,
  registerSchema,
  loginSchema,
  answerSchema,
  pairRequestSchema
};