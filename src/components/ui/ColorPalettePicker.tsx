import { memo } from 'react';
import { Check } from 'lucide-react';
import type { ColorResponse } from '@/services/types';

interface ColorPalettePickerProps {
  colors: ColorResponse[];
  selectedColorId?: string;
  onSelectColor: (colorId: string) => void;
}

export const ColorPalettePicker = memo(function ColorPalettePicker({ 
  colors = [], 
  selectedColorId, 
  onSelectColor 
}: ColorPalettePickerProps) {
  if (colors.length === 0) return null;

  return (
    <div 
      className="flex gap-2.5 items-center bg-app-card px-3.5 py-2 rounded-2xl border border-app-border transition-colors w-fit max-w-full overflow-x-auto no-scrollbar"
      role="group"
      aria-label="Seleção de cor do post-it"
    >
      <span className="text-xs font-semibold text-app-muted shrink-0 select-none">
        Cor:
      </span>
      
      <div className="flex items-center gap-2 shrink-0">
        {colors.map((color) => {
          const isSelected = selectedColorId === color.id;
          
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
              aria-pressed={isSelected}
              aria-label={`Cor ${color.name}`}
              className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 border border-black/20 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent ${
                isSelected
                  ? 'scale-110 ring-2 ring-app-accent ring-offset-2 ring-offset-app-card shadow-xs z-10'
                  : 'hover:scale-105 active:scale-95 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex_code }}
              title={color.name}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-slate-900 stroke-3 drop-shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});