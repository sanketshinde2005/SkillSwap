"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SkillCard from "@/components/SkillCard";
import SkeletonCard from "@/components/SkeletonCard";
import { fetchSkills } from "@/lib/skills";
import { Skill } from "@/types/skill";
import { theme } from "@/lib/theme";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkills()
      .then(setSkills)
      .catch(() => setError("Failed to load skills"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <Navbar />

      <main
        className="min-h-screen"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1
            className="text-2xl font-semibold mb-8"
            style={{ color: theme.textPrimary }}
          >
            Available Skills
          </h1>

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {/* ✅ Skeletons while loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ✅ Empty state */}
          {!loading && skills.length === 0 && (
            <p
              className="text-center text-sm mt-10"
              style={{ color: theme.textSecondary }}
            >
              No skills available yet.
              <br />
              Be the first to add one!
            </p>
          )}

          {/* ✅ Real skills */}
          {!loading && skills.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
