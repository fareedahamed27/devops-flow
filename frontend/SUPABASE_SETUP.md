# 🚀 RelationSync + Supabase Setup Guide

## 📋 Quick Setup (10 minutes)

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose organization and enter:
   - **Name**: `RelationSync`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
4. Wait for project creation (2-3 minutes)

### 2. **Get Your Credentials**
In your Supabase dashboard:

#### **API Settings** (Settings → API):
- `Project URL`: `https://your-project-id.supabase.co`
- `anon public key`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `service_role key`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **Database Settings** (Settings → Database):
- `Connection string`: `postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres`

### 3. **Run Database Migrations**
In your Supabase dashboard:

1. Go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste this migration:

```sql
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
```

4. Click **"Run"** to execute the migration
5. You should see "Success. No rows returned" message

### 4. **Seed Questions Data**
Create another new query and run this:

```sql
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
```

### 5. **Configure Your App**
Update your `backend/.env` file with your Supabase credentials:

```env
# Database Configuration (Supabase)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=relationsync_super_secret_jwt_key_2024_local_development
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Already configured)
EMAIL_USER=spectrasafemanager@gmail.com
EMAIL_APP_PASSWORD=iavbafexoqaweugq

# Frontend URL
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### 6. **Start Your App**
```bash
# Install dependencies (if not done already)
npm run setup

# Start both frontend and backend
npm run full-dev
```

## 🎉 You're Ready!

Your app will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Database**: Supabase (cloud-hosted)

## ✅ What's Working:

✅ **Complete Database** - All tables and relationships  
✅ **30 Realistic Questions** - Deep psychological assessment  
✅ **Gmail Email Service** - Welcome emails and partner invitations  
✅ **AI Report Generation** - Realistic relationship insights  
✅ **Partner Pairing** - Connect couples securely  
✅ **Responsive Design** - Works on all devices  

## 🚀 Deploy to Production:

### Frontend (Netlify):
1. Push to GitHub
2. Connect to Netlify
3. Auto-deploy on push

### Backend (Railway):
1. Connect GitHub to Railway
2. Deploy backend folder
3. Add same environment variables
4. Update frontend with Railway URL

Your RelationSync app is now production-ready with Supabase! 🎊