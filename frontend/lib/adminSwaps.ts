import api from "./api";

export interface AdminSwap {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  skillName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export async function fetchAllSwaps(): Promise<AdminSwap[]> {
  const res = await api.get("/api/swaps");
  return res.data.content; // because backend is paginated
}

export async function approveSwap(id: number) {
  await api.patch(`/api/swaps/${id}/approve`);
}

export async function rejectSwap(id: number) {
  await api.patch(`/api/swaps/${id}/reject`);
}
