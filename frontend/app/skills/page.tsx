"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SkillCard from "@/components/SkillCard";
import SkeletonCard from "@/components/SkeletonCard";
import AddSkillModal from "@/components/AddSkillModal";
import { fetchSkills } from "@/lib/skills";
import { fetchRequestedSkillIds } from "@/lib/swaps";
import { Skill } from "@/types/skill";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUserRole } from "@/lib/auth";

type SkillFilter = "ALL" | "OFFER" | "LEARN";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [requestedSkillIds, setRequestedSkillIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<SkillFilter>("ALL");

  const role = getUserRole();

  async function loadSkills() {
    setLoading(true);
    try {
      const [skillsData, requestedIds] = await Promise.all([
        fetchSkills(),
        fetchRequestedSkillIds(),
      ]);

      setSkills(skillsData);
      setRequestedSkillIds(requestedIds);
    } catch {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  // -----------------------------
  // 🔍 FILTER LOGIC
  // -----------------------------
  const applyFilter = (list: Skill[]) => {
    if (filter === "ALL") return list;
    return list.filter((skill) => skill.type === filter);
  };

  const availableSkills = applyFilter(
    skills.filter((skill) => !requestedSkillIds.includes(skill.id)),
  );

  const requestedSkills = applyFilter(
    skills.filter((skill) => requestedSkillIds.includes(skill.id)),
  );

  return (
    <ProtectedRoute>
      <Navbar />

      <main className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Skills
            </h1>

            {role === "STUDENT" && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 rounded-md text-sm btn"
              >
                + Add Skill
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-8">
            {(["ALL", "OFFER", "LEARN"] as SkillFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full text-sm border-2 transition"
                style={{
                  backgroundColor:
                    filter === f ? "var(--accent-primary)" : "var(--bg-card)",
                  color:
                    filter === f
                      ? "var(--text-primary)"
                      : "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="text-center text-sm mt-10 text-[var(--error)]">
              {error}
            </p>
          )}

          {/* Available Skills */}
          {!loading && availableSkills.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                Available for Swap
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {availableSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} isRequested={false} />
                ))}
              </div>
            </>
          )}

          {/* Requested Skills */}
          {!loading && requestedSkills.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">
                Already Requested
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {requestedSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} isRequested={true} />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && skills.length === 0 && (
            <p className="text-center text-sm mt-10 text-[var(--text-secondary)]">
              No skills available yet.
              <br />
              Be the first to add one!
            </p>
          )}
        </div>
      </main>

      {showModal && (
        <AddSkillModal
          onClose={() => setShowModal(false)}
          onCreated={loadSkills}
        />
      )}
    </ProtectedRoute>
  );
}
