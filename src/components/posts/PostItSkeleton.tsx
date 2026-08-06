interface PostItSkeletonProps {
  count?: number;
}

const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];

export function PostItSkeleton({ count = 6 }: PostItSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-app-card rounded-2xl p-6 min-h-62.5 animate-pulse flex flex-col 
            justify-between border border-app-border transition-colors ${
              ROTATIONS[i % ROTATIONS.length]
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-app-border shrink-0" />
            <div className="flex flex-col gap-1.5 grow">
              <div className="h-3 bg-app-border rounded w-1/3" />
              <div className="h-2 bg-app-border rounded w-1/4" />
            </div>
          </div>

          <div className="space-y-2.5 my-4">
            <div className="h-4 bg-app-border rounded w-3/4 mb-3" />
            <div className="h-3 bg-app-border/80 rounded w-full" />
            <div className="h-3 bg-app-border/80 rounded w-5/6" />
            <div className="h-3 bg-app-border/60 rounded w-2/3" />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-app-border">
            <div className="h-2.5 bg-app-border rounded w-16" />
            <div className="h-4 bg-app-border rounded w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}