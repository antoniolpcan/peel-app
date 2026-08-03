import { UserAvatar } from './UserAvatar';

interface FollowListItemProps {
  user: {
    id: number;
    name: string;
    username?: string;
    avatar?: any;
  };
}

export function FollowListItem({ user }: FollowListItemProps) {
  return (
    <li className="flex items-center gap-4 p-2.5 hover:bg-app-bg/60 rounded-2xl transition-colors cursor-pointer">
      <UserAvatar
        name={user.name}
        avatar={user.avatar}
        size="md"
      />
      <div className="flex flex-col">
        <p className="font-bold text-sm text-app-text transition-colors leading-snug">
          {user.name}
        </p>
        {user.username && (
          <p className="text-xs text-app-muted transition-colors">
            @{user.username}
          </p>
        )}
      </div>
    </li>
  );
}