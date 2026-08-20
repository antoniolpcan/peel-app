import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/contexts/ToastContext';

import { UserAvatar } from './UserAvatar';
import { FollowButton } from '@/components/ui/FollowButton';
import type { BasicUserResponse, FollowStatsResponse } from '@/services/types';

interface UserHoverCardProps {
  userId: string;
  user: BasicUserResponse;
  stats?: FollowStatsResponse | null;
  isOwnProfile: boolean;
  isAuthenticated: boolean;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onToggleFollow: (userId: string) => void;
}

export const UserHoverCard = memo(function UserHoverCard({
  userId,
  user,
  stats,
  isOwnProfile,
  isAuthenticated,
  isFollowing,
  isFollowLoading,
  onToggleFollow,
}: UserHoverCardProps) {
  const navigate = useNavigate();
  const { startDirectChat } = useChat();
  const { addToast } = useToast();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleStartChat = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        setIsStartingChat(true);
        const chat = await startDirectChat(userId);
        navigate('/chat', { state: { selectedChatId: chat.id } });
      } catch {
        addToast('Erro ao iniciar conversa. Tente novamente.', 'error');
      } finally {
        setIsStartingChat(false);
      }
    },
    [navigate, startDirectChat, userId, addToast]
  );

  const handleFollowClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFollow(userId);
    },
    [onToggleFollow, userId]
  );

  const isStatsLoading = stats === undefined || stats === null;

  return (
    <div className="w-68 bg-app-card rounded-2xl p-4 shadow-2xl border border-app-border animate-in fade-in zoom-in-95 duration-150 pointer-events-auto transition-colors">
      <div className="flex justify-between items-start mb-3">
        <Link to={`/perfil/${userId}`} className="hover:opacity-80 transition-opacity">
          <UserAvatar name={user.name} avatar={user.avatar} size="md" />
        </Link>

        {!isOwnProfile && isAuthenticated && (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleStartChat}
              disabled={isStartingChat}
              title="Enviar Mensagem"
              className="p-1.5 rounded-xl border border-app-border bg-app-bg text-app-text hover:bg-app-card transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isStartingChat ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-app-accent" />
              ) : (
                <MessageSquare className="w-3.5 h-3.5 text-app-accent" />
              )}
            </button>

            <FollowButton
              isFollowing={isFollowing}
              isLoading={isFollowLoading}
              onClick={handleFollowClick}
              size="sm"
            />
          </div>
        )}
      </div>

      <Link to={`/perfil/${userId}`} className="block group/link mb-2">
        <h4 className="font-bold text-sm text-app-text leading-tight group-hover/link:underline transition-colors">
          {user.name}
        </h4>
        {user.username && (
          <p className="text-xs text-app-muted">@{user.username}</p>
        )}
      </Link>

      {user.bio && (
        <p className="text-xs text-app-text/90 line-clamp-2 mb-3 leading-relaxed transition-colors">
          {user.bio}
        </p>
      )}

      <div className="flex gap-4 pt-2 border-t border-app-border text-xs transition-colors min-h-7 items-center">
        {isStatsLoading ? (
          <div className="flex gap-4 w-full animate-pulse">
            <div className="h-3 w-20 bg-app-border rounded" />
            <div className="h-3 w-20 bg-app-border rounded" />
          </div>
        ) : (
          <>
            <div>
              <span className="font-bold text-app-text">{stats.followers_count ?? 0}</span>{' '}
              <span className="text-app-muted">Seguidores</span>
            </div>
            <div>
              <span className="font-bold text-app-text">{stats.following_count ?? 0}</span>{' '}
              <span className="text-app-muted">Seguindo</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
});