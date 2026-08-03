import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  isLoading,
  loadingText,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white 
        font-medium py-3 rounded-xl transition-colors 
        disabled:opacity-50 mt-2 cursor-pointer 
        disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? loadingText || 'Carregando...' : children}
    </button>
  );
}