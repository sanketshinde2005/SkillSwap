export type SwapStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Swap {
  id: number;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  receiverName: string;
  requestedSkillId: number;
  requestedSkillName: string;
  offeredSkillId?: number;
  offeredSkillName?: string;
  status: SwapStatus;
}

export interface SwapDetails {
  id: number;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  receiverName: string;
  requestedSkillId: number;
  requestedSkillName: string;
  offeredSkillId?: number | null;
  offeredSkillName?: string | null;
  status: SwapStatus;
}
