-- Add user_pair_ids table for the new pairing system
CREATE TABLE IF NOT EXISTS user_pair_ids (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    pair_id VARCHAR(5) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_pair_ids_pair_id ON user_pair_ids(pair_id);
CREATE INDEX IF NOT EXISTS idx_user_pair_ids_user_id ON user_pair_ids(user_id);

-- Add unique constraint to ensure one pair ID per user
ALTER TABLE user_pair_ids ADD CONSTRAINT unique_user_pair_id UNIQUE (user_id);