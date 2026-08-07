import React, { forwardRef, memo } from 'react';

export interface PostItNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hexCode?: string;
  className?: string;
  showTape?: boolean;
}

export const PostItNote = memo(
  forwardRef<HTMLDivElement, PostItNoteProps>(function PostItNote(
    { children, hexCode, className = '', showTape = true, style, ...props },
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
        {showTape && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 shadow-xs -rotate-1 backdrop-blur-xs rounded-xs pointer-events-none border border-white/20 z-10" />
        )}

        {children}
      </div>
    );
  })
);