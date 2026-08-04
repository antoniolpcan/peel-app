import React from 'react';
import { Pin } from 'lucide-react';

interface LikeButtonProps {
  likes: number;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: 'card' | 'modal';
  isLiked?: boolean;
}

export function LikeButton({
  likes,
  onClick,
  disabled,
  isLiked = false,
}: LikeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs 
        transition-all cursor-pointer shadow-xs border disabled:opacity-50 active:scale-95 select-none ${
          isLiked
            ? 'bg-app-accent text-app-accent-text border-app-accent shadow-sm scale-105'
            : 'bg-white/80 hover:bg-white text-slate-800 border-black/10 hover:border-black/20'
        }`}
      title={isLiked ? 'Desfixar / Descurtir' : 'Fixar / Curtir'}
    >
      <Pin
        className={`w-3.5 h-3.5 transition-all ${
          isLiked
            ? 'fill-current text-app-accent-text rotate-12'
            : 'text-slate-700 -rotate-45'
        }`}
      />
      <span>{likes}</span>
    </button>
  );
}