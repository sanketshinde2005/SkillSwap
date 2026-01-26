import api from "./api";
import { Skill } from "@/types/skill";

export async function fetchSkills(): Promise<Skill[]> {
  const response = await api.get("/api/skills");
  return response.data;
}

export async function createSkill(
  name: string,
  type: "OFFER" | "LEARN"
) {
  const res = await api.post("/api/skills", {
    name,
    type,
  });
  return res.data;
}
