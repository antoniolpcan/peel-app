import { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Skull, 
  Snowflake, 
  Trees, 
  Flower2, 
  Scroll, 
  ChevronDown,
  Check 
} from 'lucide-react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: { id: Theme; label: string; icon: React.ElementType }[] = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Escuro', icon: Moon },
    { id: 'midnight', label: 'Midnight', icon: Sparkles },
    { id: 'dracula', label: 'Dracula', icon: Skull },
    { id: 'nord', label: 'Nord', icon: Snowflake },
    { id: 'emerald', label: 'Emerald', icon: Trees },
    { id: 'sakura', label: 'Sakura', icon: Flower2 },
    { id: 'sepia', label: 'Sépia', icon: Scroll },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-app-card text-app-text border border-app-border 
        px-3 py-1.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all 
        hover:border-app-accent/50 shadow-2xs select-none"
      >
        <CurrentIcon className="w-4 h-4 text-app-accent shrink-0" />
        <span>{currentTheme.label}</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-app-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-app-card border border-app-border rounded-2xl shadow-xl z-50 py-1.5 animate-fadeIn overflow-hidden">
          {themes.map((t) => {
            const isSelected = t.id === theme;
            const ItemIcon = t.icon;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-app-accent/10 text-app-accent font-bold'
                    : 'text-app-text hover:bg-app-bg'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ItemIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-app-accent' : 'text-app-muted'}`} />
                  <span>{t.label}</span>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-app-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}