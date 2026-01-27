import { Swap } from "@/types/swap";

const statusColors: Record<string, string> = {
  PENDING: "var(--warning)",
  APPROVED: "var(--success)",
  REJECTED: "var(--error)",
};

export default function SwapCard({ swap }: { swap: Swap }) {
  return (
    <div className="card p-4">
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
          backgroundColor: statusColors[swap.status],
          color: "var(--text-primary)",
        }}
      >
        {swap.status}
      </span>
    </div>
  );
}
