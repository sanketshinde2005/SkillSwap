"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { fetchIncomingSwaps, fetchOutgoingSwaps, Swap } from "@/lib/swaps";
import { theme } from "@/lib/theme";
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

      <main
        className="min-h-screen"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1
            className="text-2xl font-semibold mb-6"
            style={{ color: theme.textPrimary }}
          >
            My Swaps
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {["incoming", "outgoing"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as "incoming" | "outgoing")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  backgroundColor:
                    tab === t ? theme.primary : theme.surface,
                  color: tab === t ? "#fff" : theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {t === "incoming" ? "Incoming" : "Outgoing"}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <p style={{ color: theme.textSecondary }}>
              Loading swaps…
            </p>
          )}

          {/* ✅ Empty state (THIS answers your last question) */}
          {!loading && swaps.length === 0 && (
            <p
              className="text-center text-sm mt-10"
              style={{ color: theme.textSecondary }}
            >
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
                  className="rounded-xl border p-4 flex justify-between items-center"
                  style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  }}
                >
                  <div>
                    <h3
                      className="font-medium"
                      style={{ color: theme.textPrimary }}
                    >
                      {swap.skillName}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: theme.textSecondary }}
                    >
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
