import { API_BASE_URL } from "./api";

export interface AdminSwap {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  requestedSkillName: string;
  skillName?: string; // Alias for compatibility
  offeredSkillName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export async function fetchAllSwaps(): Promise<AdminSwap[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/swaps`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  return data.content; // because backend is paginated
}

export async function approveSwap(id: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  await fetch(`${API_BASE_URL}/api/swaps/${id}/approve-admin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function rejectSwap(id: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  await fetch(`${API_BASE_URL}/api/swaps/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
