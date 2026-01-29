import { API_BASE_URL } from "./api";

export interface Message {
  id: number;
  swapId: number;
  senderEmail: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export async function getSwapMessages(swapId: number): Promise<Message[]> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/chat/swap/${swapId}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}

export async function sendMessage(
  swapId: number,
  content: string,
): Promise<Message> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/chat/swap/${swapId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}
