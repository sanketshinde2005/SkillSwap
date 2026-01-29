import { API_BASE_URL } from "./api";

export interface Notification {
  type: string; // "MESSAGE", "SWAP_APPROVED", "SWAP_REJECTED"
  swapId: number;
  from?: string; // For MESSAGE
  content?: string; // For MESSAGE
  skill?: string; // For SWAP events
  otherUser?: string; // For SWAP events
  status?: string; // For SWAP events
  timestamp: string;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/notifications`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}
