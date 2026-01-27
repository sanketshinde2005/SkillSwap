"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  fetchAllSwaps,
  approveSwap,
  rejectSwap,
  AdminSwap,
} from "@/lib/adminSwaps";
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

      <main className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
            Admin · Swap Approvals
          </h1>

          {loading && (
            <p className="text-[var(--text-secondary)]">
              Loading swap requests…
            </p>
          )}

          {!loading && swaps.length === 0 && (
            <p className="text-[var(--text-secondary)]">
              No swap requests found.
            </p>
          )}

          <div className="space-y-4">
            {swaps.map((swap) => (
              <div
                key={swap.id}
                className="card p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">
                    {swap.requestedSkillName}
                    {swap.offeredSkillName && (
                      <span className="text-xs text-[var(--text-secondary)]">
                        {" "}
                        ← {swap.offeredSkillName}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {swap.senderEmail} → {swap.receiverEmail}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor:
                        swap.status === "PENDING"
                          ? "var(--warning)"
                          : swap.status === "APPROVED"
                            ? "var(--success)"
                            : "var(--error)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {swap.status}
                  </span>

                  {swap.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(swap.id)}
                        className="px-3 py-1 text-sm rounded-md font-medium transition"
                        style={{
                          backgroundColor: "var(--success)",
                          color: "var(--text-primary)",
                          border: "2px solid var(--border-primary)",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(swap.id)}
                        className="px-3 py-1 text-sm rounded-md font-medium transition"
                        style={{
                          backgroundColor: "var(--error)",
                          color: "var(--text-primary)",
                          border: "2px solid var(--border-primary)",
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
