/*
  # Add user pair IDs table for new pairing system

  1. New Tables
    - `user_pair_ids`
      - `id` (integer, primary key)
      - `user_id` (integer, foreign key to users)
      - `pair_id` (varchar(5), unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_pair_ids` table
    - Add policies for users to manage their own pair IDs

  3. Indexes
    - Index on user_id for fast lookups
    - Index on pair_id for fast pairing
    - Unique constraint on user_id (one pair ID per user)
*/

-- Create user_pair_ids table
CREATE TABLE IF NOT EXISTS user_pair_ids (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    pair_id VARCHAR(5) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add unique constraint on user_id (one pair ID per user)
ALTER TABLE user_pair_ids ADD CONSTRAINT unique_user_pair_id UNIQUE (user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_pair_ids_user_id ON user_pair_ids(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pair_ids_pair_id ON user_pair_ids(pair_id);

-- Enable Row Level Security
ALTER TABLE user_pair_ids ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own pair IDs"
  ON user_pair_ids
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text);