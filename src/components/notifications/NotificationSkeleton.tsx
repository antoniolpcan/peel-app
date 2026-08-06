import { memo } from 'react';

export const NotificationSkeleton = memo(function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl border border-app-border bg-app-card/30 animate-pulse flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-app-border/60 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3 w-40 bg-app-border/60 rounded" />
              <div className="h-2.5 w-24 bg-app-border/40 rounded" />
            </div>
          </div>
          <div className="h-3 w-8 bg-app-border/40 rounded" />
        </div>
      ))}
    </div>
  );
});