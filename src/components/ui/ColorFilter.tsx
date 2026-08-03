import type { ColorResponse } from '@/services/types';

interface ColorFilterProps {
  colors: ColorResponse[];
  selectedColorId: number | null;
  onSelectColor: (colorId: number | null) => void;
}

export function ColorFilter({ colors, selectedColorId, onSelectColor }: ColorFilterProps) {
  if (colors.length === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-2xl 
        border border-gray-200 shadow-sm self-start sm:self-auto justify-center">
      <button
        type="button"
        onClick={() => onSelectColor(null)}
        className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
          selectedColorId === null
            ? 'bg-slate-800 text-white shadow-xs'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Todos
      </button>

      <div className="h-4 w-px bg-gray-200 mx-1" />

      {colors.map((color) => {
        const isSelected = selectedColorId === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelectColor(isSelected ? null : color.id)}
            className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 border-slate-900/30 ${
              isSelected
                ? 'scale-125 border-slate-900 ring-2 ring-indigo-500 ring-offset-1 shadow-sm'
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