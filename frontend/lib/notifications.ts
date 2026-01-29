import api from "./api";

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
  const response = await api.get("/api/notifications");
  return response.data;
}
