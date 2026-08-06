import React, { forwardRef, memo } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = memo(
  forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    { className = '', disabled, ...props },
    ref
  ) {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        {...props}
        className={`w-full p-3 bg-app-card border border-app-border text-app-text 
          placeholder:text-app-muted rounded-xl outline-none focus:border-app-accent 
          focus:ring-2 focus:ring-app-accent/20 resize-none text-sm transition-all 
          disabled:opacity-50 disabled:cursor-not-allowed shadow-xs ${className}`}
      />
    );
  })
);