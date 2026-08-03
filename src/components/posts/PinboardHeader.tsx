import React from 'react';

interface PinboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PinboardHeader({ title, subtitle, children }: PinboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {children && (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}