import React, { useState, useCallback, memo } from 'react';
import { UserPlus, UserCheck, UserMinus, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  isFollowing: boolean;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'sm' | 'md';
}

export const FollowButton = memo(function FollowButton({
  isFollowing,
  isLoading = false,
  onClick,
  size = 'md',
}: FollowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses =
    size === 'sm' 
      ? 'px-3 py-1.5 text-xs gap-1.5 min-w-[100px]' 
      : 'px-5 py-2.5 text-sm gap-2 min-w-[125px]';

  const iconSizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      onClick(e);
    }
  }, [isLoading, onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
      aria-label={isFollowing ? 'Deixar de seguir usuário' : 'Seguir usuário'}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 active:scale-95 select-none ${sizeClasses} ${
        isFollowing
          ? 'bg-app-card text-app-text border border-app-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
          : 'bg-app-accent text-app-accent-text hover:opacity-90 shadow-sm'
      }`}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizeClass} animate-spin shrink-0`} />
      ) : isFollowing ? (
        isHovered ? (
          <>
            <UserMinus className={`${iconSizeClass} shrink-0`} />
            <span>Deixar de seguir</span>
          </>
        ) : (
          <>
            <UserCheck className={`${iconSizeClass} shrink-0 text-app-accent`} />
            <span>Seguindo</span>
          </>
        )
      ) : (
        <>
          <UserPlus className={`${iconSizeClass} shrink-0`} />
          <span>Seguir</span>
        </>
      )}
    </button>
  );
});