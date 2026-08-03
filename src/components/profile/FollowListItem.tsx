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
    <li className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
      <UserAvatar
        name={user.name}
        avatar={user.avatar}
        sizeClass="w-12 h-12"
        textSizeClass="text-lg"
      />
      <div>
        <p className="font-bold text-slate-800">{user.name}</p>
        <p className="text-sm text-gray-500">
          {user.username ? `@${user.username}` : ''}
        </p>
      </div>
    </li>
  );
}