import React from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';

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
  
  const sizeClasses =
    size === 'sm' ? 'px-3 py-1.5 text-xs gap-1.5 min-w-22' : 'px-5 py-2.5 text-sm gap-2 min-w-28';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60 active:scale-95 select-none ${sizeClasses} ${
        isFollowing
          ? 'bg-app-card text-app-text border border-app-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
          : 'bg-app-accent text-app-accent-text hover:opacity-90 shadow-sm'
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Seguindo</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5 shrink-0" />
          <span>Seguir</span>
        </>
      )}
    </button>
  );
}