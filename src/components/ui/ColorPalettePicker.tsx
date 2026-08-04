import { Check } from 'lucide-react';
import type { ColorResponse } from '@/services/types';

interface ColorPalettePickerProps {
  colors: ColorResponse[];
  selectedColorId?: number;
  onSelectColor: (colorId: number) => void;
}

export function ColorPalettePicker({ colors, selectedColorId, onSelectColor }: ColorPalettePickerProps) {
  if (colors.length === 0) return null;

  return (
    <div className="flex gap-2 items-center bg-app-card px-3.5 py-2 
        rounded-2xl border border-app-border transition-colors w-fit">
      <span className="text-xs font-semibold text-app-muted mr-1 select-none">
        Cor:
      </span>
      
      <div className="flex items-center gap-2">
        {colors.map((color) => {
          const isSelected = selectedColorId === color.id;
          
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
              className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center 
                transition-all duration-200 border border-black/20 relative ${
                isSelected
                  ? 'scale-110 ring-2 ring-app-accent ring-offset-2 ring-offset-app-card shadow-sm'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex_code }}
              title={color.name}
            >
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-slate-900/80 drop-shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}