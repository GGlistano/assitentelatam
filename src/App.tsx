import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { useChat } from './hooks/useChat';

function App() {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existingConversation) {
      setConversationId(existingConversation.id);
    } else {
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({ title: 'Dr. Juan', avatar_url: '/doutor juan.png' })
        .select()
        .single();

      if (newConversation) {
        setConversationId(newConversation.id);
      }
    }
  };

  if (!conversationId) {
    return (
      <div className="h-screen bg-[#0a1014] flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return <ChatView conversationId={conversationId} />;
}

function ChatView({ conversationId }: { conversationId: string }) {
  const { messages, conversation, loading, sending, isTyping, sendMessage, messagesEndRef } = useChat(conversationId);

  if (loading) {
    return (
      <div className="h-screen bg-[#0a1014] flex items-center justify-center">
        <div className="text-white text-lg">Carregando conversa...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#efeae2]">
      <ChatHeader
        title={conversation?.title || 'Dr. Juan'}
        subtitle="Online"
        avatarUrl={conversation?.avatar_url}
      />

      <div
        className="flex-1 overflow-y-auto py-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
}

export default App;
