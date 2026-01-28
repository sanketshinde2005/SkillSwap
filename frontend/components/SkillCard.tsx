"use client";

import { Skill } from "@/types/skill";
import { requestSwap } from "@/lib/swaps";
import { getUserEmail } from "@/lib/auth";
import { useEffect, useState } from "react";
import { fetchSkills } from "@/lib/skills";

interface Props {
  skill: Skill;
  isRequested: boolean;
}

export default function SkillCard({ skill, isRequested }: Props) {
  const userEmail = getUserEmail();
  const isOwnSkill =
    userEmail?.toLowerCase() === skill.ownerEmail.toLowerCase();

  const [myOfferSkills, setMyOfferSkills] = useState<Skill[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOwnSkill && !isRequested) {
      fetchSkills().then((skills) =>
        setMyOfferSkills(
          skills.filter(
            (s) =>
              s.type === "OFFER" &&
              s.ownerEmail?.toLowerCase() === userEmail?.toLowerCase(),
          ),
        ),
      );
    }
  }, [isOwnSkill, isRequested, userEmail]);

  async function handleRequest() {
    if (!selectedOfferId) {
      setError("Please select a skill you are offering");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await requestSwap(skill.id, selectedOfferId as number);
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to request swap");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        rounded-2xl
        p-5
        border-2
        bg-[var(--bg-card)]
        border-[var(--border-primary)]
        shadow-[3px_3px_0px_var(--border-primary)]
      "
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        {skill.name}
      </h3>

      <p className="text-sm mt-2 text-[var(--text-secondary)]">
        {skill.type === "OFFER"
          ? `Teaching: ${skill.ownerName || skill.ownerEmail}`
          : `Learning: ${skill.ownerName || skill.ownerEmail}`}
      </p>

      {error && <p className="text-xs mt-2 text-[var(--error)]">{error}</p>}

      {/* ACTION AREA */}
      {isOwnSkill ? (
        <button
          disabled
          className="
            mt-4 w-full py-2 rounded-xl text-sm font-medium
            border-2 border-[var(--border-secondary)]
            text-[var(--text-muted)]
            cursor-not-allowed
          "
        >
          Your Skill
        </button>
      ) : isRequested ? (
        <button
          disabled
          className="
            mt-4 w-full py-2 rounded-xl text-sm font-medium
            border-2 border-[var(--border-secondary)]
            text-[var(--text-muted)]
            cursor-not-allowed
          "
        >
          Already Requested
        </button>
      ) : (
        <>
          <select
            value={selectedOfferId}
            onChange={(e) => setSelectedOfferId(e.target.value as any)}
            className="
              mt-3 w-full px-3 py-2 rounded-xl
              border-2 border-[var(--border-secondary)]
              bg-[var(--bg-secondary)]
              text-[var(--text-primary)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--accent-focus)]
            "
          >
            <option value="">Select what you offer</option>
            {myOfferSkills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRequest}
            disabled={loading}
            className="
              mt-3 w-full py-2 rounded-xl text-sm font-medium
              border-2 border-[var(--border-primary)]
              bg-[var(--accent-primary)]
              text-[var(--text-primary)]
              hover:bg-[var(--accent-hover)]
              active:translate-x-[-1px]
              active:translate-y-[-1px]
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Requesting..." : "Propose Swap"}
          </button>
        </>
      )}
    </div>
  );
}
