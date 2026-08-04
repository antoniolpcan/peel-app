import { Users, Loader2 } from 'lucide-react';
import { ModalLayout } from '@/components/layout/ModalLayout';
import { FollowListItem } from './FollowListItem';

interface UserListItem {
  id: number;
  follower?: { id: number; name: string; username?: string; avatar?: any; is_following?: boolean };
  following?: { id: number; name: string; username?: string; avatar?: any; is_following?: boolean };
}

interface FollowListModalProps {
  type: 'followers' | 'following' | null;
  loading: boolean;
  users: UserListItem[];
  onClose: () => void;
  onToggleFollow?: (userId: number) => void;
  isOwnProfile?: boolean;
}

export function FollowListModal({ 
  type, 
  loading, 
  users, 
  onClose,
  onToggleFollow,
  isOwnProfile = true
}: FollowListModalProps) {
  if (!type) return null;

  return (
    <ModalLayout onClose={onClose} maxWidthClass="max-w-md">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-app-border">
        <h2 className="text-xl font-bold text-app-text flex items-center gap-2 transition-colors">
          <Users className="w-5 h-5 text-app-accent" />
          <span>{type === 'followers' ? 'Seguidores' : 'Seguindo'}</span>
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 pr-1 max-h-[60vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-app-muted gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-app-accent" />
            <span className="text-sm font-medium">Carregando lista...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-app-muted gap-2">
            <Users className="w-8 h-8 opacity-40" />
            <p className="text-sm font-medium">Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {users.map((item) => {
              const rawUser = type === 'followers' ? item.follower : item.following;
              if (!rawUser) return null;

              const isFollowingCalculated = 
                (type === 'following' && isOwnProfile) ? true : Boolean(rawUser.is_following);

              const listItemUser = {
                ...rawUser,
                is_following: isFollowingCalculated
              };

              return (
                <FollowListItem
                  key={item.id}
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
}