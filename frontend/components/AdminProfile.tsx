"use client";

import { useEffect, useState } from "react";

interface AdminStats {
  totalSwaps: number;
  pendingSwaps: number;
  approvedSwaps: number;
  rejectedSwaps: number;
}

interface AdminProfileProps {
  name: string;
  email: string;
}

export default function AdminProfile({ name, email }: AdminProfileProps) {
  const [stats, setStats] = useState<AdminStats>({
    totalSwaps: 0,
    pendingSwaps: 0,
    approvedSwaps: 0,
    rejectedSwaps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch admin swap stats
    const fetchStats = async () => {
      try {
        // Use the existing admin swaps API to get stats
        const response = await fetch("/api/admin/swaps", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const swaps = await response.json();
          const stats: AdminStats = {
            totalSwaps: swaps.length || 0,
            pendingSwaps:
              swaps.filter((s: any) => s.status === "PENDING").length || 0,
            approvedSwaps:
              swaps.filter((s: Swap) => s.status === "APPROVED").length || 0,
            rejectedSwaps:
              swaps.filter((s: any) => s.status === "REJECTED").length || 0,
          };
          setStats(stats);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="card mb-8 p-6">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {name}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">{email}</p>
          <div className="mt-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold
                           bg-[var(--accent-primary)] text-[var(--text-on-accent)]"
            >
              Administrator
            </span>
          </div>
        </div>

        {/* Admin Stats */}
        {loading ? (
          <p className="text-[var(--text-secondary)]">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 rounded-lg">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Total Swaps
              </p>
              <p className="text-3xl font-bold text-[var(--text-primary)]">
                {stats.totalSwaps}
              </p>
            </div>

            <div className="card p-6 rounded-lg">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-500">
                {stats.pendingSwaps}
              </p>
            </div>

            <div className="card p-6 rounded-lg">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-500">
                {stats.approvedSwaps}
              </p>
            </div>

            <div className="card p-6 rounded-lg">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Rejected
              </p>
              <p className="text-3xl font-bold text-red-500">
                {stats.rejectedSwaps}
              </p>
            </div>
          </div>
        )}

        {/* Admin Notice */}
        <div className="mt-8 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
          <p className="text-sm text-[var(--text-secondary)]">
            Go to <strong>Admin</strong> in the navbar to manage swap requests.
          </p>
        </div>
      </div>
    </main>
  );
}
