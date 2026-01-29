"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatBox from "@/components/ChatBox";
import { fetchSwapDetails } from "@/lib/swaps";
import type { SwapDetails } from "@/types/swap";

export default function ChatPage() {
  const params = useParams();
  const swapId = params.swapId as string;
  const [swap, setSwap] = useState<SwapDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!swapId) return;

    const fetchSwap = async () => {
      try {
        setLoading(true);
        const data = await fetchSwapDetails(parseInt(swapId));
        setSwap(data);
      } catch (err: any) {
        console.error("Error fetching swap details:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load swap details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSwap();
  }, [swapId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-[var(--text-secondary)]">Loading chat...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !swap) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-[var(--error)]">
            {error || "Failed to load swap details"}
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  if (swap.status !== "APPROVED") {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="card p-6 text-center">
            <p className="text-[var(--text-primary)] font-semibold">
              Chat not available
            </p>
            <p className="text-[var(--text-secondary)] text-sm mt-2">
              Chat is only available for approved swaps
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="fixed left-0 right-0 top-[80px] bottom-0 bg-[var(--bg-primary)]">
        {/* Chat Component */}
        <ChatBox swapId={parseInt(swapId)} swap={swap} />
      </div>
    </ProtectedRoute>
  );
}
