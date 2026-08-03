import React from 'react';

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
        className={`bg-app-card rounded-3xl p-6 w-full relative shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-app-border transition-colors ${maxWidthClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-app-bg text-app-muted hover:text-app-text transition-colors cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}