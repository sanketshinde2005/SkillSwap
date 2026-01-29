import { API_BASE_URL } from "./api";
import { Skill } from "@/types/skill";

function getHeaders(contentType = true) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch(`${API_BASE_URL}/api/skills`, {
    headers: getHeaders(false),
  });
  return res.json();
}

/**
 * ✅ NEW: Fetch current user's OFFER skills (for OFFER tab)
 */
export async function fetchMyOffers(): Promise<Skill[]> {
  const res = await fetch(`${API_BASE_URL}/api/skills/my-offers`, {
    headers: getHeaders(false),
  });
  return res.json();
}

/**
 * ✅ NEW: Fetch all OFFER skills except user's own (for LEARN tab)
 * Supports optional search query
 */
export async function fetchAvailableToLearn(query?: string): Promise<Skill[]> {
  const q = query ? `?query=${encodeURIComponent(query)}` : "";
  const res = await fetch(`${API_BASE_URL}/api/skills/available-to-learn${q}`, {
    headers: getHeaders(false),
  });
  return res.json();
}

export async function createSkill(name: string, type: "OFFER" | "LEARN") {
  const res = await fetch(`${API_BASE_URL}/api/skills`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ name, type }),
  });
  return res.json();
}

export async function deleteSkill(skillId: number) {
  await fetch(`${API_BASE_URL}/api/skills/${skillId}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });
}
