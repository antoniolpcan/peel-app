import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';

import { UserAvatar } from '@/components/profile/UserAvatar';
import { FollowButton } from '@/components/ui/FollowButton';
import { FollowStats } from '@/components/profile/FollowStats';
import type { FollowStatsResponse, BasicUserResponse } from '@/services/types';

interface ProfileHeaderProps {
  user: BasicUserResponse;
  stats?: FollowStatsResponse | null;
  isOwnProfile: boolean;
  isEditing: boolean;
  isAuthenticated: boolean;
  isFollowingState: boolean;
  isFollowLoading: boolean;
  onEditClick: () => void;
  onToggleFollow: () => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
}

function formatMemberSince(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}

export const ProfileHeader = memo(function ProfileHeader({
  user,
  stats,
  isOwnProfile,
  isEditing,
  isAuthenticated,
  isFollowingState,
  isFollowLoading,
  onEditClick,
  onToggleFollow,
  onOpenFollowers,
  onOpenFollowing,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { startDirectChat } = useChat();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const memberSinceFormatted = formatMemberSince(user.created_at);

  const handleStartChat = useCallback(async () => {
    let isMounted = true;
    try {
      setIsStartingChat(true);
      const chat = await startDirectChat(user.id);
      navigate('/chat', { state: { selectedChatId: chat.id } });
    } catch (err) {
    } finally {
      if (isMounted) {
        setIsStartingChat(false);
      }
    }
    return () => { isMounted = false; };
  }, [navigate, startDirectChat, user.id]);

  return (
    <div className="bg-app-card border border-app-border rounded-3xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row justify-between items-start gap-6 transition-colors">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
        <UserAvatar name={user.name} avatar={user.avatar} size="xl" />
        
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-app-text transition-colors leading-tight">
            {user.name}
          </h1>
          {user.username && (
            <p className="text-app-muted text-sm font-medium">@{user.username}</p>
          )}

          {memberSinceFormatted && (
            <p className="text-xs text-app-muted mt-1 opacity-80">
              Membro desde {memberSinceFormatted}
            </p>
          )}

          {user.bio && (
            <p className="text-sm text-app-text/90 mt-2 whitespace-pre-wrap max-w-md leading-relaxed">
              {user.bio}
            </p>
          )}

          <div className="mt-4">
            <FollowStats
              followersCount={stats?.followers_count}
              followingCount={stats?.following_count}
              onOpenFollowers={onOpenFollowers}
              onOpenFollowing={onOpenFollowing}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-start shrink-0">
        {isOwnProfile ? (
          !isEditing && (
            <button
              type="button"
              onClick={onEditClick}
              className="bg-app-bg border border-app-border hover:bg-app-card text-app-text px-4 py-2.5 rounded-xl transition-all font-medium cursor-pointer text-sm shadow-xs active:scale-95"
            >
              Editar Perfil
            </button>
          )
        ) : (
          isAuthenticated && (
            <>
              <button
                type="button"
                onClick={handleStartChat}
                disabled={isStartingChat}
                className="inline-flex items-center justify-center gap-2 bg-app-card text-app-text border border-app-border hover:bg-app-bg px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60 active:scale-95"
              >
                {isStartingChat ? (
                  <Loader2 className="w-4 h-4 animate-spin text-app-accent" />
                ) : (
                  <MessageSquare className="w-4 h-4 text-app-accent" />
                )}
                <span>Mensagem</span>
              </button>

              <FollowButton
                isFollowing={isFollowingState}
                isLoading={isFollowLoading}
                onClick={onToggleFollow}
              />
            </>
          )
        )}
      </div>
    </div>
  );
});