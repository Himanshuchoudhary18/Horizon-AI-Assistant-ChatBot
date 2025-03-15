/*
  # Add archived column to user_chats table

  1. Changes
    - Add `archived` boolean column to `user_chats` table
    - Set default value to false
    - Add index for better query performance
*/

-- Add archived column with default value false
ALTER TABLE user_chats 
ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_chats_archived ON user_chats(archived);