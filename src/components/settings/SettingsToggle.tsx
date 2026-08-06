import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SettingsToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  disabledLabel?: string;
}

export const SettingsToggle = memo(function SettingsToggle({
  label,
  checked,
  onChange,
  icon: Icon,
  disabled = false,
  disabledLabel = 'Em breve',
}: SettingsToggleProps) {
  return (
    <div
      onClick={disabled ? undefined : onChange}
      className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
        disabled
          ? 'opacity-50 cursor-not-allowed select-none bg-app-bg/20'
          : 'hover:bg-app-bg/50 cursor-pointer select-none'
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-app-muted" />}
        <span className="text-sm text-app-text font-medium">{label}</span>
        {disabled && (
          <span className="text-[10px] bg-app-border/80 text-app-muted font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {disabledLabel}
          </span>
        )}
      </div>

      <div
        className={`w-11 h-6 rounded-full transition-colors relative ${
          disabled
            ? 'bg-app-border/60'
            : checked
            ? 'bg-app-accent'
            : 'bg-app-border'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
            checked && !disabled ? 'right-0.5' : 'left-0.5'
          }`}
        />
      </div>
    </div>
  );
});