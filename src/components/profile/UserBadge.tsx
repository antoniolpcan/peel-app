import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import type { BasicUserResponse } from '@/services/types';
import { useUser } from '@/hooks/useUsers';
import { useFollowStats, useFollowers } from '@/hooks/useFollows';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useFollowActions } from '@/hooks';

import { UserAvatar } from './UserAvatar';
import { UserHoverCard } from './UserHoverCard';

interface UserBadgeProps {
  userId: number;
  user?: (BasicUserResponse & { is_following?: boolean }) | null;
  onNavigate?: () => void;
}

export const UserBadge = memo(function UserBadge({ 
  userId, 
  user: initialUser, 
  onNavigate 
}: UserBadgeProps) {
  const { loggedUserId, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user: fetchedUser, loading: isUserLoading } = useUser(initialUser ? 0 : userId);
  const user = initialUser || fetchedUser;

  const { stats, refetch: refetchStats } = useFollowStats(isHovered ? userId : 0);
  const { followers, refetch: fetchFollowers } = useFollowers(isHovered ? userId : 0);
  const { followUser, unfollowUser, loading: isFollowLoading } = useFollowActions();

  const isOwnProfile = userId === loggedUserId;
  
  const isFollowing = initialUser?.is_following ?? Boolean(
    followers?.some((f) => {
      const followerObj = 'follower' in f ? f.follower : null;
      return f.follower_id === loggedUserId || followerObj?.id === loggedUserId;
    })
  );

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleToggleFollow = useCallback(async (targetUserId?: number) => {
    const idToProcess = typeof targetUserId === 'number' ? targetUserId : userId;

    if (!idToProcess) return;

    const action = isFollowing ? unfollowUser : followUser;
    const success = await action(idToProcess);

    if (success) {
      refetchStats();
      fetchFollowers();
      addToast(
        isFollowing ? `Deixou de seguir ${user?.name}` : `Seguindo ${user?.name}!`,
        isFollowing ? 'info' : 'success'
      );
    }
  }, [userId, isFollowing, unfollowUser, followUser, refetchStats, fetchFollowers, addToast, user?.name]);

  if ((isUserLoading && !user) || !user) {
    return (
      <div className="flex items-center gap-2 mb-2 opacity-50 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-app-border shrink-0" />
        <span className="text-xs text-app-muted">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="inline-block" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2.5 w-fit">
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link 
            to={`/perfil/${userId}`}
            onClick={onNavigate}
            className="block hover:opacity-80 transition-opacity cursor-pointer shrink-0"
          >
            <UserAvatar name={user.name} avatar={user.avatar} size="md" />
          </Link>

          {isHovered && (
            <div className="absolute top-full left-0 pt-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <UserHoverCard
                userId={userId}
                user={user}
                stats={stats}
                isOwnProfile={isOwnProfile}
                isAuthenticated={isAuthenticated}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                onToggleFollow={handleToggleFollow}
              />
            </div>
          )}
        </div>

        <Link 
          to={`/perfil/${userId}`}
          onClick={onNavigate}
          className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-900 leading-tight hover:underline transition-colors">
            {user.name}
          </span>
          {user.username && (
            <span className="text-[11px] text-slate-800/80 font-normal transition-colors">
              @{user.username}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
});