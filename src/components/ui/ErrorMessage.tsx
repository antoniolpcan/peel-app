import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage = memo(function ErrorMessage({
  message,
  className = '',
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm rounded-2xl border border-red-200 dark:border-red-800/50 flex items-center justify-center gap-2 text-center transition-all animate-in fade-in duration-200 ${className}`}
    >
      <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
      <span className="font-medium">{message}</span>
    </div>
  );
});