import { Swap } from "@/types/swap";
import { theme } from "@/lib/theme";

const remind: Record<string, string> = {
  PENDING: "#facc15",
  APPROVED: "#22c55e",
  REJECTED: "#ef4444",
};

export default function SwapCard({ swap }: { swap: Swap }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4 shadow-sm bg-[var(--surface)]">
      <h3 className="font-semibold mb-1 text-[var(--text-primary)]">
        {swap.skillName}
      </h3>

      <p className="text-sm text-[var(--text-secondary)]">
        From: {swap.senderEmail}
      </p>

      <p className="text-sm text-[var(--text-secondary)]">
        To: {swap.receiverEmail}
      </p>

      <span
        className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full"
        style={{
          backgroundColor: remind[swap.status],
          color: "#000",
        }}
      >
        {swap.status}
      </span>
    </div>
  );
}
