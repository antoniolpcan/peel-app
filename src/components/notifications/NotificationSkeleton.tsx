import { memo } from 'react';

interface NotificationSkeletonProps {
  count?: number;
}

export const NotificationSkeleton = memo(function NotificationSkeleton({
  count = 4,
}: NotificationSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Carregando notificações..."
      aria-busy="true"
      className="flex flex-col gap-3 py-2"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-3.5 rounded-2xl border border-app-border bg-app-card/30 animate-pulse flex items-center 
            justify-between gap-4 transition-colors"
        >
          <div className="flex items-center gap-3 grow">
            <div className="w-9 h-9 rounded-full bg-app-border/60 shrink-0" />
            <div className="space-y-1.5 grow">
              <div className="h-3 w-3/4 max-w-60 bg-app-border/60 rounded" />
              <div className="h-2.5 w-1/3 max-w-28 bg-app-border/40 rounded" />
            </div>
          </div>
          <div className="h-3 w-8 bg-app-border/40 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
});