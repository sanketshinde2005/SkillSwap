import { Swap } from "@/types/swap";
import StatusPill from "@/components/StatusPill";

export default function SwapCard({ swap }: { swap: Swap }) {
  return (
    <div
      className="
        rounded-2xl
        p-5
        border-2
        bg-[var(--bg-card)]
        border-[var(--border-primary)]
        shadow-[3px_3px_0px_var(--border-primary)]
      "
    >
      <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-2">
        Skill Swap
      </h3>

      <div className="text-sm text-[var(--text-primary)] space-y-1">
        <p>
          <strong>Skill:</strong> {swap.skillName}
        </p>
      </div>

      <div className="mt-4">
        <StatusPill status={swap.status} />
      </div>
    </div>
  );
}
