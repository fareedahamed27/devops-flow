-- Add new question categories for Indian cultural context
INSERT INTO question_categories (name, description) VALUES
('family', 'Questions about family influence and cultural expectations'),
('gender_roles', 'Questions about traditional and modern gender role expectations'),
('financial', 'Questions about financial decisions and money management')
ON CONFLICT (name) DO NOTHING;

-- Update existing questions to include new categories and add Indian context questions
-- Note: This would typically be done through the admin interface, but for setup we'll add some key questions

-- Add family influence questions
INSERT INTO questions (category_id, question_text, type, priority) VALUES
((SELECT id FROM question_categories WHERE name = 'family'), 'How much do family opinions and expectations influence your relationship decisions?', 'scale', 41),
((SELECT id FROM question_categories WHERE name = 'family'), 'Describe a situation where family pressure created tension in your relationship. How did you handle it?', 'text', 42),
((SELECT id FROM question_categories WHERE name = 'family'), 'When there''s a conflict between your partner''s wishes and your family''s expectations, what typically happens?', 'multiple-choice', 43),
((SELECT id FROM question_categories WHERE name = 'family'), 'How comfortable are you setting boundaries with family members regarding your relationship?', 'scale', 44),
((SELECT id FROM question_categories WHERE name = 'family'), 'What family tradition or cultural expectation do you struggle with most in your relationship?', 'text', 45);

-- Add gender roles questions
INSERT INTO questions (category_id, question_text, type, priority) VALUES
((SELECT id FROM question_categories WHERE name = 'gender_roles'), 'How do traditional gender roles affect your relationship dynamics?', 'multiple-choice', 46),
((SELECT id FROM question_categories WHERE name = 'gender_roles'), 'Describe a situation where societal expectations about your role (as a man/woman) created pressure in your relationship.', 'text', 47),
((SELECT id FROM question_categories WHERE name = 'gender_roles'), 'How comfortable is your partner with you pursuing your career ambitions?', 'scale', 48);

-- Add financial questions
INSERT INTO questions (category_id, question_text, type, priority) VALUES
((SELECT id FROM question_categories WHERE name = 'financial'), 'How do you and your partner handle financial decisions and money management?', 'multiple-choice', 49),
((SELECT id FROM question_categories WHERE name = 'financial'), 'What financial pressure or expectation (family support, lifestyle, etc.) creates the most stress in your relationship?', 'text', 50);

-- Add options for multiple choice questions
INSERT INTO question_options (question_id, option_text, option_value) VALUES
-- Family conflict question options
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I always side with my family', 'family_first'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I try to balance both but feel torn', 'torn_balance'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I support my partner but feel guilty', 'partner_guilt'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I openly choose my partner over family', 'partner_first'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'We find a compromise that works for everyone', 'compromise'),

-- Gender roles question options
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We follow traditional roles and it works well', 'traditional_works'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We try to balance traditional and modern approaches', 'balanced_approach'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We reject traditional roles completely', 'modern_only'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'It creates constant tension between us', 'creates_tension'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We''re still figuring it out', 'figuring_out'),

-- Financial management question options
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial%'), 'One person controls all finances', 'single_control'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial%'), 'We discuss major purchases but handle day-to-day separately', 'major_discuss'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial%'), 'Everything is completely shared and discussed', 'fully_shared'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial%'), 'We often fight about money', 'money_fights'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial%'), 'We avoid talking about money', 'money_avoidance');