import React from 'react';
import { X } from 'lucide-react';

interface ModalLayoutProps {
  children: React.ReactNode;
  onClose: () => void;
  maxWidthClass?: string;
}

export function ModalLayout({ children, onClose, maxWidthClass = 'max-w-xl' }: ModalLayoutProps) {
  return (
    <div
      className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`bg-app-card rounded-3xl p-6 w-full relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto border border-app-border transition-colors ${maxWidthClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center 
            rounded-full bg-app-bg text-app-muted hover:text-app-text hover:scale-105
            active:scale-95 transition-all cursor-pointer border border-app-border/50"
          title="Fechar modal"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}