export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-[var(--border)] p-4 space-y-3 bg-[var(--surface)]">
      <div className="h-4 bg-[var(--border)] rounded w-1/2" />
      <div className="h-3 bg-[var(--border)] rounded w-3/4" />
      <div className="h-8 bg-[var(--border)] rounded mt-4" />
    </div>
  );
}
