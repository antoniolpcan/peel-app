import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
  className?: string;
}

export const DeleteButton = memo(function DeleteButton({
  onClick,
  disabled = false,
  title = 'Excluir',
  className = '',
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center p-1.5 rounded-full bg-white/80 hover:bg-white text-app-accent border border-black/10 hover:border-app-accent hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 select-none group ${className}`}
    >
      <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12 shrink-0" />
    </button>
  );
});