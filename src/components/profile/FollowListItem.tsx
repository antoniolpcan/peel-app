import React, { useCallback, memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MediaFileBase } from '@/services/types';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { FollowButton } from '../ui/FollowButton';
import { useFollowActions } from '@/hooks';

interface FollowListItemProps {
  user: {
    id: number;
    name: string;
    username: string;
    avatar?: MediaFileBase | string | null;
    is_following?: boolean;
  };
  onToggleFollow?: (userId: number) => void;
  onCloseModal?: () => void;
}

export const FollowListItem = memo(function FollowListItem({
  user,
  onToggleFollow,
  onCloseModal,
}: FollowListItemProps) {
  const navigate = useNavigate();
  const { loggedUserId, isAuthenticated } = useAuth();
  const { followUser, unfollowUser, loading: isApiLoading } = useFollowActions();

  const isOwnUser = loggedUserId === user.id;

  const [isFollowing, setIsFollowing] = useState<boolean>(
    Boolean(user.is_following)
  );

  useEffect(() => {
    setIsFollowing(Boolean(user.is_following));
  }, [user.is_following]);

  const handleUserClick = useCallback(() => {
    if (onCloseModal) onCloseModal();
    navigate(`/perfil/${user.id}`);
  }, [navigate, onCloseModal, user.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleUserClick();
      }
    },
    [handleUserClick]
  );

  const handleFollowClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isApiLoading) return; 

      const nextState = !isFollowing;
      setIsFollowing(nextState);

      let success: boolean | any = false;
      if (nextState) {
        success = await followUser(user.id);
      } else {
        success = await unfollowUser(user.id);
      }

      if (success !== false) {
        if (onToggleFollow) {
          onToggleFollow(user.id);
        }
      } else {
        setIsFollowing(!nextState);
      }
    },
    [isFollowing, isApiLoading, followUser, unfollowUser, user.id, onToggleFollow]
  );

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={handleUserClick}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-between gap-3 p-2.5 hover:bg-app-bg/60 rounded-2xl transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50"
    >
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar name={user.name} avatar={user.avatar} size="md" />
        <div className="flex flex-col truncate">
          <p className="font-bold text-sm text-app-text transition-colors leading-snug truncate group-hover:text-app-accent">
            {user.name}
          </p>
          {user.username && (
            <p className="text-xs text-app-muted transition-colors truncate">
              @{user.username}
            </p>
          )}
        </div>
      </div>

      {isAuthenticated && !isOwnUser && (
        <div className="shrink-0">
          <FollowButton
            size="sm"
            isFollowing={isFollowing}
            onClick={handleFollowClick}
          />
        </div>
      )}
    </li>
  );
});