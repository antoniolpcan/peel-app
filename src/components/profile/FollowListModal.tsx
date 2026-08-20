import { memo, useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { ModalLayout } from '@/components/layout/ModalLayout';
import { FollowListItem } from './FollowListItem';
import type { BasicUserResponse, MediaFileBase } from '@/services/types';

interface UserListItem {
  id: string;
  name?: string;
  username?: string;
  avatar?: MediaFileBase | string | null;
  is_following?: boolean;
  isFollowing?: boolean;
  follower_id?: string;
  following_id?: string;
  follower?: BasicUserResponse & { is_following?: boolean };
  following?: BasicUserResponse & { is_following?: boolean };
  user?: BasicUserResponse & { is_following?: boolean };
}

interface FollowListModalProps {
  type: 'followers' | 'following' | null;
  loading: boolean;
  users: UserListItem[];
  myFollowingList?: any[];
  onClose: () => void;
  onToggleFollow?: (userId: string) => void;
  isOwnProfile?: boolean;
}

const isUserInList = (list: any[], targetId: string) => {
  if (!Array.isArray(list) || !targetId) return false;
  return list.some((item) => {
    const uId =
      item?.following_id ||
      item?.follower_id ||
      item?.following?.id ||
      item?.user?.id ||
      item?.follower?.id ||
      item?.id;
    return Number(uId) === Number(targetId);
  });
};

export const FollowListModal = memo(function FollowListModal({ 
  type, 
  loading, 
  users = [], 
  myFollowingList = [],
  onClose,
  onToggleFollow,
  isOwnProfile = true
}: FollowListModalProps) {

  const [followedOverrides, setFollowedOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFollowedOverrides({});
  }, [type]);

  if (!type) return null;

  const isFollowersType = type === 'followers';
  const title = isFollowersType ? 'Seguidores' : 'Seguindo';

  const handleToggle = (userId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setFollowedOverrides((prev) => ({
      ...prev,
      [userId]: nextStatus,
    }));

    if (onToggleFollow) {
      onToggleFollow(userId);
    }
  };

  return (
    <ModalLayout onClose={onClose} maxWidthClass="max-w-md">

      <div className="flex justify-between items-center mb-4 pb-3 border-b border-app-border transition-colors">
        <h2 className="text-xl font-bold text-app-text flex items-center gap-2 transition-colors">
          <Users className="w-5 h-5 text-app-accent" />
          <span>{title}</span>
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 pr-1 max-h-[60vh]">
        {loading ? (
          <div className="flex flex-col gap-2 py-1">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-2.5 animate-pulse rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-app-border shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="w-28 h-3 bg-app-border rounded" />
                    <div className="w-20 h-2 bg-app-border/70 rounded" />
                  </div>
                </div>
                <div className="w-20 h-8 bg-app-border/60 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-app-muted gap-2 text-center">
            <Users className="w-8 h-8 opacity-40" />
            <p className="text-sm font-medium">Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {users.map((item, index) => {
              const rawUser: any = (isFollowersType 
                ? item.follower || item.user 
                : item.following || item.user) || item;

              const targetUserId = String(
                rawUser?.id || item.follower_id || item.following_id || item.id
              );

              if (!targetUserId) return null;

              const explicitIsFollowing =
                item.is_following ??
                item.isFollowing ??
                rawUser.is_following ??
                rawUser.isFollowing ??
                rawUser.is_followed;

              let isFollowingCalculated = false;

              if (explicitIsFollowing !== undefined && explicitIsFollowing !== null) {
                isFollowingCalculated = Boolean(explicitIsFollowing);
              } else if (!isFollowersType && isOwnProfile) {
                isFollowingCalculated = true;
              } else if (myFollowingList.length > 0) {
                isFollowingCalculated = isUserInList(myFollowingList, targetUserId);
              }

              const finalIsFollowing =
                followedOverrides[targetUserId] !== undefined
                  ? followedOverrides[targetUserId]
                  : isFollowingCalculated;

              const listItemUser = {
                id: targetUserId,
                name: rawUser.name || 'Usuário',
                username: rawUser.username || '',
                avatar: rawUser.avatar || null,
                is_following: finalIsFollowing,
              };

              return (
                <FollowListItem
                  key={`${type}-${targetUserId}-${index}`}
                  user={listItemUser}
                  onToggleFollow={() => handleToggle(targetUserId, finalIsFollowing)}
                  onCloseModal={onClose}
                />
              );
            })}
          </ul>
        )}
      </div>
    </ModalLayout>
  );
});