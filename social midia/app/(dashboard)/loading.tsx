export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="h-14 border-b border-border flex items-center px-6 gap-3">
        <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 bg-card border border-border rounded-xl animate-pulse" />
          <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
