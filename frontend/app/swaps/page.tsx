"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { fetchIncomingSwaps, fetchOutgoingSwaps, Swap } from "@/lib/swaps";
import StatusPill from "@/components/StatusPill";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SwapsPage() {
  const [tab, setTab] = useState<"incoming" | "outgoing">("incoming");
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetcher =
      tab === "incoming" ? fetchIncomingSwaps : fetchOutgoingSwaps;

    fetcher()
      .then(setSwaps)
      .catch(() => setSwaps([]))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <ProtectedRoute>
      <Navbar />

      <main className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
            My Swaps
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {["incoming", "outgoing"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as "incoming" | "outgoing")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition border-2"
                style={{
                  backgroundColor:
                    tab === t ? "var(--accent-primary)" : "var(--bg-card)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                }}
              >
                {t === "incoming" ? "Incoming" : "Outgoing"}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-[var(--text-secondary)]">Loading swaps…</p>
          )}

          {/* ✅ Empty state (THIS answers your last question) */}
          {!loading && swaps.length === 0 && (
            <p className="text-center text-sm mt-10 text-[var(--text-secondary)]">
              {tab === "incoming" ? (
                <>
                  No swap requests yet.
                  <br />
                  When someone requests your skill, it will appear here.
                </>
              ) : (
                <>
                  You haven’t requested any swaps yet.
                  <br />
                  Browse skills and send a request to get started.
                </>
              )}
            </p>
          )}

          {/* Swap cards */}
          {!loading && swaps.length > 0 && (
            <div className="space-y-4">
              {swaps.map((swap) => (
                <div
                  key={swap.id}
                  className="card p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">
                      {swap.skillName}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {tab === "incoming"
                        ? `From: ${swap.senderEmail}`
                        : `To: ${swap.receiverEmail}`}
                    </p>
                  </div>

                  {/* ✅ StatusPill used here */}
                  <StatusPill status={swap.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
