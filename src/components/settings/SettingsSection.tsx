import { memo, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export const SettingsSection = memo(function SettingsSection({
  title,
  icon: Icon,
  children,
}: SettingsSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-bold text-app-text">
        <Icon className="w-4 h-4 text-app-accent" />
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
});