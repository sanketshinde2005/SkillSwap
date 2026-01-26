"use client";

import { Skill } from "@/types/skill";
import { theme } from "@/lib/theme";
import { requestSwap } from "@/lib/swaps";
import { getUserEmail } from "@/lib/auth";
import { useState } from "react";

interface Props {
  skill: Skill;
}

export default function SkillCard({ skill }: Props) {
  const userEmail = getUserEmail();
  const isOwnSkill =
    userEmail?.toLowerCase() === skill.ownerEmail.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState("");

  async function handleRequest() {
    setLoading(true);
    setError("");

    try {
      await requestSwap(skill.id);
      setRequested(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to request swap");
    } finally {
      setLoading(false);
    }
  }

  const disabled = isOwnSkill || requested || loading;

  return (
    <div className="rounded-xl p-5 border border-[var(--border)] bg-[var(--surface)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        {skill.name}
      </h3>

      <p className="text-sm mt-1 text-[var(--text-secondary)]">
        Type: {skill.type}
      </p>

      <p className="text-sm mt-1 text-[var(--text-secondary)]">
        Owner: {skill.ownerEmail}
      </p>

      {error && (
        <p className="text-xs text-[var(--error-text)] mt-2">{error}</p>
      )}

      <button
        onClick={handleRequest}
        disabled={disabled}
        className="mt-4 w-full py-2 rounded-md text-sm font-medium"
        style={{
          backgroundColor: disabled ? "var(--border)" : "var(--primary)",
          color: disabled ? "var(--text-secondary)" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {isOwnSkill
          ? "Your Skill"
          : requested
            ? "Request Sent"
            : loading
              ? "Requesting..."
              : "Request Swap"}
      </button>
    </div>
  );
}
