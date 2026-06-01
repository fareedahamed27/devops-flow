/*
  # Add user_pair_ids table

  1. New Tables
    - `user_pair_ids`
      - `id` (integer, primary key)
      - `user_id` (integer, foreign key to users)
      - `pair_id` (varchar(5), unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_pair_ids` table
    - Add policy for users to read their own pair ID data

  3. Indexes
    - Index on user_id for fast lookups
    - Index on pair_id for fast lookups
    - Unique constraint on user_id (one pair ID per user)
    - Unique constraint on pair_id (each pair ID is unique)
*/

CREATE TABLE IF NOT EXISTS user_pair_ids (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pair_id VARCHAR(5) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_pair_ids_user_id ON user_pair_ids(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pair_ids_pair_id ON user_pair_ids(pair_id);

-- Ensure one pair ID per user
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_pair_id ON user_pair_ids(user_id);

-- Enable Row Level Security
ALTER TABLE user_pair_ids ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own pair ID data
CREATE POLICY "Users can read own pair ID data"
  ON user_pair_ids
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Create policy for users to insert their own pair ID data
CREATE POLICY "Users can insert own pair ID data"
  ON user_pair_ids
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);