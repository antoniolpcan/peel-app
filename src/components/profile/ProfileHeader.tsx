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
    <div className="bg-app-card border border-app-border rounded-3xl p-5 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start gap-6 transition-colors overflow-hidden">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto min-w-0 flex-1">
        <div className="shrink-0">
          <UserAvatar name={user.name} avatar={user.avatar} size="xl" />
        </div>
        
        <div className="flex flex-col min-w-0 flex-1 w-full">
          <h1 className="text-xl sm:text-3xl font-bold text-app-text transition-colors leading-tight wrap-break-word">
            {user.name}
          </h1>
          
          {user.username && (
            <p className="text-app-muted text-sm font-medium truncate">@{user.username}</p>
          )}

          {memberSinceFormatted && (
            <p className="text-xs text-app-muted mt-1 opacity-80">
              Membro desde {memberSinceFormatted}
            </p>
          )}

          {user.bio && (
            <p className="text-sm text-app-text/90 mt-2 whitespace-pre-wrap max-w-md leading-relaxed wrap-break-word">
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

      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-app-border/40">
        {isOwnProfile ? (
          !isEditing && (
            <button
              type="button"
              onClick={onEditClick}
              className="w-full md:w-auto bg-app-bg border border-app-border hover:bg-app-card text-app-text px-4 py-2.5 rounded-xl transition-all font-medium cursor-pointer text-sm shadow-xs active:scale-95 text-center"
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
                className="inline-flex items-center justify-center gap-2 bg-app-card text-app-text 
                border border-app-border hover:bg-app-bg px-4 py-2.5 rounded-xl text-sm 
                font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60 
                active:scale-95"
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