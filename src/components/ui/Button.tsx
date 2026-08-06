import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = memo(function Button({
  children,
  isLoading = false,
  loadingText,
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const isButtonDisabled = Boolean(disabled || isLoading);

  return (
    <button
      {...props}
      type={type}
      disabled={isButtonDisabled}
      className={`inline-flex items-center justify-center gap-2 bg-app-accent hover:opacity-90 active:scale-[0.98] text-app-accent-text font-semibold px-5 py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 shadow-xs ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || 'Carregando...'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});