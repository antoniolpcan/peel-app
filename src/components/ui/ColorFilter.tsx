import type { ColorResponse } from '@/services/types';

interface ColorFilterProps {
  colors: ColorResponse[];
  selectedColorId: number | null;
  onSelectColor: (colorId: number | null) => void;
}

export function ColorFilter({ colors, selectedColorId, onSelectColor }: ColorFilterProps) {
  if (colors.length === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-app-card px-3 py-2.5 rounded-2xl 
        border border-app-border shadow-xs self-start sm:self-auto justify-center transition-colors">
      <button
        type="button"
        onClick={() => onSelectColor(null)}
        className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
          selectedColorId === null
            ? 'bg-app-accent text-app-accent-text shadow-xs'
            : 'text-app-muted hover:text-app-text'
        }`}
      >
        Todos
      </button>

      <div className="h-4 w-px bg-app-border mx-1 transition-colors" />

      {colors.map((color) => {
        const isSelected = selectedColorId === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelectColor(isSelected ? null : color.id)}
            className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 border-slate-900/30 ${
              isSelected
                ? 'scale-125 border-app-text ring-2 bg-app-accent ring-offset-1 shadow-xs'
                : 'hover:scale-110 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: color.hex_code }}
            title={`Filtrar por ${color.name}`}
          />
        );
      })}
    </div>
  );
}