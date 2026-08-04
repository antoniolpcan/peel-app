import { useNavigate } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { FollowButton } from '../ui/FollowButton';

interface FollowListItemProps {
  user: {
    id: number;
    name: string;
    username?: string;
    avatar?: any;
    is_following?: boolean;
  };
  isLoading?: boolean;
  onToggleFollow?: (userId: number) => void;
  onCloseModal?: () => void;
}

export function FollowListItem({ user, isLoading, onToggleFollow, onCloseModal }: FollowListItemProps) {
  const navigate = useNavigate();
  const { loggedUserId, isAuthenticated } = useAuth();

  const isOwnUser = loggedUserId === user.id;

  const handleUserClick = () => {
    if (onCloseModal) onCloseModal();
    navigate(`/perfil/${user.id}`);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFollow) {
      onToggleFollow(user.id);
    }
  };

  return (
    <li 
      onClick={handleUserClick}
      className="flex items-center justify-between gap-3 p-2.5 hover:bg-app-bg/60 rounded-2xl transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar
          name={user.name}
          avatar={user.avatar}
          size="md"
        />
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
      {isAuthenticated && !isOwnUser && onToggleFollow && (
        <div className="shrink-0">
          <FollowButton
            size="sm"
            isFollowing={Boolean(user.is_following)}
            isLoading={isLoading}
            onClick={handleFollowClick}
          />
        </div>
      )}
    </li>
  );
}