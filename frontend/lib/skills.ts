import api from "./api";
import { Skill } from "@/types/skill";

export async function fetchSkills(): Promise<Skill[]> {
  const response = await api.get("/api/skills");
  return response.data;
}

/**
 * ✅ NEW: Fetch current user's OFFER skills (for OFFER tab)
 */
export async function fetchMyOffers(): Promise<Skill[]> {
  const response = await api.get("/api/skills/my-offers");
  return response.data;
}

/**
 * ✅ NEW: Fetch all OFFER skills except user's own (for LEARN tab)
 * Supports optional search query
 */
export async function fetchAvailableToLearn(query?: string): Promise<Skill[]> {
  const params = query ? { query } : {};
  const response = await api.get("/api/skills/available-to-learn", { params });
  return response.data;
}

export async function createSkill(name: string, type: "OFFER" | "LEARN") {
  const res = await api.post("/api/skills", {
    name,
    type,
  });
  return res.data;
}

export async function deleteSkill(skillId: number) {
  await api.delete(`/api/skills/${skillId}`);
}
