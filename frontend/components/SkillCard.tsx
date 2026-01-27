"use client";

import { Skill } from "@/types/skill";
import { requestSwap, cancelSwapRequest } from "@/lib/swaps";
import { deleteSkill } from "@/lib/skills";
import { getUserEmail } from "@/lib/auth";
import { useState } from "react";

interface Props {
  skill: Skill;
  isRequested: boolean;
}

export default function SkillCard({ skill, isRequested }: Props) {
  const userEmail = getUserEmail();
  const isOwnSkill =
    userEmail?.toLowerCase() === skill.ownerEmail.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // REQUEST SWAP
  // ===============================
  async function handleRequest() {
    setLoading(true);
    setError("");

    try {
      await requestSwap(skill.id);
      window.location.reload(); // backend is source of truth
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to request swap");
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // CANCEL SWAP REQUEST
  // ===============================
  async function handleCancel() {
    setLoading(true);
    setError("");

    try {
      await cancelSwapRequest(skill.id);
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to cancel request");
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // DELETE OWN SKILL
  // ===============================
  async function handleDelete() {
    if (!confirm("Delete this skill? This action cannot be undone.")) return;

    setLoading(true);
    setError("");

    try {
      await deleteSkill(skill.id);
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete skill");
    } finally {
      setLoading(false);
    }
  }

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

      {/* ===============================
          ACTIONS
         =============================== */}

      {/* OWN SKILL */}
      {isOwnSkill ? (
        <>
          <button
            disabled
            className="mt-4 w-full py-2 rounded-md text-sm font-medium
                       bg-[var(--border)] text-[var(--text-secondary)] cursor-not-allowed"
          >
            Your Skill
          </button>

          <button
            onClick={handleDelete}
            disabled={loading || isRequested}
            className={`mt-2 w-full py-2 rounded-md text-sm font-medium
              ${
                isRequested
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
          >
            {isRequested ? "Active Swap Exists" : loading ? "Deleting..." : "Delete Skill"}
          </button>

        </>
      ) : isRequested ? (
        /* REQUESTED SKILL */
        <button
          onClick={handleCancel}
          disabled={loading}
          className="mt-4 w-full py-2 rounded-md text-sm font-medium
                     bg-red-500 hover:bg-red-600 text-white disabled:opacity-60"
        >
          {loading ? "Cancelling..." : "Cancel Request"}
        </button>
      ) : (
        /* AVAILABLE SKILL */
        <button
          onClick={handleRequest}
          disabled={loading}
          className="mt-4 w-full py-2 rounded-md text-sm font-medium
                     bg-[var(--primary)] hover:bg-[var(--primary-hover)]
                     text-white disabled:opacity-60"
        >
          {loading ? "Requesting..." : "Request Swap"}
        </button>
      )}
    </div>
  );
}
