import { Link } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { FollowButton } from '@/components/ui/FollowButton';
import type { BasicUserResponse, FollowStatsResponse } from '@/services/types';

interface UserHoverCardProps {
  userId: number,
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
      className="w-64 bg-white opacity-100 rounded-2xl p-4 shadow-2xl border border-slate-100 animate-fadeIn pointer-events-auto"
      style={{ filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15))' }}
    >
      <div className="flex justify-between items-start mb-3">
        <Link to={`/perfil/${userId}`}>
          <UserAvatar name={user.name} avatar={user.avatar} sizeClass="w-12 h-12" textSizeClass="text-base" />
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
        <h4 className="font-bold text-sm text-slate-800 leading-tight group-hover/link:underline">
          {user.name}
        </h4>
        <p className="text-xs text-slate-400 mb-2">@{user.username}</p>
      </Link>

      {user.bio && (
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {user.bio}
        </p>
      )}

      <div className="flex gap-4 pt-2 border-t border-slate-100 text-xs">
        <div>
          <span className="font-bold text-slate-800">{stats?.followers_count ?? 0}</span>{' '}
          <span className="text-slate-400">Seguidores</span>
        </div>
        <div>
          <span className="font-bold text-slate-800">{stats?.following_count ?? 0}</span>{' '}
          <span className="text-slate-400">Seguindo</span>
        </div>
      </div>
    </div>
  );
}