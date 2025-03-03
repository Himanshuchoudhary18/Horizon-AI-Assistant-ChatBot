/*
  # Add delete policy for user chats

  1. Security
    - Add policy for authenticated users to delete their own chats
*/

-- Allow users to delete their own chats
CREATE POLICY "Users can delete own chats"
  ON user_chats
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);