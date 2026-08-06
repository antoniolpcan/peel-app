import React from 'react';

interface PinboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PinboardHeader({ title, subtitle, children }: PinboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-app-accent transition-colors">
          {title}
        </h1>
        {subtitle && (
          <p className="text-app-muted mt-1 text-sm transition-colors">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto lg:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}