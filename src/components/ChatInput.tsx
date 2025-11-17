import { useState } from 'react';
import { Plus, Camera, Mic, Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#f0f2f5] px-3 py-2 flex items-center gap-2">
      <button
        type="button"
        className="text-gray-600 hover:text-gray-800 transition p-2"
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 gap-3">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800 transition"
        >
          <Smile className="w-6 h-6" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="flex-1 outline-none bg-transparent text-[15px]"
          disabled={disabled}
        />
      </div>

      {message.trim() ? (
        <button
          type="submit"
          disabled={disabled}
          className="bg-[#008069] text-white p-3 rounded-full hover:bg-[#017561] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      ) : (
        <>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 transition p-2"
          >
            <Camera className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 transition p-2"
          >
            <Mic className="w-6 h-6" />
          </button>
        </>
      )}
    </form>
  );
}
