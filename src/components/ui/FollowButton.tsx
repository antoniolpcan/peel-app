interface FollowButtonProps {
  isFollowing: boolean;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
}

export function FollowButton({
  isFollowing,
  isLoading,
  onClick,
  size = 'md',
}: FollowButtonProps) {
  const sizeClasses = size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2.5 text-sm';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`${sizeClasses} rounded-xl font-medium transition-all cursor-pointer shadow-2xs ${
        isFollowing
          ? 'bg-app-bg text-app-text hover:bg-rose-500/10 hover:text-rose-500 border border-app-border'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {isLoading ? '...' : isFollowing ? 'Seguindo' : 'Seguir'}
    </button>
  );
}