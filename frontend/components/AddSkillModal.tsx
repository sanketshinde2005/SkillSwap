"use client";

import { useState } from "react";

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
      <div className="card w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
          Add a Skill
        </h2>

        {error && <p className="text-sm text-[var(--error)] mb-3">{error}</p>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Skill name"
          className="w-full mb-3 px-3 py-2 rounded-md border-2 bg-[var(--bg-card)] text-[var(--text-primary)]"
          style={{ borderColor: "var(--border-primary)" }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="w-full mb-4 px-3 py-2 rounded-md border-2 bg-[var(--bg-card)] text-[var(--text-primary)]"
          style={{ borderColor: "var(--border-primary)" }}
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
            className="px-4 py-2 rounded-md text-sm btn disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}
