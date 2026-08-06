import { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Skull, 
  Snowflake, 
  Trees, 
  Flower2, 
  Scroll, 
  Check, 
  X 
} from 'lucide-react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';

interface ThemePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTheme: (theme: Theme) => Promise<void>;
}

const THEME_LIST: { id: Theme; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Claro', icon: Sun },
  { id: 'dark', label: 'Escuro', icon: Moon },
  { id: 'midnight', label: 'Midnight', icon: Sparkles },
  { id: 'dracula', label: 'Dracula', icon: Skull },
  { id: 'nord', label: 'Nord', icon: Snowflake },
  { id: 'emerald', label: 'Emerald', icon: Trees },
  { id: 'sakura', label: 'Sakura', icon: Flower2 },
  { id: 'sepia', label: 'Sépia', icon: Scroll },
];

export function ThemePreviewModal({ isOpen, onClose, onSaveTheme }: ThemePreviewModalProps) {
  const { theme: currentTheme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme);
  const [saving, setSaving] = useState(false);
  
  const initialThemeRef = useRef<Theme>(currentTheme);

  useEffect(() => {
    if (isOpen) {
      initialThemeRef.current = currentTheme;
      setSelectedTheme(currentTheme);
    }
  }, [isOpen, currentTheme]);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: Theme) => {
    setSelectedTheme(themeId);
    setTheme(themeId);
  };

  const handleCancel = () => {
    setTheme(initialThemeRef.current);
    onClose();
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onSaveTheme(selectedTheme);
      onClose();
    } catch {
      setTheme(initialThemeRef.current);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-app-card border border-app-border rounded-3xl w-full max-w-xl p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-app-text">Aparência da Aplicação</h2>
            <p className="text-xs text-app-muted">Escolha um tema para personalizar sua experiência.</p>
          </div>
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-app-bg text-app-muted hover:text-app-text transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-app-muted uppercase tracking-wider">
            Prévia
          </span>
          
          <div className="p-4 rounded-2xl border bg-app-bg border-app-border text-app-text transition-all duration-300">
            <div className="flex gap-3">
              <div className="w-12 h-24 rounded-lg bg-app-card border border-app-border flex flex-col gap-1.5 p-1.5">
                <div className="w-full h-3 rounded bg-app-accent" />
                <div className="w-3/4 h-2 rounded bg-app-text/30" />
                <div className="w-1/2 h-2 rounded bg-app-text/30" />
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <div className="h-6 rounded-lg w-full bg-app-card border border-app-border flex items-center justify-between px-2">
                  <div className="w-12 h-2 rounded bg-app-text/40" />
                  <div className="w-4 h-4 rounded-full bg-app-accent" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-app-card border border-app-border">
                    <div className="w-8 h-2 rounded bg-app-text/40 mb-1" />
                    <div className="w-12 h-3 rounded bg-app-accent" />
                  </div>
                  <div className="p-2 rounded-lg bg-app-card border border-app-border">
                    <div className="w-8 h-2 rounded bg-app-text/40 mb-1" />
                    <div className="w-10 h-3 rounded bg-app-text/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {THEME_LIST.map(({ id, label, icon: Icon }) => {
            const isSelected = selectedTheme === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectTheme(id)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-app-accent bg-app-accent/10 text-app-accent font-semibold shadow-xs'
                    : 'border-app-border hover:bg-app-bg text-app-text'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs truncate">{label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-app-border/50">
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-app-muted hover:text-app-text hover:bg-app-bg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-app-accent text-app-accent-text hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Aplicando...' : 'Aplicar Tema'}
          </button>
        </div>

      </div>
    </div>
  );
}