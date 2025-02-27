/*
  # Create user chats table

  1. New Tables
    - `user_chats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `messages` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `user_chats` table
    - Add policies for users to manage their own chats
*/

CREATE TABLE IF NOT EXISTS user_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  messages jsonb[] DEFAULT array[]::jsonb[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_chats ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own chats
CREATE POLICY "Users can read own chats"
  ON user_chats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own chats
CREATE POLICY "Users can insert own chats"
  ON user_chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own chats
CREATE POLICY "Users can update own chats"
  ON user_chats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);