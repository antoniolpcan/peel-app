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
                cursor-pointer bg-white/60 px-3 py-1 rounded-full border border-black/5 shadow-2xs
                text-slate-800 font-medium disabled:opacity-50"
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
      <span>📌</span> <span className="font-semibold">{likes}</span>
    </button>
  );
}