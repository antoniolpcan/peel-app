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
    <div className="bg-app-card border border-app-border rounded-3xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row justify-between items-start gap-6 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full sm:w-auto">
        <UserAvatar name={user.name} avatar={user.avatar} size="xl" />
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-app-text transition-colors">
            {user.name}
          </h1>
          <p className="text-app-muted text-sm">@{user.username}</p>
          <p className="text-xs text-app-muted mt-1 opacity-80">
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
            className="bg-app-bg border border-app-border hover:opacity-80 text-app-text px-4 py-2 rounded-xl transition-colors font-medium cursor-pointer text-sm self-end sm:self-start"
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