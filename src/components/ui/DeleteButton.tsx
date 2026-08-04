import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export function DeleteButton({ onClick, disabled }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center p-1.5 rounded-full 
        bg-white/80 hover:bg-white text-app-accent border border-black/10 
        hover:border-app-accent hover:scale-110 active:scale-95 transition-all 
        cursor-pointer shadow-xs disabled:opacity-50 select-none group"
      title="Excluir Post-it"
    >
      <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
    </button>
  );
}