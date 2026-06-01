-- RelationSync Database Schema
-- Run this file to create all necessary tables

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    name VARCHAR(100),
    age INT,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    relationship_status VARCHAR(30) CHECK (relationship_status IN ('dating', 'married', 'separated')),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Question categories
CREATE TABLE IF NOT EXISTS question_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Questions
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES question_categories(id),
    question_text TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('text', 'scale', 'multiple-choice')),
    is_tailored BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Question options (for multiple choice questions)
CREATE TABLE IF NOT EXISTS question_options (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_value TEXT
);

-- 5. User questionnaire sessions
CREATE TABLE IF NOT EXISTS user_questionnaire_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    session_name VARCHAR(100) DEFAULT 'Initial Assessment',
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 6. Question responses
CREATE TABLE IF NOT EXISTS question_responses (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES user_questionnaire_sessions(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id),
    answer_text TEXT,
    selected_option_id INT REFERENCES question_options(id),
    emotional_tag TEXT,
    confidence_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. AI reports
CREATE TABLE IF NOT EXISTS ai_reports (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES user_questionnaire_sessions(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    emotional_summary TEXT,
    emotional_tags TEXT[],
    communication_score INT,
    emotional_burden_score INT,
    love_language_estimate VARCHAR(30),
    report_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Pair requests
CREATE TABLE IF NOT EXISTS pair_requests (
    id SERIAL PRIMARY KEY,
    requester_id INT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
    receiver_identifier VARCHAR(100), -- email, phone, or username
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);

-- 9. Couples
CREATE TABLE IF NOT EXISTS couples (
    id SERIAL PRIMARY KEY,
    partner_a_id INT REFERENCES users(id) ON DELETE CASCADE,
    partner_b_id INT REFERENCES users(id) ON DELETE CASCADE,
    paired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(partner_a_id, partner_b_id)
);

-- 10. RelationSync reflections
CREATE TABLE IF NOT EXISTS relationsync_reflections (
    id SERIAL PRIMARY KEY,
    couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
    report_summary TEXT,
    direct_messages JSONB,
    insight_points JSONB,
    compatibility_level VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Repair actions
CREATE TABLE IF NOT EXISTS repair_actions (
    id SERIAL PRIMARY KEY,
    couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
    action_type VARCHAR(50),
    title TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    assigned_to INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 12. Sync sessions
CREATE TABLE IF NOT EXISTS sync_sessions (
    id SERIAL PRIMARY KEY,
    couple_id INT REFERENCES couples(id) ON DELETE CASCADE,
    week_number INT,
    user_a_response TEXT,
    user_b_response TEXT,
    sync_score INT,
    emotional_shift TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default question categories
INSERT INTO question_categories (name, description) VALUES
('communication', 'Questions about how partners communicate with each other'),
('emotional', 'Questions about emotional connection and vulnerability'),
('trust', 'Questions about trust and reliability in the relationship'),
('intimacy', 'Questions about physical and emotional intimacy'),
('conflict', 'Questions about how conflicts are handled'),
('future', 'Questions about future plans and goals together')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_question_responses_session ON question_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_pair_requests_receiver ON pair_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_couples_partners ON couples(partner_a_id, partner_b_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, seen);