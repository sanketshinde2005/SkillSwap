import api from "./api";

/* =========================
   TYPES
========================= */
export interface Swap {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  skillName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

/* =========================
   STUDENT ACTIONS
========================= */

// ✅ CREATE SWAP (used by SkillCard)
export async function requestSwap(skillId: number) {
  const res = await api.post("/api/swaps", { skillId });
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
