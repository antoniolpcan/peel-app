import React from 'react';

interface LikeButtonProps {
  likes: number;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: 'card' | 'modal';
}

export function LikeButton({ likes, onClick, disabled, variant = 'card' }: LikeButtonProps) {
  if (variant === 'modal') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-1.5 hover:scale-110 active:scale-95 transition-transform 
                cursor-pointer bg-app-card/80 px-3 py-1 rounded-full border border-app-border shadow-2xs
                text-app-text font-medium disabled:opacity-50"
      >
        <span>📌</span> {likes}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 hover:scale-125 transition-transform cursor-pointer disabled:opacity-50"
      title="Fixar/Curtir"
    >
      <span>📌</span> <span className="font-semibold text-app-text">{likes}</span>
    </button>
  );
}