-- RelationSync Complete Database Setup
-- Run this file to create the entire database schema from scratch
-- This is designed for local PostgreSQL setup

-- Drop existing tables if they exist (in correct order to avoid foreign key conflicts)
DROP TABLE IF EXISTS user_pair_ids CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS sync_sessions CASCADE;
DROP TABLE IF EXISTS repair_actions CASCADE;
DROP TABLE IF EXISTS relationsync_reflections CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP TABLE IF EXISTS pair_requests CASCADE;
DROP TABLE IF EXISTS ai_reports CASCADE;
DROP TABLE IF EXISTS question_responses CASCADE;
DROP TABLE IF EXISTS user_questionnaire_sessions CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS question_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    name VARCHAR(100),
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    relationship_status VARCHAR(30) CHECK (relationship_status IN ('dating', 'married', 'separated')),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Question categories
CREATE TABLE question_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES question_categories(id),
    question_text TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('text', 'scale', 'multiple-choice')),
    is_tailored BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Question options (for multiple choice questions)
CREATE TABLE question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_value TEXT
);

-- 5. User questionnaire sessions
CREATE TABLE user_questionnaire_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_name VARCHAR(100) DEFAULT 'Initial Assessment',
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 6. Question responses
CREATE TABLE question_responses (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES user_questionnaire_sessions(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    answer_text TEXT,
    selected_option_id INTEGER REFERENCES question_options(id),
    emotional_tag TEXT,
    confidence_score DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. AI reports
CREATE TABLE ai_reports (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES user_questionnaire_sessions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    emotional_summary TEXT,
    emotional_tags TEXT[],
    communication_score INTEGER,
    emotional_burden_score INTEGER,
    love_language_estimate VARCHAR(30),
    report_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. User Pair IDs (for partner connection)
CREATE TABLE user_pair_ids (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pair_id VARCHAR(5) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Pair requests
CREATE TABLE pair_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_identifier VARCHAR(100), -- email, phone, or username
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);

-- 10. Couples
CREATE TABLE couples (
    id SERIAL PRIMARY KEY,
    partner_a_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    partner_b_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    paired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(partner_a_id, partner_b_id)
);

-- 11. RelationSync reflections (couple reports)
CREATE TABLE relationsync_reflections (
    id SERIAL PRIMARY KEY,
    couple_id INTEGER REFERENCES couples(id) ON DELETE CASCADE,
    report_summary TEXT,
    direct_messages JSONB,
    insight_points JSONB,
    compatibility_level VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Repair actions
CREATE TABLE repair_actions (
    id SERIAL PRIMARY KEY,
    couple_id INTEGER REFERENCES couples(id) ON DELETE CASCADE,
    action_type VARCHAR(50),
    title TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 13. Sync sessions
CREATE TABLE sync_sessions (
    id SERIAL PRIMARY KEY,
    couple_id INTEGER REFERENCES couples(id) ON DELETE CASCADE,
    week_number INTEGER,
    user_a_response TEXT,
    user_b_response TEXT,
    sync_score INTEGER,
    emotional_shift TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_question_responses_session ON question_responses(session_id);
CREATE INDEX idx_pair_requests_receiver ON pair_requests(receiver_id);
CREATE INDEX idx_couples_partners ON couples(partner_a_id, partner_b_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, seen);
CREATE INDEX idx_user_pair_ids_user_id ON user_pair_ids(user_id);
CREATE INDEX idx_user_pair_ids_pair_id ON user_pair_ids(pair_id);

-- Ensure one pair ID per user
CREATE UNIQUE INDEX unique_user_pair_id ON user_pair_ids(user_id);

-- Insert default question categories
INSERT INTO question_categories (name, description) VALUES
('communication', 'Questions about how partners communicate with each other'),
('emotional', 'Questions about emotional connection and vulnerability'),
('trust', 'Questions about trust and reliability in the relationship'),
('intimacy', 'Questions about physical and emotional intimacy'),
('conflict', 'Questions about how conflicts are handled'),
('future', 'Questions about future plans and goals together'),
('family', 'Questions about family influence and cultural dynamics'),
('gender_roles', 'Questions about gender expectations and roles'),
('financial', 'Questions about financial stress and management');

-- Insert comprehensive questionnaire questions with Indian cultural context
INSERT INTO questions (category_id, question_text, type, priority) VALUES
-- Deep Communication Analysis with Indian Context (1-5)
((SELECT id FROM question_categories WHERE name = 'communication'), 'When your partner shares something important with you, how often do you find yourself thinking about your response instead of truly listening?', 'scale', 1),
((SELECT id FROM question_categories WHERE name = 'communication'), 'Describe a time when you felt completely misunderstood by your partner. What did you need from them that you didn''t receive?', 'text', 2),
((SELECT id FROM question_categories WHERE name = 'communication'), 'When discussing problems in your relationship, what pattern do you notice most?', 'multiple-choice', 3),
((SELECT id FROM question_categories WHERE name = 'communication'), 'What is the most difficult truth about yourself that you''ve never shared with your partner?', 'text', 4),
((SELECT id FROM question_categories WHERE name = 'communication'), 'How often do you say "I''m fine" when you''re actually not fine?', 'scale', 5),

-- Family & Cultural Dynamics (Indian Context) (6-10)
((SELECT id FROM question_categories WHERE name = 'family'), 'How much do family opinions and expectations influence your relationship decisions?', 'scale', 6),
((SELECT id FROM question_categories WHERE name = 'family'), 'Describe a situation where family pressure created tension in your relationship. How did you handle it?', 'text', 7),
((SELECT id FROM question_categories WHERE name = 'family'), 'When there''s a conflict between your partner''s wishes and your family''s expectations, what typically happens?', 'multiple-choice', 8),
((SELECT id FROM question_categories WHERE name = 'family'), 'How comfortable are you setting boundaries with family members regarding your relationship?', 'scale', 9),
((SELECT id FROM question_categories WHERE name = 'family'), 'What family tradition or cultural expectation do you struggle with most in your relationship?', 'text', 10),

-- Emotional Vulnerability & Intimacy (11-15)
((SELECT id FROM question_categories WHERE name = 'emotional'), 'What emotion do you struggle most to express in your relationship?', 'multiple-choice', 11),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'Describe your deepest fear about your relationship that keeps you awake at night.', 'text', 12),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'When you''re emotionally hurt by your partner, how long does it typically take you to truly forgive (not just say you forgive)?', 'multiple-choice', 13),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'What part of yourself do you hide from your partner because you''re afraid they won''t love that side of you?', 'text', 14),
((SELECT id FROM question_categories WHERE name = 'emotional'), 'How often do you feel emotionally lonely even when you''re with your partner?', 'scale', 15),

-- Trust & Security (16-20)
((SELECT id FROM question_categories WHERE name = 'trust'), 'If you discovered your partner had been hiding something significant (not necessarily cheating), how would you likely react?', 'multiple-choice', 16),
((SELECT id FROM question_categories WHERE name = 'trust'), 'What is something your partner does that makes you question their commitment to the relationship?', 'text', 17),
((SELECT id FROM question_categories WHERE name = 'trust'), 'How secure do you feel in your relationship when your partner spends time with attractive people?', 'scale', 18),
((SELECT id FROM question_categories WHERE name = 'trust'), 'What would be the hardest betrayal for you to forgive?', 'text', 19),
((SELECT id FROM question_categories WHERE name = 'trust'), 'How often do you check your partner''s phone, social media, or personal belongings?', 'multiple-choice', 20),

-- Physical & Emotional Intimacy (21-25)
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'How satisfied are you with the emotional intimacy in your relationship (feeling truly known and understood)?', 'scale', 21),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'What need do you have in your relationship that you feel embarrassed or uncomfortable asking for?', 'text', 22),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'How often do you and your partner have meaningful conversations that go beyond daily logistics?', 'multiple-choice', 23),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'When was the last time you felt truly seen and appreciated by your partner? Describe that moment.', 'text', 24),
((SELECT id FROM question_categories WHERE name = 'intimacy'), 'How comfortable are you being completely vulnerable and authentic with your partner?', 'scale', 25),

-- Gender Roles & Expectations (Indian Context) (26-28)
((SELECT id FROM question_categories WHERE name = 'gender_roles'), 'How do traditional gender roles affect your relationship dynamics?', 'multiple-choice', 26),
((SELECT id FROM question_categories WHERE name = 'gender_roles'), 'Describe a situation where societal expectations about your role (as a man/woman) created pressure in your relationship.', 'text', 27),
((SELECT id FROM question_categories WHERE name = 'gender_roles'), 'How comfortable is your partner with you pursuing your career ambitions?', 'scale', 28),

-- Conflict & Resolution (29-33)
((SELECT id FROM question_categories WHERE name = 'conflict'), 'During arguments, what is your most destructive pattern?', 'multiple-choice', 29),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'What underlying issue causes most of your relationship conflicts that you never directly address?', 'text', 30),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'After a fight, how do you typically reconnect with your partner?', 'multiple-choice', 31),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'What do you wish your partner understood about how conflict affects you?', 'text', 32),
((SELECT id FROM question_categories WHERE name = 'conflict'), 'How often do you feel like you''re walking on eggshells to avoid conflict?', 'scale', 33),

-- Financial & Life Goals (Indian Context) (34-35)
((SELECT id FROM question_categories WHERE name = 'financial'), 'How do you and your partner handle financial decisions and money management?', 'multiple-choice', 34),
((SELECT id FROM question_categories WHERE name = 'financial'), 'What financial pressure or expectation (family support, lifestyle, etc.) creates the most stress in your relationship?', 'text', 35),

-- Future & Commitment (36-40)
((SELECT id FROM question_categories WHERE name = 'future'), 'What is your biggest fear about the future of your relationship?', 'text', 36),
((SELECT id FROM question_categories WHERE name = 'future'), 'If your relationship continues exactly as it is now for the next 10 years, how would you feel?', 'multiple-choice', 37),
((SELECT id FROM question_categories WHERE name = 'future'), 'What would need to change in your relationship for you to feel completely fulfilled?', 'text', 38),
((SELECT id FROM question_categories WHERE name = 'future'), 'How often do you fantasize about what life would be like with someone else?', 'scale', 39),
((SELECT id FROM question_categories WHERE name = 'future'), 'If you could send a message to your partner that they would truly hear and understand, what would you say?', 'text', 40);

-- Insert multiple choice options for relevant questions
INSERT INTO question_options (question_id, option_text, option_value) VALUES
-- Question 3: Communication patterns
((SELECT id FROM questions WHERE question_text LIKE 'When discussing problems in your relationship%'), 'We both get defensive and nothing gets resolved', 'defensive_both'),
((SELECT id FROM questions WHERE question_text LIKE 'When discussing problems in your relationship%'), 'One person dominates while the other shuts down', 'dominate_shutdown'),
((SELECT id FROM questions WHERE question_text LIKE 'When discussing problems in your relationship%'), 'We avoid the real issues and talk around them', 'avoid_issues'),
((SELECT id FROM questions WHERE question_text LIKE 'When discussing problems in your relationship%'), 'We blame each other instead of addressing the problem', 'blame_each_other'),
((SELECT id FROM questions WHERE question_text LIKE 'When discussing problems in your relationship%'), 'We actually listen and work toward solutions', 'listen_solve'),

-- Question 8: Family conflict handling
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I always side with my family', 'always_family'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I try to balance both but feel torn', 'balance_torn'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I support my partner but feel guilty', 'support_guilty'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'I openly choose my partner over family', 'choose_partner'),
((SELECT id FROM questions WHERE question_text LIKE 'When there''s a conflict between your partner''s wishes%'), 'We find a compromise that works for everyone', 'compromise_all'),

-- Question 11: Difficult emotions
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Anger', 'anger'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Sadness', 'sadness'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Fear', 'fear'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Disappointment', 'disappointment'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Loneliness', 'loneliness'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Resentment', 'resentment'),
((SELECT id FROM questions WHERE question_text LIKE 'What emotion do you struggle most to express%'), 'Joy', 'joy'),

-- Question 13: Forgiveness timeline
((SELECT id FROM questions WHERE question_text LIKE 'When you''re emotionally hurt by your partner%'), 'Minutes to hours', 'minutes_hours'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re emotionally hurt by your partner%'), 'A few days', 'few_days'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re emotionally hurt by your partner%'), 'Weeks', 'weeks'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re emotionally hurt by your partner%'), 'Months', 'months'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re emotionally hurt by your partner%'), 'I hold onto hurt for years', 'hold_years'),
((SELECT id FROM questions WHERE question_text LIKE 'When you''re emotionally hurt by your partner%'), 'I never fully forgive', 'never_forgive'),

-- Question 16: Trust violation reactions
((SELECT id FROM questions WHERE question_text LIKE 'If you discovered your partner had been hiding%'), 'Feel betrayed and question everything', 'betrayed_question'),
((SELECT id FROM questions WHERE question_text LIKE 'If you discovered your partner had been hiding%'), 'Try to understand why they hid it', 'understand_why'),
((SELECT id FROM questions WHERE question_text LIKE 'If you discovered your partner had been hiding%'), 'Get angry and demand explanations', 'angry_demand'),
((SELECT id FROM questions WHERE question_text LIKE 'If you discovered your partner had been hiding%'), 'Feel hurt but try to work through it', 'hurt_work_through'),
((SELECT id FROM questions WHERE question_text LIKE 'If you discovered your partner had been hiding%'), 'Lose trust completely', 'lose_trust'),

-- Question 20: Checking behaviors
((SELECT id FROM questions WHERE question_text LIKE 'How often do you check your partner''s phone%'), 'Never', 'never'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you check your partner''s phone%'), 'Rarely', 'rarely'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you check your partner''s phone%'), 'Sometimes when suspicious', 'sometimes_suspicious'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you check your partner''s phone%'), 'Regularly', 'regularly'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you check your partner''s phone%'), 'Constantly', 'constantly'),

-- Question 23: Meaningful conversations
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have meaningful conversations%'), 'Daily', 'daily'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have meaningful conversations%'), 'Few times a week', 'few_times_week'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have meaningful conversations%'), 'Weekly', 'weekly'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have meaningful conversations%'), 'Monthly', 'monthly'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have meaningful conversations%'), 'Rarely', 'rarely'),
((SELECT id FROM questions WHERE question_text LIKE 'How often do you and your partner have meaningful conversations%'), 'Never', 'never'),

-- Question 26: Gender roles
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We follow traditional roles and it works well', 'traditional_works'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We try to balance traditional and modern approaches', 'balance_traditional_modern'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We reject traditional roles completely', 'reject_traditional'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'It creates constant tension between us', 'creates_tension'),
((SELECT id FROM questions WHERE question_text LIKE 'How do traditional gender roles affect%'), 'We''re still figuring it out', 'still_figuring'),

-- Question 29: Destructive conflict patterns
((SELECT id FROM questions WHERE question_text LIKE 'During arguments, what is your most destructive pattern%'), 'I shut down and withdraw', 'shutdown_withdraw'),
((SELECT id FROM questions WHERE question_text LIKE 'During arguments, what is your most destructive pattern%'), 'I get aggressive and say hurtful things', 'aggressive_hurtful'),
((SELECT id FROM questions WHERE question_text LIKE 'During arguments, what is your most destructive pattern%'), 'I bring up past issues', 'bring_past'),
((SELECT id FROM questions WHERE question_text LIKE 'During arguments, what is your most destructive pattern%'), 'I try to "win" instead of resolve', 'try_win'),
((SELECT id FROM questions WHERE question_text LIKE 'During arguments, what is your most destructive pattern%'), 'I blame and criticize', 'blame_criticize'),
((SELECT id FROM questions WHERE question_text LIKE 'During arguments, what is your most destructive pattern%'), 'I threaten to leave', 'threaten_leave'),

-- Question 31: Reconnection after fights
((SELECT id FROM questions WHERE question_text LIKE 'After a fight, how do you typically reconnect%'), 'We talk it through completely', 'talk_through'),
((SELECT id FROM questions WHERE question_text LIKE 'After a fight, how do you typically reconnect%'), 'We pretend it never happened', 'pretend_never_happened'),
((SELECT id FROM questions WHERE question_text LIKE 'After a fight, how do you typically reconnect%'), 'One person apologizes to end it', 'one_apologizes'),
((SELECT id FROM questions WHERE question_text LIKE 'After a fight, how do you typically reconnect%'), 'We give each other space then slowly reconnect', 'space_then_reconnect'),
((SELECT id FROM questions WHERE question_text LIKE 'After a fight, how do you typically reconnect%'), 'We don''t really reconnect, just move on', 'dont_reconnect'),

-- Question 34: Financial management
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial decisions%'), 'One person controls all finances', 'one_controls'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial decisions%'), 'We discuss major purchases but handle day-to-day separately', 'discuss_major_separate_daily'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial decisions%'), 'Everything is completely shared and discussed', 'completely_shared'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial decisions%'), 'We often fight about money', 'fight_about_money'),
((SELECT id FROM questions WHERE question_text LIKE 'How do you and your partner handle financial decisions%'), 'We avoid talking about money', 'avoid_money_talk'),

-- Question 37: Future relationship satisfaction
((SELECT id FROM questions WHERE question_text LIKE 'If your relationship continues exactly as it is now%'), 'Completely satisfied', 'completely_satisfied'),
((SELECT id FROM questions WHERE question_text LIKE 'If your relationship continues exactly as it is now%'), 'Mostly happy with some concerns', 'mostly_happy_concerns'),
((SELECT id FROM questions WHERE question_text LIKE 'If your relationship continues exactly as it is now%'), 'Neutral - it''s okay', 'neutral_okay'),
((SELECT id FROM questions WHERE question_text LIKE 'If your relationship continues exactly as it is now%'), 'Disappointed and unfulfilled', 'disappointed_unfulfilled'),
((SELECT id FROM questions WHERE question_text LIKE 'If your relationship continues exactly as it is now%'), 'Trapped and miserable', 'trapped_miserable');

-- Success message
SELECT 'RelationSync database setup completed successfully!' as status;