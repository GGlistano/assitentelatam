import { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#128C7E] to-[#075E54] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img
              src="/logo wpp.jpg"
              alt="WhatsApp Logo"
              className="w-24 h-24 rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dr. Juan</h1>
          <p className="text-gray-600 text-center">Tu asistente de adelgazamiento</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent outline-none transition"
              placeholder="Ingresa tu nombre completo"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              Número de WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent outline-none transition"
              placeholder="Ingresa tu número de WhatsApp"
              required
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Con o sin código de país
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !fullName.trim() || !whatsappNumber.trim()}
            className="w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#20BA5A] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Ingresa con tu WhatsApp para acceder a tus conversaciones</p>
          <p className="mt-1">¿Primera vez? Se creará una cuenta automáticamente</p>
        </div>
      </div>
    </div>
  );
}
