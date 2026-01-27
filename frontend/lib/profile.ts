import api from "./api";
import { Skill } from "@/types/skill";

export interface UserProfile {
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  offering: Skill[];
  learning: Skill[];
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const res = await api.get("/api/users/me");
  return res.data;
}
