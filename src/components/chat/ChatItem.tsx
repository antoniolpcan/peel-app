import { memo } from 'react';
import { UserAvatar } from '@/components/profile/UserAvatar';
import type { ChatResponse, BasicUserResponse } from '@/services/types';

interface ChatItemProps {
  chat: ChatResponse;
  otherUser?: BasicUserResponse | null;
  isSelected: boolean;
  onSelect: (chatId: number) => void;
}

export const ChatItem = memo(function ChatItem({
  chat,
  otherUser,
  isSelected,
  onSelect,
}: ChatItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(chat.id)}
      className={`w-full text-left p-3 transition-all flex items-center gap-3 cursor-pointer ${
        isSelected
          ? 'bg-app-accent/10 border-l-2 border-app-accent font-medium'
          : 'hover:bg-app-bg/50'
      }`}
    >
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
    </button>
  );
});