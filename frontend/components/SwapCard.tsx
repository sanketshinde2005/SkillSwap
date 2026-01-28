import { Swap } from "@/types/swap";
import StatusPill from "@/components/StatusPill";
import { acceptSwap, rejectSwap } from "@/lib/swaps";
import { useState } from "react";
import Link from "next/link";

interface Props {
  swap: Swap;
  isIncoming: boolean;
  onAction?: () => void;
}

export default function SwapCard({ swap, isIncoming, onAction }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setLoading(true);
    setError("");
    try {
      await acceptSwap(swap.id);
      onAction?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to accept swap");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    setError("");
    try {
      await rejectSwap(swap.id);
      onAction?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reject swap");
    } finally {
      setLoading(false);
    }
  }

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
      <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
        Skill Swap
      </h3>

      <div className="text-sm text-[var(--text-primary)] space-y-2">
        {/* YOU GET / THEY OFFER */}
        <div>
          <p className="text-xs text-[var(--text-muted)] mb-1">
            {isIncoming ? "You Get" : "They Get"}
          </p>
          <p className="font-medium text-[var(--accent-primary)]">
            {swap.requestedSkillName}
          </p>
        </div>

        {/* YOU OFFER / THEY OFFER */}
        {swap.offeredSkillName && (
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              {isIncoming ? "They Offer" : "You Offer"}
            </p>
            <p className="font-medium text-[var(--accent-secondary)]">
              {swap.offeredSkillName}
            </p>
          </div>
        )}

        {/* PERSON INFO */}
        <div className="text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-secondary)]">
          {isIncoming ? (
            <p>
              From: <strong>{swap.senderEmail}</strong>
            </p>
          ) : (
            <p>
              To: <strong>{swap.receiverEmail}</strong>
            </p>
          )}
        </div>
      </div>

      {/* STATUS & ACTIONS */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <StatusPill status={swap.status} />

        {/* ACTION BUTTONS FOR INCOMING PENDING SWAPS */}
        {isIncoming && swap.status === "PENDING" && (
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="
                px-3 py-1 text-xs font-medium rounded-lg
                bg-[var(--accent-primary)]
                text-[var(--text-primary)]
                hover:opacity-90
                disabled:opacity-50
                transition
              "
            >
              {loading ? "..." : "Accept"}
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="
                px-3 py-1 text-xs font-medium rounded-lg
                bg-[var(--error)]
                text-white
                hover:opacity-90
                disabled:opacity-50
                transition
              "
            >
              {loading ? "..." : "Reject"}
            </button>
          </div>
        )}

        {/* CHAT BUTTON FOR APPROVED SWAPS */}
        {swap.status === "APPROVED" && (
          <Link href={`/chat/${swap.id}`}>
            <button
              className="
                px-3 py-1 text-xs font-medium rounded-lg
                bg-[var(--accent-primary)]
                text-[var(--text-primary)]
                hover:opacity-90
                transition
              "
            >
              💬 Chat
            </button>
          </Link>
        )}
      </div>

      {error && <p className="text-xs mt-2 text-[var(--error)]">{error}</p>}
    </div>
  );
}
