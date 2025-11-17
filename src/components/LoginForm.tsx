import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LoginFormProps {
  onLogin: (fullName: string, whatsappNumber: string) => void;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', dialCode: '+1' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸', dialCode: '+34' },
  { code: 'MX', name: 'México', flag: '🇲🇽', dialCode: '+52' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { code: 'CO', name: 'Colômbia', flag: '🇨🇴', dialCode: '+57' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
  { code: 'EC', name: 'Equador', flag: '🇪🇨', dialCode: '+593' },
  { code: 'BO', name: 'Bolívia', flag: '🇧🇴', dialCode: '+591' },
  { code: 'PY', name: 'Paraguai', flag: '🇵🇾', dialCode: '+595' },
  { code: 'UY', name: 'Uruguai', flag: '🇺🇾', dialCode: '+598' },
  { code: 'DO', name: 'Rep. Dominicana', flag: '🇩🇴', dialCode: '+1849' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', dialCode: '+507' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504' },
  { code: 'NI', name: 'Nicarágua', flag: '🇳🇮', dialCode: '+505' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧', dialCode: '+44' },
  { code: 'FR', name: 'França', flag: '🇫🇷', dialCode: '+33' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪', dialCode: '+49' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹', dialCode: '+39' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦', dialCode: '+1' },
];

export function LoginForm({ onLogin }: LoginFormProps) {
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[14]);
  const [showCountries, setShowCountries] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsappNumber.trim()) return;

    setLoading(true);
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const fullNumber = selectedCountry.dialCode.replace('+', '') + cleanNumber;
    await onLogin(fullName.trim(), fullNumber);
    setLoading(false);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)} ${numbers.slice(6, 10)}`;
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setShowCountries(false);
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
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountries(!showCountries)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition disabled:opacity-50"
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="text-sm">{selectedCountry.dialCode}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showCountries && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => selectCountry(country)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition text-left"
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span className="flex-1 text-sm text-gray-700">{country.name}</span>
                        <span className="text-sm text-gray-600 font-medium">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                id="whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(formatWhatsApp(e.target.value))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent outline-none transition"
                placeholder="95 3577 0000"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Digite apenas o número sem o código do país</p>
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
