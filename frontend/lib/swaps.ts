import { API_BASE_URL } from "./api";
import type { Swap, SwapDetails } from "@/types/swap";

/* =========================
   STUDENT ACTIONS
========================= */

// ✅ CREATE SWAP (used by SkillCard) - now with offered skill
export async function requestSwap(skillId: number, offeredSkillId: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ skillId, offeredSkillId }),
  });
  return res.json();
}

// ✅ ACCEPT SWAP (Receiver only)
export async function acceptSwap(swapId: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps/${swapId}/accept`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

// ✅ REJECT SWAP (Receiver only)
export async function rejectSwap(swapId: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps/${swapId}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

// ✅ OUTGOING SWAPS
export async function fetchOutgoingSwaps(): Promise<Swap[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps/outgoing`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

// ✅ INCOMING SWAPS
export async function fetchIncomingSwaps(): Promise<Swap[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps/incoming`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

// ✅ Skills already requested by logged-in student
export async function fetchRequestedSkillIds(): Promise<number[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps/requested-skills`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

// ❌ Cancel pending swap request
export async function cancelSwapRequest(skillId: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  await fetch(`${API_BASE_URL}/api/swaps/${skillId}/cancel`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ✅ Get swap details by ID
export async function fetchSwapDetails(swapId: number): Promise<SwapDetails> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps/${swapId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}
