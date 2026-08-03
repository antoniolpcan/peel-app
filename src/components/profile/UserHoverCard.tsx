import { Link } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { FollowButton } from '@/components/ui/FollowButton';
import type { BasicUserResponse, FollowStatsResponse } from '@/services/types';

interface UserHoverCardProps {
  userId: number;
  user: BasicUserResponse;
  stats?: FollowStatsResponse | null;
  isOwnProfile: boolean;
  isAuthenticated: boolean;
  isFollowing: boolean;
  isFollowLoading: boolean;
  onToggleFollow: (e: React.MouseEvent) => void;
}

export function UserHoverCard({
  userId,
  user,
  stats,
  isOwnProfile,
  isAuthenticated,
  isFollowing,
  isFollowLoading,
  onToggleFollow,
}: UserHoverCardProps) {
  return (
    <div
      className="w-64 bg-app-card rounded-2xl p-4 shadow-2xl border 
      border-app-border animate-fadeIn pointer-events-auto transition-colors"
      style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))' }}
    >
      <div className="flex justify-between items-start mb-3">
        <Link to={`/perfil/${userId}`}>
          <UserAvatar name={user.name} avatar={user.avatar} size="md" />
        </Link>

        {!isOwnProfile && isAuthenticated && (
          <FollowButton
            isFollowing={isFollowing}
            isLoading={isFollowLoading}
            onClick={onToggleFollow}
            size="sm"
          />
        )}
      </div>

      <Link to={`/perfil/${userId}`} className="block group/link">
        <h4 className="font-bold text-sm text-app-text leading-tight group-hover/link:underline transition-colors">
          {user.name}
        </h4>
        <p className="text-xs text-app-muted mb-2">@{user.username}</p>
      </Link>

      {user.bio && (
        <p className="text-xs text-app-text/90 line-clamp-2 mb-3 leading-relaxed transition-colors">
          {user.bio}
        </p>
      )}

      <div className="flex gap-4 pt-2 border-t border-app-border text-xs transition-colors">
        <div>
          <span className="font-bold text-app-text">{stats?.followers_count ?? 0}</span>{' '}
          <span className="text-app-muted">Seguidores</span>
        </div>
        <div>
          <span className="font-bold text-app-text">{stats?.following_count ?? 0}</span>{' '}
          <span className="text-app-muted">Seguindo</span>
        </div>
      </div>
    </div>
  );
}