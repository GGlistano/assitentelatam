import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Users, MessageSquare, Calendar, Clock, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  whatsapp_number: string;
  full_name: string;
  created_at: string;
  last_login_at: string;
  message_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  created_at: string;
  user_id: string;
}

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    activeToday: 0,
  });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadUserMessages(selectedUser.id);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('is_admin', false)
      .order('last_login_at', { ascending: false });

    if (data) {
      const usersWithCount = await Promise.all(
        data.map(async (user) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          return { ...user, message_count: count || 0 };
        })
      );
      setUsers(usersWithCount);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false);

    const { count: messageCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: activeCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', false)
      .gte('last_login_at', today.toISOString());

    setStats({
      totalUsers: userCount || 0,
      totalMessages: messageCount || 0,
      activeToday: activeCount || 0,
    });
  };

  const loadUserMessages = async (userId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const handleRefresh = () => {
    loadUsers();
    loadStats();
    if (selectedUser) {
      loadUserMessages(selectedUser.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando painel...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 transition p-1"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Painel Admin</h1>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition font-medium text-sm sm:text-base"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 py-3 sm:py-6 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-3 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Total Usuários</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Total Mensagens</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-orange-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Ativos Hoje</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.activeToday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-[calc(100vh-220px)] sm:h-[calc(100vh-280px)]">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">Usuários</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left flex-shrink-0 ${
                    selectedUser?.id === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user.full_name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">+1 {user.whatsapp_number}</p>
                      <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{user.message_count} msgs</span>
                        </span>
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{formatDate(user.last_login_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                {selectedUser ? `Conversas - ${selectedUser.full_name}` : 'Selecione um usuário'}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {!selectedUser && (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm sm:text-base px-4 text-center">
                  Selecione um usuário para ver as mensagens
                </div>
              )}
              {selectedUser && messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm sm:text-base">
                  Nenhuma mensagem ainda
                </div>
              )}
              {selectedUser && messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 sm:p-3 rounded-lg flex-shrink-0 max-w-[85%] sm:max-w-none ${
                    message.sender === 'user'
                      ? 'bg-blue-50 ml-auto sm:ml-8'
                      : 'bg-gray-100 mr-auto sm:mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-700">
                      {message.sender === 'user' ? 'Usuário' : 'Dr. Juan'}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
