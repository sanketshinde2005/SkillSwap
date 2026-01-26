import api from "./api";
import { Skill } from "@/types/skill";

export async function fetchSkills(): Promise<Skill[]> {
  const response = await api.get("/api/skills");
  return response.data;
}
