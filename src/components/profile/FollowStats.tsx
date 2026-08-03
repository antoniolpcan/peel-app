interface FollowStatsProps {
  followersCount?: number;
  followingCount?: number;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
  size?: 'sm' | 'md';
}

export function FollowStats({
  followersCount = 0,
  followingCount = 0,
  onOpenFollowers,
  onOpenFollowing,
  size = 'md',
}: FollowStatsProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex gap-4 ${textSize}`}>
      <button
        type="button"
        onClick={onOpenFollowers}
        disabled={!onOpenFollowers}
        className={`hover:underline cursor-pointer ${!onOpenFollowers ? 'cursor-default no-underline' : ''}`}
      >
        <span className="font-bold text-app-text transition-colors">{followersCount}</span>{' '}
        <span className="text-app-muted transition-colors">Seguidores</span>
      </button>

      <button
        type="button"
        onClick={onOpenFollowing}
        disabled={!onOpenFollowing}
        className={`hover:underline cursor-pointer ${!onOpenFollowing ? 'cursor-default no-underline' : ''}`}
      >
        <span className="font-bold text-app-text transition-colors">{followingCount}</span>{' '}
        <span className="text-app-muted transition-colors">Seguindo</span>
      </button>
    </div>
  );
}