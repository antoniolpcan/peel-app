import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { UserAvatar } from '@/components/profile/UserAvatar';
import type { BasicUserResponse } from '@/services/types';

interface ChatHeaderProps {
  selectedChatId: number;
  activeOtherUser?: BasicUserResponse | null;
  onBack: () => void;
}

export const ChatHeader = memo(function ChatHeader({
  selectedChatId,
  activeOtherUser,
  onBack,
}: ChatHeaderProps) {
  return (
    <div className="p-3 border-b border-app-border font-medium text-app-text text-xs flex items-center justify-between bg-app-card shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1 text-app-muted hover:text-app-text rounded-lg hover:bg-app-bg transition-colors cursor-pointer"
          title="Voltar para a lista"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {activeOtherUser?.id ? (
          <Link
            to={`/perfil/${activeOtherUser.id}`}
            className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
          >
            <UserAvatar name={activeOtherUser.name} avatar={activeOtherUser.avatar} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold leading-tight text-xs hover:underline truncate">
                {activeOtherUser.name}
              </span>
              {activeOtherUser.username && (
                <span className="text-[10px] text-app-muted leading-tight truncate">
                  @{activeOtherUser.username}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-app-border/40 flex items-center justify-center text-app-muted border border-app-border shrink-0">
              <User className="w-4 h-4" />
            </div>
            <span className="font-semibold leading-tight text-xs">
              {`Conversa #${selectedChatId}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});