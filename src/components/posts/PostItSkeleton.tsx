export function PostItSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200/60 rounded-2xl p-6 min-h-62.5 animate-pulse flex flex-col justify-between border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-1.5 grow">
              <div className="h-3 bg-gray-300 rounded w-1/3" />
              <div className="h-2 bg-gray-300 rounded w-1/4" />
            </div>
          </div>

          <div className="space-y-2 my-4">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-300 rounded w-full" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-300/40">
            <div className="h-2.5 bg-gray-300 rounded w-16" />
            <div className="h-4 bg-gray-300 rounded w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}