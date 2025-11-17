import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'user' | 'assistant';
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  avatar_url: string | null;
  last_message: string | null;
  last_message_time: string;
  unread_count: number;
  created_at: string;
}
