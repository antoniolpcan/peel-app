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
          ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
      }`}
    >
      {isLoading ? '...' : isFollowing ? 'Seguindo' : 'Seguir'}
    </button>
  );
}