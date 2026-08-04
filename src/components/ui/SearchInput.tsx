import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="w-full sm:w-72 relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 text-app-muted shrink-0" />
      </div>

      <input
        type="text"
        placeholder={placeholder || 'Pesquisar...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-app-card border border-app-border 
        rounded-2xl outline-none focus:border-app-accent focus:ring-4 focus:ring-app-accent/10
        transition-all shadow-xs text-app-text placeholder:text-app-muted text-sm"
      />
    </div>
  );
}