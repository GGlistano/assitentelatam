import { ArrowLeft, Video, Phone, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  avatarUrl?: string | null;
}

export function ChatHeader({ title, subtitle, avatarUrl }: ChatHeaderProps) {
  return (
    <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-white/10 rounded-full transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 font-medium text-lg">
                {title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-medium text-base">{title}</h1>
            <p className="text-xs text-gray-200">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="hover:bg-white/10 p-2 rounded-full transition">
          <Video className="w-5 h-5" />
        </button>
        <button className="hover:bg-white/10 p-2 rounded-full transition">
          <Phone className="w-5 h-5" />
        </button>
        <button className="hover:bg-white/10 p-2 rounded-full transition">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
