export interface Skill {
  id: number;
  name: string;
  type: string;
  ownerEmail: string;
  ownerName?: string; // Added to show who is teaching/learning from
}
