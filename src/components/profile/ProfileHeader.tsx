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

export function ProfileHeader({
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
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center gap-6">
        <UserAvatar name={user.name} avatar={user.avatar} sizeClass="w-24 h-24" textSizeClass="text-3xl" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-xs text-gray-400 mt-1">
            Membro desde {new Date(user.created_at).toLocaleDateString()}
          </p>

          <div className="mt-3">
            <FollowStats
              followersCount={stats?.followers_count}
              followingCount={stats?.following_count}
              onOpenFollowers={onOpenFollowers}
              onOpenFollowing={onOpenFollowing}
            />
          </div>
        </div>
      </div>

      {isOwnProfile ? (
        !isEditing && (
          <button
            type="button"
            onClick={onEditClick}
            className="bg-gray-100 hover:bg-gray-200 text-slate-800 px-4 py-2 rounded-xl transition-colors font-medium cursor-pointer text-sm"
          >
            Editar Perfil
          </button>
        )
      ) : (
        isAuthenticated && (
          <FollowButton
            isFollowing={isFollowingState}
            isLoading={isFollowLoading}
            onClick={onToggleFollow}
          />
        )
      )}
    </div>
  );
}