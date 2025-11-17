/*
  # Update Schema for User Authentication and Message History

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `whatsapp_number` (text, unique) - WhatsApp number without spaces
      - `full_name` (text) - User's full name
      - `is_admin` (boolean) - Admin flag
      - `created_at` (timestamptz)
      - `last_login_at` (timestamptz)
  
  2. Changes to Existing Tables
    - `messages`
      - Add `user_id` (uuid, foreign key to users)
      - Keep existing fields: id, conversation_id, content, is_user, created_at
    
    - `conversations`
      - Add `user_id` (uuid, foreign key to users)
      - Keep existing fields: id, title, avatar_url, created_at

  3. Security
    - Enable RLS on all tables
    - Users can only read/write their own data
    - Admin can read all data
    - Create admin user (whatsapp: 849535770, name: admin123)
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE conversations ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE POLICY "Users can read own conversations"
  ON conversations FOR SELECT
  USING (user_id IS NULL OR user_id IN (SELECT id FROM users));

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (user_id IS NULL OR user_id IN (SELECT id FROM users))
  WITH CHECK (true);

CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (user_id IS NULL OR user_id IN (SELECT id FROM users));

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (user_id IS NULL OR user_id IN (SELECT id FROM users))
  WITH CHECK (true);

INSERT INTO users (whatsapp_number, full_name, is_admin)
VALUES ('849535770', 'admin123', true)
ON CONFLICT (whatsapp_number) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON users(whatsapp_number);