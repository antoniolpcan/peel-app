import { ModalLayout } from '@/components/ui/ModalLayout';
import { FollowListItem } from './FollowListItem';

interface UserListItem {
  id: number;
  follower?: { id: number; name: string; username?: string; avatar?: any };
  following?: { id: number; name: string; username?: string; avatar?: any };
}

interface FollowListModalProps {
  type: 'followers' | 'following' | null;
  loading: boolean;
  users: UserListItem[];
  onClose: () => void;
}

export function FollowListModal({ type, loading, users, onClose }: FollowListModalProps) {
  if (!type) return null;

  return (
    <ModalLayout onClose={onClose} maxWidthClass="max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-app-text transition-colors">
          {type === 'followers' ? 'Seguidores' : 'Seguindo'}
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 pr-2 max-h-[60vh]">
        {loading ? (
          <p className="text-center text-app-muted py-6">Carregando...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-app-muted py-6">Nenhum usuário encontrado.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {users.map((item) => {
              const listItemUser = type === 'followers' ? item.follower : item.following;
              if (!listItemUser) return null;

              return <FollowListItem key={item.id} user={listItemUser} />;
            })}
          </ul>
        )}
      </div>
    </ModalLayout>
  );
}