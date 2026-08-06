import React, { forwardRef, memo } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(function Input(
    { className = '', disabled, ...props },
    ref
  ) {
    return (
      <input
        ref={ref}
        disabled={disabled}
        {...props}
        className={`w-full p-3 bg-app-card border border-app-border text-app-text placeholder:text-app-muted rounded-xl outline-none focus:border-app-accent focus:ring-2 focus:ring-app-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs ${className}`}
      />
    );
  })
);