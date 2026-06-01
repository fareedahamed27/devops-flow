-- Seed questions based on the frontend questions data
INSERT INTO questions (category_id, question_text, type, priority) VALUES
-- Communication Questions
((SELECT id FROM question_categories WHERE name = 'communication'), 'How often do you feel truly heard by your partner?', 'scale', 1),
((SELECT id FROM question_categories WHERE name = 'communication'), 'Describe a recent moment when you felt misunderstood by your partner.', 'text', 2),
((SELECT id FROM question_categories WHERE name = 'communication'), 'When your partner is upset, what is your first reaction?', 'multiple-choice', 3),
((SELECT id FROM question_categories WHERE name = 'communication'), 'What topic do you avoid discussing with your partner?', 'text', 4),
((SELECT id FROM question_categories WHERE name = 'communication'), 'How comfortable are you expressing vulnerability to your partner?', 'scale', 5),

-- Emotional Questions
((SELECT id FROM question_categories WHERE name = 'emotional'), 'What emotion do you experience most often in your relationship?', 'multiple-choice', 6),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'Describe your biggest fear about your relationship.', 'text', 7),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'How often do you feel emotionally connected to your partner?', 'scale', 8),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'What makes you feel most loved by your partner?', 'text', 9),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'When you''re stressed, do you turn toward or away from your partner?', 'multiple-choice', 10),

-- Trust Questions
((SELECT id FROM question_categories WHERE name = 'trust'), 'How much do you trust your partner with your deepest secrets?', 'scale', 11),
((SELECT id FROM question_categories WHERE name = 'trust'), 'What would be the hardest thing for you to forgive?', 'text', 12),
((SELECT id FROM question_categories WHERE name = 'trust'), 'Do you feel your partner is completely honest with you?', 'multiple-choice', 13),
((SELECT id FROM question_categories WHERE name = 'trust'), 'How do you handle situations where you disagree with your partner''s choices?', 'text', 14),
((SELECT id FROM question_categories WHERE name = 'trust'), 'Rate your confidence in your relationship''s future.', 'scale', 15),

-- Intimacy Questions
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'How satisfied are you with the level of physical intimacy in your relationship?', 'scale', 16),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'What makes you feel closest to your partner?', 'text', 17),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'How often do you and your partner have quality time together?', 'multiple-choice', 18),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'Describe a perfect evening with your partner.', 'text', 19),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'How comfortable are you discussing your needs with your partner?', 'scale', 20),

-- Conflict Questions
((SELECT id FROM question_categories WHERE name = 'conflict'), 'How do you typically handle disagreements?', 'multiple-choice', 21),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'What causes the most tension in your relationship?', 'text', 22),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'How quickly do you and your partner resolve conflicts?', 'scale', 23),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'What do you wish your partner understood about you during arguments?', 'text', 24),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'Do you feel your relationship has more harmony or conflict?', 'multiple-choice', 25),

-- Future Questions
((SELECT id FROM question_categories WHERE name = 'future'), 'Where do you see your relationship in 5 years?', 'text', 26),
((SELECT id FROM question_categories WHERE name = 'future'), 'How aligned are you and your partner on major life goals?', 'scale', 27),
((SELECT id FROM question_categories WHERE name = 'future'), 'What is your biggest hope for your relationship?', 'text', 28),
((SELECT id FROM question_categories WHERE name = 'future'), 'If you could change one thing about your relationship, what would it be?', 'text', 29),
((SELECT id FROM question_categories WHERE name = 'future'), 'How committed are you to working on your relationship?', 'scale', 30);

-- Insert multiple choice options
INSERT INTO question_options (question_id, option_text, option_value) VALUES
-- Question 3 options
((SELECT id FROM questions WHERE question_text LIKE 'When your partner is upset%'), 'Try to fix the problem', 'fix'),
((SELECT id FROM questions WHERE question_text LIKE 'When your partner is upset%'), 'Give them space', 'space'),
((SELECT id FROM questions WHERE question_text LIKE 'When your partner is upset%'), 'Ask what''s wrong', 'ask'),
((SELECT id FROM questions WHERE question_text LIKE 'When your partner is upset%'), 'Feel defensive', 'defensive'),

-- Question 6 options
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you experience%'), 'Joy', 'joy'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you experience%'), 'Anxiety', 'anxiety'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you experience%'), 'Contentment', 'contentment'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you experience%'), 'Frustration', 'frustration'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you experience%'), 'Love', 'love'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you experience%'), 'Loneliness', 'loneliness'),

-- Question 10 options
((SELECT id FROM questions WHERE question_text LIKE 'When you''re stressed%'), 'Always toward them', 'always_toward'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re stressed%'), 'Usually toward them', 'usually_toward'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re stressed%'), 'It depends', 'depends'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re stressed%'), 'Usually away', 'usually_away'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re stressed%'), 'Always away', 'always_away'),

-- Question 13 options
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your partner is completely honest%'), 'Always', 'always'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your partner is completely honest%'), 'Usually', 'usually'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your partner is completely honest%'), 'Sometimes', 'sometimes'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your partner is completely honest%'), 'Rarely', 'rarely'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your partner is completely honest%'), 'Never', 'never'),

-- Question 18 options
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have quality time%'), 'Daily', 'daily'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have quality time%'), 'Several times a week', 'several_weekly'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have quality time%'), 'Weekly', 'weekly'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have quality time%'), 'Monthly', 'monthly'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have quality time%'), 'Rarely', 'rarely'),

-- Question 21 options
((SELECT id FROM questions WHERE question_text LIKE 'How do you typically handle disagreements%'), 'Discuss calmly', 'discuss_calmly'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you typically handle disagreements%'), 'Avoid the topic', 'avoid'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you typically handle disagreements%'), 'Get emotional', 'emotional'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you typically handle disagreements%'), 'Compromise quickly', 'compromise'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you typically handle disagreements%'), 'Stand my ground', 'stand_ground'),

-- Question 25 options
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your relationship has more harmony%'), 'Mostly harmony', 'mostly_harmony'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your relationship has more harmony%'), 'More harmony than conflict', 'more_harmony'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your relationship has more harmony%'), 'Equal', 'equal'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your relationship has more harmony%'), 'More conflict than harmony', 'more_conflict'),
((SELECT id FROM questions WHERE question_text LIKE 'Do you feel your relationship has more harmony%'), 'Mostly conflict', 'mostly_conflict');