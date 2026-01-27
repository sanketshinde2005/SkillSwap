import api from "./api";

/* =========================
   TYPES
========================= */
export interface Swap {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  skillName: string;
  offeredSkillId?: number;
  offeredSkillName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

/* =========================
   STUDENT ACTIONS
========================= */

// ✅ CREATE SWAP (used by SkillCard) - now with offered skill
export async function requestSwap(skillId: number, offeredSkillId: number) {
  const res = await api.post("/api/swaps", { skillId, offeredSkillId });
  return res.data;
}

// ✅ ACCEPT SWAP (Receiver only)
export async function acceptSwap(swapId: number) {
  const res = await api.patch(`/api/swaps/${swapId}/accept`);
  return res.data;
}

// ✅ REJECT SWAP (Receiver only)
export async function rejectSwap(swapId: number) {
  const res = await api.patch(`/api/swaps/${swapId}/reject`);
  return res.data;
}

// ✅ OUTGOING SWAPS
export async function fetchOutgoingSwaps(): Promise<Swap[]> {
  const res = await api.get("/api/swaps/outgoing");
  return res.data;
}

// ✅ INCOMING SWAPS
export async function fetchIncomingSwaps(): Promise<Swap[]> {
  const res = await api.get("/api/swaps/incoming");
  return res.data;
}

// ✅ Skills already requested by logged-in student
export async function fetchRequestedSkillIds(): Promise<number[]> {
  const res = await api.get("/api/swaps/requested-skills");
  return res.data;
}

// ❌ Cancel pending swap request
export async function cancelSwapRequest(skillId: number) {
  await api.delete(`/api/swaps/${skillId}/cancel`);
}
