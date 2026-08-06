import React, { forwardRef, memo, useCallback } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  containerClassName?: string;
}

export const SearchInput = memo(
  forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
    {
      value,
      onChange,
      onClear,
      placeholder = 'Pesquisar...',
      containerClassName = '',
      className = '',
      ...props
    },
    ref
  ) {
    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onChange('');
        if (onClear) onClear();
      },
      [onChange, onClear]
    );

    return (
      <div className={`w-full sm:w-72 relative ${containerClassName}`}>

        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-app-muted shrink-0" />
        </div>

        <input
          ref={ref}
          type="text"
          role="searchbox"
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 ${
            value ? 'pr-9' : 'pr-4'
          } py-2.5 bg-app-card border border-app-border rounded-2xl outline-none focus:border-app-accent focus:ring-4 focus:ring-app-accent/10 transition-all shadow-xs text-app-text placeholder:text-app-muted text-sm ${className}`}
          {...props}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar pesquisa"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-app-muted hover:text-app-text cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 rounded-r-2xl"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>
    );
  })
);