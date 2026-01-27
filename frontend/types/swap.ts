export type SwapStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Swap {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  requestedSkillId: number;
  requestedSkillName: string;
  skillName?: string; // Alias for compatibility
  skillId?: number; // Alias for compatibility
  offeredSkillId?: number;
  offeredSkillName?: string;
  status: SwapStatus;
}
