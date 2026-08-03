import type { ColorResponse } from '@/services/types';

interface ColorPalettePickerProps {
  colors: ColorResponse[];
  selectedColorId?: number;
  onSelectColor: (colorId: number) => void;
}

export function ColorPalettePicker({ colors, selectedColorId, onSelectColor }: ColorPalettePickerProps) {
  if (colors.length === 0) return null;

  return (
    <div className="flex gap-2.5 items-center bg-app-card px-3 py-2 
        rounded-2xl border border-app-border transition-colors">
      <span className="text-xs font-semibold text-app-muted mr-1">Cor:</span>
      {colors.map((color) => {
        const isSelected = selectedColorId === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelectColor(color.id)}
            className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 border-slate-900/40 ${
              isSelected
                ? 'scale-125 border-app-text ring-2 ring-indigo-500 ring-offset-2 shadow-md'
                : 'hover:scale-110 opacity-90 hover:border-app-text'
            }`}
            style={{ backgroundColor: color.hex_code }}
            title={color.name}
          />
        );
      })}
    </div>
  );
}