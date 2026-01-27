"use client";

import { useState } from "react";
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
    <div className="card p-4 mb-6">
      <h3 className="font-medium mb-2 text-[var(--text-primary)]">
        Add a Skill
      </h3>

      {error && <p className="text-xs text-[var(--error)] mb-2">{error}</p>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Skill name"
        className="w-full mb-2 px-3 py-2 rounded border-2"
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          borderColor: "var(--border-primary)",
        }}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="w-full mb-3 px-3 py-2 rounded border-2"
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          borderColor: "var(--border-primary)",
        }}
      >
        <option value="OFFER">Offer</option>
        <option value="LEARN">Learn</option>
      </select>

      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 rounded-md text-sm btn"
        style={{
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Adding..." : "Add Skill"}
      </button>
    </div>
  );
}
