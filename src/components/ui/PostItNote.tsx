import React from 'react';

interface PostItNoteProps {
  children: React.ReactNode;
  hexCode?: string;
  className?: string;
}

export function PostItNote({ children, hexCode, className = '' }: PostItNoteProps) {
  return (
    <div
      className={`rounded-2xl p-6 border border-black/5 transition-colors ${className}`}
      style={{ backgroundColor: hexCode || '#FEF9C3' }}
    >
      {children}
    </div>
  );
}