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
      setError(
        err?.response?.data?.message || "Failed to request swap"
      );
    } finally {
      setLoading(false);
    }
  }

  const disabled = isOwnSkill || requested || loading;

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <h3
        className="text-lg font-semibold"
        style={{ color: theme.textPrimary }}
      >
        {skill.name}
      </h3>

      <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
        Type: {skill.type}
      </p>

      <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
        Owner: {skill.ownerEmail}
      </p>

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}

      <button
        onClick={handleRequest}
        disabled={disabled}
        className="mt-4 w-full py-2 rounded-md text-sm font-medium"
        style={{
          backgroundColor: disabled
            ? theme.border
            : theme.primary,
          color: disabled ? theme.textSecondary : "#fff",
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
