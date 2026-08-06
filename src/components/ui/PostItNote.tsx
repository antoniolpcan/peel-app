import React, { forwardRef, memo } from 'react';

export interface PostItNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hexCode?: string;
  className?: string;
}

export const PostItNote = memo(
  forwardRef<HTMLDivElement, PostItNoteProps>(function PostItNote(
    { children, hexCode, className = '', style, ...props },
    ref
  ) {
    const backgroundColor = hexCode || '#FEF9C3';

    return (
      <div
        ref={ref}
        {...props}
        className={`rounded-2xl p-6 border border-black/10 text-slate-900 shadow-sm transition-all duration-200 relative ${className}`}
        style={{ backgroundColor, ...style }}
      >
        {children}
      </div>
    );
  })
);