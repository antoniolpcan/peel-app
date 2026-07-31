import { useUser } from '@/hooks/useUsers';
import { UserAvatar } from './UserAvatar';

export function UserBadge({ userId }: { userId: number }) {
  const { user, loading } = useUser(userId);

  if (loading || !user) {
    return (
      <div className="flex items-center gap-2 mb-3 opacity-50 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        <span className="text-xs text-slate-400">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 mb-3">
      <UserAvatar
        name={user.name}
        avatar={user.avatar}
        sizeClass="w-10 h-10"
        textSizeClass="text-xs"
      />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800 leading-tight">
          {user.name}
        </span>
        {user.username && (
          <span className="text-[11px] text-slate-500 font-normal">
            @{user.username}
          </span>
        )}
      </div>
    </div>
  );
}