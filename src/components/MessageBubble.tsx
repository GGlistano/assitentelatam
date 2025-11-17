import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../lib/supabase';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const time = new Date(message.created_at).toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
          isUser
            ? 'bg-[#d9fdd3] rounded-br-none'
            : 'bg-white rounded-bl-none'
        }`}
      >
        <p className="text-[14.2px] text-gray-800 break-words whitespace-pre-wrap">
          {message.content}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-gray-500">{time}</span>
          {isUser && (
            <span className="text-gray-500">
              {message.is_read ? (
                <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
