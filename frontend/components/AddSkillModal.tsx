"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddSkillModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"OFFER" | "LEARN">("OFFER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Skill name is required");
      return;
    }

    try {
      setLoading(true);
      const { createSkill } = await import("@/lib/skills");
      await createSkill(name, type);
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-xl p-6 bg-[var(--surface)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
          Add a Skill
        </h2>

        {error && (
          <p className="text-sm text-[var(--error-text)] mb-3">{error}</p>
        )}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name"
          className="w-full mb-3 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="w-full mb-4 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]"
        >
          <option value="OFFER">Offer (I can teach)</option>
          <option value="LEARN">Learn (I want to learn)</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}
