import { API_BASE_URL } from "./api";
import { Skill } from "@/types/skill";

export interface UserProfile {
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  offering: Skill[];
  learning: Skill[];
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}
