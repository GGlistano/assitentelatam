import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (fullName: string, whatsappNumber: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsappNumber.trim()) return;

    setLoading(true);
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    await onLogin(fullName.trim(), cleanNumber);
    setLoading(false);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)} ${numbers.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#128C7E] to-[#075E54] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#25D366] p-4 rounded-full mb-4">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dr. Juan</h1>
          <p className="text-gray-600 text-center">Seu assistente de emagrecimento</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent outline-none transition"
              placeholder="Digite seu nome completo"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              Número do WhatsApp
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">
                +1
              </span>
              <input
                id="whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(formatWhatsApp(e.target.value))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent outline-none transition"
                placeholder="84 9535 7700"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Sem espaços ou caracteres especiais</p>
          </div>

          <button
            type="submit"
            disabled={loading || !fullName.trim() || !whatsappNumber.trim()}
            className="w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Entre com seu WhatsApp para acessar suas conversas</p>
          <p className="mt-1">Primeira vez? Será criada uma conta automaticamente</p>
        </div>
      </div>
    </div>
  );
}
