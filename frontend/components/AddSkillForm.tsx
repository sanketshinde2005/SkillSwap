"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";
import api from "@/lib/api";

export default function AddSkillForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"OFFER" | "LEARN">("OFFER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) {
      setError("Skill name required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/skills", { name, type });
      setName("");
      onAdded(); // refresh skills list
    } catch {
      setError("Failed to add skill");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-4 mb-6"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <h3 className="font-medium mb-2" style={{ color: theme.textPrimary }}>
        Add a Skill
      </h3>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Skill name"
        className="w-full mb-2 px-3 py-2 rounded border"
        style={{
          backgroundColor: theme.background,
          color: theme.textPrimary,
          borderColor: theme.border,
        }}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="w-full mb-3 px-3 py-2 rounded border"
        style={{
          backgroundColor: theme.background,
          color: theme.textPrimary,
          borderColor: theme.border,
        }}
      >
        <option value="OFFER">Offer</option>
        <option value="LEARN">Learn</option>
      </select>

      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 rounded-md text-sm"
        style={{
          backgroundColor: theme.primary,
          color: "#fff",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Adding..." : "Add Skill"}
      </button>
    </div>
  );
}
