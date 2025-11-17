import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { LoginForm } from './components/LoginForm';
import { AdminPanel } from './components/AdminPanel';
import { useAuth } from './contexts/AuthContext';
import { useChat } from './hooks/useChat';
import { LogOut } from 'lucide-react';

function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

  if (authLoading) {
    return (
      <div className="h-screen bg-[#0a1014] flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  if (user.is_admin && showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  if (user.is_admin && !showAdmin) {
    return (
      <div className="h-screen bg-gradient-to-br from-[#128C7E] to-[#075E54] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Bem-vindo, Admin!
          </h1>
          <div className="space-y-4">
            <button
              onClick={() => setShowAdmin(true)}
              className="w-full bg-[#128C7E] text-white py-3 rounded-lg font-semibold hover:bg-[#0F7A6D] transition"
            >
              Acessar Painel Admin
            </button>
            <button
              onClick={logout}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ChatApp user={user} onLogout={logout} />;
}

function ChatApp({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    initializeConversation();
  }, [user.id]);

  const initializeConversation = async () => {
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingConversation) {
      setConversationId(existingConversation.id);
    } else {
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({
          title: 'Dr. Juan',
          avatar_url: '/doutor juan.png',
          user_id: user.id,
        })
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

  return <ChatView conversationId={conversationId} userId={user.id} onLogout={onLogout} />;
}

function ChatView({
  conversationId,
  userId,
  onLogout,
}: {
  conversationId: string;
  userId: string;
  onLogout: () => void;
}) {
  const { messages, conversation, loading, sending, isTyping, sendMessage, messagesEndRef } =
    useChat(conversationId, userId);

  if (loading) {
    return (
      <div className="h-screen bg-[#0a1014] flex items-center justify-center">
        <div className="text-white text-lg">Carregando conversa...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#efeae2]">
      <div className="relative">
        <ChatHeader
          title={conversation?.title || 'Dr. Juan'}
          subtitle="Online"
          avatarUrl={conversation?.avatar_url}
        />
        <button
          onClick={onLogout}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

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
