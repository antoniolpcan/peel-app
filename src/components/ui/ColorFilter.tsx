import { memo } from 'react';
import type { ColorResponse } from '@/services/types';

interface ColorFilterProps {
  colors: ColorResponse[];
  selectedColorId: string | null;
  onSelectColor: (colorId: string | null) => void;
}

export const ColorFilter = memo(function ColorFilter({ 
  colors = [], 
  selectedColorId, 
  onSelectColor 
}: ColorFilterProps) {
  if (colors.length === 0) return null;

  return (
    <div 
      className="flex items-center gap-2 bg-app-card px-3 py-2 rounded-2xl border 
      border-app-border shadow-xs max-w-full overflow-x-auto [ms-overflow-style:none] 
      scrollbar-none [&::-webkit-scrollbar]:hidden transition-colors"
      role="group"
      aria-label="Filtro de cores"
    >
      <button
        type="button"
        onClick={() => onSelectColor(null)}
        aria-pressed={selectedColorId === null}
        className={`shrink-0 whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50 ${
          selectedColorId === null
            ? 'bg-app-accent text-app-accent-text shadow-xs'
            : 'text-app-muted hover:text-app-text'
        }`}
      >
        Todos
      </button>

      <div className="h-4 w-px bg-app-border mx-0.5 shrink-0 transition-colors" />

      <div className="flex items-center gap-2 shrink-0 py-1 px-0.5">
        {colors.map((color) => {
          const isSelected = selectedColorId === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(isSelected ? null : color.id)}
              aria-pressed={isSelected}
              aria-label={`Filtrar por cor ${color.name}`}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full cursor-pointer transition-all duration-200 border-2 border-black/20 
                shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent ${
                isSelected
                  ? 'scale-125 border-app-text ring-2 ring-app-accent ring-offset-1 shadow-xs z-10'
                  : 'hover:scale-110 active:scale-95 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: color.hex_code }}
              title={`Filtrar por ${color.name}`}
            />
          );
        })}
      </div>
    </div>
  );
});