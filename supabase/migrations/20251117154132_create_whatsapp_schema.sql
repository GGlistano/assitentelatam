/*
  # WhatsApp Clone with AI Assistant - Database Schema

  ## Overview
  Creates the database structure for a WhatsApp-like chat application with AI assistant integration.

  ## Tables Created
  
  ### 1. conversations
  - `id` (uuid, primary key) - Unique conversation identifier
  - `title` (text) - Conversation title/name
  - `avatar_url` (text) - Optional avatar image URL
  - `last_message` (text) - Preview of last message
  - `last_message_time` (timestamptz) - Timestamp of last message
  - `unread_count` (integer) - Number of unread messages
  - `created_at` (timestamptz) - When conversation was created
  
  ### 2. messages
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid, foreign key) - Links to conversations table
  - `content` (text) - Message text content
  - `sender` (text) - Either 'user' or 'assistant'
  - `created_at` (timestamptz) - When message was sent
  - `is_read` (boolean) - Read status
  
  ## Security
  - RLS enabled on all tables
  - Public access policies for demo (can be restricted later with auth)
  
  ## Indexes
  - Index on conversation_id for fast message lookups
  - Index on created_at for chronological ordering
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'AI Assistant',
  avatar_url text,
  last_message text,
  last_message_time timestamptz DEFAULT now(),
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_time ON conversations(last_message_time DESC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo mode)
CREATE POLICY "Allow public read access to conversations"
  ON conversations
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to conversations"
  ON conversations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to conversations"
  ON conversations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to messages"
  ON messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to messages"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to messages"
  ON messages
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Insert a default conversation
INSERT INTO conversations (title, avatar_url) 
VALUES ('Agostinho (Eu)', NULL)
ON CONFLICT DO NOTHING;