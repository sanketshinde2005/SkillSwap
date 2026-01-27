export default function SkeletonCard() {
  return (
    <div className="animate-pulse card p-4 space-y-3">
      <div className="h-4 bg-[var(--border-secondary)] rounded w-1/2" />
      <div className="h-3 bg-[var(--border-secondary)] rounded w-3/4" />
      <div className="h-8 bg-[var(--border-secondary)] rounded mt-4" />
    </div>
  );
}
