"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SkillCard from "@/components/SkillCard";
import SkeletonCard from "@/components/SkeletonCard";
import AddSkillModal from "@/components/AddSkillModal";
import { fetchMyOffers, fetchAvailableToLearn } from "@/lib/skills";
import { fetchRequestedSkillIds } from "@/lib/swaps";
import { Skill } from "@/types/skill";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUserRole } from "@/lib/auth";

type SkillTab = "OFFER" | "LEARN";

export default function SkillsPage() {
  const [tab, setTab] = useState<SkillTab>("OFFER");
  const [myOffers, setMyOffers] = useState<Skill[]>([]);
  const [learnSkills, setLearnSkills] = useState<Skill[]>([]);
  const [requestedSkillIds, setRequestedSkillIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const role = getUserRole();

  async function loadOffers() {
    try {
      const data = await fetchMyOffers();
      setMyOffers(data);
    } catch {
      setError("Failed to load your offers");
    }
  }

  async function loadLearnSkills(query?: string) {
    try {
      const data = await fetchAvailableToLearn(query);
      setLearnSkills(data);
    } catch {
      setError("Failed to load available skills");
    }
  }

  async function loadRequestedIds() {
    try {
      const ids = await fetchRequestedSkillIds();
      setRequestedSkillIds(ids);
    } catch {
      // silently fail
    }
  }

  async function loadAllData(query?: string) {
    setLoading(true);
    try {
      await Promise.all([
        loadOffers(),
        loadLearnSkills(query),
        loadRequestedIds(),
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle search input change (debounce not needed for simplicity)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Load with new query
    loadLearnSkills(query || undefined);
  };

  // Get current tab data
  const currentSkills = tab === "OFFER" ? myOffers : learnSkills;

  // For LEARN tab, filter out already requested skills
  const availableSkills =
    tab === "LEARN"
      ? learnSkills.filter((skill) => !requestedSkillIds.includes(skill.id))
      : myOffers;

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

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["OFFER", "LEARN"] as SkillTab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSearchQuery(""); // Reset search when switching tabs
                }}
                className="px-4 py-2 rounded-full text-sm border-2 transition"
                style={{
                  backgroundColor:
                    tab === t ? "var(--accent-primary)" : "var(--bg-card)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                }}
              >
                {t === "OFFER" ? "My Offers" : "Learn"}
              </button>
            ))}
          </div>

          {/* Search Bar (LEARN tab only) */}
          {tab === "LEARN" && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search skills (e.g., React, Python)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                           bg-[var(--bg-card)] text-[var(--text-primary)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>
          )}

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

          {/* Empty State */}
          {!loading && availableSkills.length === 0 && (
            <p className="text-center text-sm mt-10 text-[var(--text-secondary)]">
              {tab === "OFFER" &&
                "You haven't added any skills yet. Click '+ Add Skill' to get started!"}
              {tab === "LEARN" && searchQuery && "No skills match your search."}
              {tab === "LEARN" &&
                !searchQuery &&
                "No available skills to learn yet."}
            </p>
          )}

          {/* Skills Grid */}
          {!loading && availableSkills.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {availableSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isRequested={
                    tab === "LEARN" && requestedSkillIds.includes(skill.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <AddSkillModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            loadAllData(tab === "LEARN" ? searchQuery : undefined);
          }}
        />
      )}
    </ProtectedRoute>
  );
}
