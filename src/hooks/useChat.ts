import { useState, useEffect, useRef } from 'react';
import { supabase, Message, Conversation } from '../lib/supabase';

export function useChat(conversationId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
    loadMessages();

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadConversation = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle();

    if (data) {
      setConversation(data);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (content: string) => {
    if (sending) return;

    setSending(true);

    try {
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          content,
          sender: 'user',
        })
        .select()
        .single();

      if (userError) throw userError;

      if (userMessage) {
        setMessages((prev) => [...prev, userMessage]);
      }

      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_time: new Date().toISOString(),
        })
        .eq('id', conversationId);

      setIsTyping(true);

      const allMessages = [...messages, userMessage];
      const last15Messages = allMessages.slice(-15);
      const conversationHistory = last15Messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: content,
            conversationHistory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const { response: aiResponse } = await response.json();

      setIsTyping(false);

      const { data: aiMessage, error: aiError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          content: aiResponse,
          sender: 'assistant',
          is_read: true,
        })
        .select()
        .single();

      if (aiError) throw aiError;

      if (aiMessage) {
        setMessages((prev) => [...prev, aiMessage]);
      }

      await supabase
        .from('conversations')
        .update({
          last_message: aiResponse,
          last_message_time: new Date().toISOString(),
        })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    conversation,
    loading,
    sending,
    isTyping,
    sendMessage,
    messagesEndRef,
  };
}
