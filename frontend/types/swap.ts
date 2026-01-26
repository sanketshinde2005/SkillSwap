export type SwapStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Swap {
  id: number;
  senderEmail: string;
  receiverEmail: string;
  skillName: string;
  status: SwapStatus;
}
