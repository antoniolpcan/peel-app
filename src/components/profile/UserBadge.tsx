import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUsers';
import { useFollowStats, useFollowers } from '@/hooks/useFollows';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useFollowActions } from '@/hooks';

import { UserAvatar } from './UserAvatar';
import { UserHoverCard } from './UserHoverCard';

interface UserBadgeProps {
  userId: number;
  onNavigate?: () => void;
}

export function UserBadge({ userId, onNavigate }: UserBadgeProps) {
  const { loggedUserId, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const { user, loading } = useUser(userId);
  const { stats, refetch: refetchStats } = useFollowStats(userId);
  const { followers, refetch: fetchFollowers } = useFollowers(userId);
  const { followUser, unfollowUser, loading: isFollowLoading } = useFollowActions();

  const isOwnProfile = userId === loggedUserId;
  const isFollowing = Boolean(
    followers?.some((f: any) => f.follower_id === loggedUserId || f.follower?.id === loggedUserId)
  );

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const action = isFollowing ? unfollowUser : followUser;
    const success = await action(userId);

    if (success) {
      refetchStats();
      fetchFollowers();
      addToast(
        isFollowing ? `Deixou de seguir ${user?.name}` : `Seguindo ${user?.name}!`,
        isFollowing ? 'info' : 'success'
      );
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center gap-2 mb-2 opacity-50 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-app-border" />
        <span className="text-xs text-app-muted">Carregando...</span>
      </div>
    );
  }

  return (
    <div 
      className="relative inline-block z-20 mb-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2.5 w-fit">
        <div className="relative group/avatar-hover">
          <Link 
            to={`/perfil/${userId}`}
            onClick={onNavigate}
            className="block hover:opacity-80 transition-opacity cursor-pointer"
          >
            <UserAvatar name={user.name} avatar={user.avatar} size="md" />
          </Link>
          <div className="hidden group-hover/avatar-hover:block absolute top-0 left-0 pt-2 z-999">
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
        </div>
        <Link 
          to={`/perfil/${userId}`}
          onClick={onNavigate}
          className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-800 leading-tight hover:underline">
            {user.name}
          </span>
          {user.username && (
            <span className="text-[11px] text-slate-600 font-normal">@{user.username}</span>
          )}
        </Link>
      </div>
    </div>
  );
}