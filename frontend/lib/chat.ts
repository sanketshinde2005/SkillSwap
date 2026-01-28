import api from "./api";

export interface Message {
  id: number;
  swapId: number;
  senderEmail: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export async function getSwapMessages(swapId: number): Promise<Message[]> {
  const response = await api.get(`/api/chat/swap/${swapId}`);
  return response.data;
}

export async function sendMessage(
  swapId: number,
  content: string,
): Promise<Message> {
  const response = await api.post(`/api/chat/swap/${swapId}`, {
    content,
  });
  return response.data;
}
