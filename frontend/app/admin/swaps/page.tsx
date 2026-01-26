"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  fetchAllSwaps,
  approveSwap,
  rejectSwap,
  AdminSwap,
} from "@/lib/adminSwaps";
import { theme } from "@/lib/theme";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<AdminSwap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSwaps();
  }, []);

  async function loadSwaps() {
    setLoading(true);
    try {
      const data = await fetchAllSwaps();
      setSwaps(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number) {
    await approveSwap(id);
    loadSwaps();
  }

  async function handleReject(id: number) {
    await rejectSwap(id);
    loadSwaps();
  }

  return (
    <ProtectedRoute role="ADMIN">
      <Navbar />

      <main className="min-h-screen bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1
            className="text-2xl font-semibold mb-6"
            style={{ color: theme.textPrimary }}
          >
            Admin · Swap Approvals
          </h1>

          {loading && (
            <p style={{ color: theme.textSecondary }}>Loading swap requests…</p>
          )}

          {!loading && swaps.length === 0 && (
            <p style={{ color: theme.textSecondary }}>
              No swap requests found.
            </p>
          )}

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
                  <p className="text-sm" style={{ color: theme.textSecondary }}>
                    {swap.senderEmail} → {swap.receiverEmail}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        swap.status === "PENDING"
                          ? "#FEF3C7"
                          : swap.status === "APPROVED"
                            ? "#DCFCE7"
                            : "#FEE2E2",
                      color:
                        swap.status === "PENDING"
                          ? "#92400E"
                          : swap.status === "APPROVED"
                            ? "#166534"
                            : "#991B1B",
                    }}
                  >
                    {swap.status}
                  </span>

                  {swap.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(swap.id)}
                        className="px-3 py-1 text-sm rounded-md"
                        style={{
                          backgroundColor: "#16A34A",
                          color: "#fff",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(swap.id)}
                        className="px-3 py-1 text-sm rounded-md"
                        style={{
                          backgroundColor: "#DC2626",
                          color: "#fff",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
