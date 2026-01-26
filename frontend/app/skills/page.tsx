"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SkillCard from "@/components/SkillCard";
import SkeletonCard from "@/components/SkeletonCard";
import AddSkillModal from "@/components/AddSkillModal";
import { fetchSkills } from "@/lib/skills";
import { Skill } from "@/types/skill";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getUserRole } from "@/lib/auth";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const role = getUserRole();

  async function loadSkills() {
    setLoading(true);
    try {
      const data = await fetchSkills();
      setSkills(data);
    } catch {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <ProtectedRoute>
      <Navbar />

      <main className="min-h-screen bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Available Skills
            </h1>

            {role === "STUDENT" && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 rounded-md text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
              >
                + Add Skill
              </button>
            )}
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && skills.length === 0 && (
            <p className="text-center text-sm mt-10 text-gray-500 dark:text-gray-400">
              No skills available yet.
              <br />
              Be the first to add one!
            </p>
          )}

          {!loading && skills.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
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
