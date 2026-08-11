import React, { memo } from 'react';
import { Pin } from 'lucide-react';

interface LikeButtonProps {
  likes?: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'card' | 'modal';
  isLiked?: boolean;
  className?: string;
}

function formatLikes(count: number): string {
  if (count >= 10000) {
    return Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(count);
  }
  return count.toLocaleString('pt-BR');
}

export const LikeButton = memo(function LikeButton({
  likes = 0,
  onClick,
  disabled = false,
  variant = 'card',
  isLiked = false,
  className = '',
}: LikeButtonProps) {
  const isModal = variant === 'modal';

  const sizeClasses = isModal 
    ? 'px-3.5 py-1.5 text-sm gap-2' 
    : 'px-3 py-1 text-xs gap-1.5';

  const iconSizeClass = isModal ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isLiked}
      aria-label={isLiked ? 'Desfixar post-it' : 'Fixar post-it'}
      className={`inline-flex items-center rounded-full font-bold transition-all cursor-pointer shadow-xs border disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 active:scale-95 select-none ${sizeClasses} ${
        isLiked
          ? 'bg-app-accent text-app-accent-text border-app-accent shadow-sm scale-105'
          : 'bg-white/80 hover:bg-white text-slate-800 border-black/10 hover:border-black/20'
      } ${className}`}
      title={isLiked ? 'Desfixar / Descurtir' : 'Fixar / Curtir'}
    >
      <Pin
        className={`${iconSizeClass} transition-transform duration-200 shrink-0 ${
          isLiked
            ? 'fill-current text-app-accent-text rotate-12'
            : 'text-slate-700 -rotate-45'
        }`}
      />
      <span>{formatLikes(likes)}</span>
    </button>
  );
});