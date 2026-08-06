import { memo } from 'react';

interface FollowStatsProps {
  followersCount?: number;
  followingCount?: number;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
  size?: 'sm' | 'md';
}

function formatCount(count: number): string {
  if (count >= 10000) {
    return Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(count);
  }
  return count.toLocaleString('pt-BR');
}

export const FollowStats = memo(function FollowStats({
  followersCount = 0,
  followingCount = 0,
  onOpenFollowers,
  onOpenFollowing,
  size = 'md',
}: FollowStatsProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-4 ${textSize}`}>
      <button
        type="button"
        onClick={onOpenFollowers}
        disabled={!onOpenFollowers}
        className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 rounded-md enabled:cursor-pointer disabled:cursor-default"
      >
        <span className="font-bold text-app-text transition-colors group-enabled:group-hover:text-app-accent group-enabled:group-hover:underline">
          {formatCount(followersCount)}
        </span>{' '}
        <span className="text-app-muted transition-colors">Seguidores</span>
      </button>

      <button
        type="button"
        onClick={onOpenFollowing}
        disabled={!onOpenFollowing}
        className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 rounded-md enabled:cursor-pointer disabled:cursor-default"
      >
        <span className="font-bold text-app-text transition-colors group-enabled:group-hover:text-app-accent group-enabled:group-hover:underline">
          {formatCount(followingCount)}
        </span>{' '}
        <span className="text-app-muted transition-colors">Seguindo</span>
      </button>
    </div>
  );
});