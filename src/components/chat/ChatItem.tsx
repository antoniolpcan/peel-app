import { memo } from 'react';
import { UserAvatar } from '@/components/profile/UserAvatar';
import type { ChatResponse, BasicUserResponse } from '@/services/types';

interface ChatItemProps {
  chat: ChatResponse;
  otherUser?: BasicUserResponse | null;
  isSelected: boolean;
  unreadCount?: number;
  onSelect: (chatId: number) => void;
}

export const ChatItem = memo(function ChatItem({
  chat,
  otherUser,
  isSelected,
  unreadCount,
  onSelect,
}: ChatItemProps) {
  const count =
    unreadCount ??
    Number(
      (chat as any).unread_count ??
      (chat as any).unread_messages_count ??
      (chat as any).unreadCount ??
      0
    );

  return (
    <button
      type="button"
      onClick={() => onSelect(chat.id)}
      className={`w-full text-left p-3 transition-all flex items-center justify-between gap-3 cursor-pointer ${
        isSelected
          ? 'bg-app-accent/10 border-l-2 border-app-accent font-medium'
          : 'hover:bg-app-bg/50'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <UserAvatar name={otherUser?.name} avatar={otherUser?.avatar} size="sm" />

        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-medium text-app-text truncate">
            {otherUser?.name || `Conversa #${chat.id}`}
          </span>
          {otherUser?.username && (
            <span className="text-[11px] text-app-muted truncate">
              @{otherUser.username}
            </span>
          )}
        </div>
      </div>
      {count > 0 && (
        <span className="bg-rose-500 text-white text-[9px] font-extrabold min-w-4 h-4 px-1 
        rounded-full flex items-center justify-center leading-none shrink-0 shadow-2xs animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
});