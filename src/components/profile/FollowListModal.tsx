import { memo } from 'react';
import { Users } from 'lucide-react';
import { ModalLayout } from '@/components/layout/ModalLayout';
import { FollowListItem } from './FollowListItem';
import type { BasicUserResponse } from '@/services/types';

interface UserListItem {
  id: number;
  follower?: BasicUserResponse & { is_following?: boolean };
  following?: BasicUserResponse & { is_following?: boolean };
  user?: BasicUserResponse & { is_following?: boolean };
}

interface FollowListModalProps {
  type: 'followers' | 'following' | null;
  loading: boolean;
  users: UserListItem[];
  onClose: () => void;
  onToggleFollow?: (userId: number) => void;
  isOwnProfile?: boolean;
}

export const FollowListModal = memo(function FollowListModal({ 
  type, 
  loading, 
  users = [], 
  onClose,
  onToggleFollow,
  isOwnProfile = true
}: FollowListModalProps) {
  if (!type) return null;

  const isFollowersType = type === 'followers';
  const title = isFollowersType ? 'Seguidores' : 'Seguindo';

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
              const rawUser = isFollowersType 
                ? item.follower || item.user 
                : item.following || item.user;

              if (!rawUser || !rawUser.id) return null;

              const isFollowingCalculated = 
                (!isFollowersType && isOwnProfile) ? true : Boolean(rawUser.is_following);

              const listItemUser = {
                id: rawUser.id,
                name: rawUser.name || 'Usuário',
                username: rawUser.username,
                avatar: rawUser.avatar,
                is_following: isFollowingCalculated,
              };

              return (
                <FollowListItem
                  key={item.id || rawUser.id || `user-${index}`}
                  user={listItemUser}
                  onToggleFollow={onToggleFollow}
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