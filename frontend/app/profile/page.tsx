"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fetchMyProfile } from "@/lib/profile";
import { getUserRole } from "@/lib/auth";
import SkillCard from "@/components/SkillCard";
import AdminProfile from "@/components/AdminProfile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"STUDENT" | "ADMIN" | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
        setUserRole(data.role);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <p className="p-6">Loading profile…</p>
      </ProtectedRoute>
    );
  }

  // Admin profile view
  if (userRole === "ADMIN" || profile?.role === "ADMIN") {
    return (
      <ProtectedRoute>
        <Navbar />
        <AdminProfile name={profile.name} email={profile.email} />
      </ProtectedRoute>
    );
  }

  // Student profile view
  return (
    <ProtectedRoute>
      <Navbar />

      <main className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="card mb-8 p-6">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              {profile.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {profile.email}
            </p>
            <div className="flex gap-6 mt-4 text-sm text-[var(--text-secondary)]">
              <span>
                Approved swaps received: {profile.stats.incomingRequests}
              </span>
              <span>Approved swaps sent: {profile.stats.outgoingRequests}</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Offering Section (Left) */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Offering
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Skills you can teach others
                </p>
              </div>
              <div className="space-y-4">
                {profile.offering.length > 0 ? (
                  profile.offering.map((s: any) => (
                    <SkillCard key={s.id} skill={s} isRequested={false} />
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] italic">
                    No skills offered yet
                  </p>
                )}
              </div>
            </div>

            {/* Learning Section (Right) */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Available to Learn
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Skills others can teach you
                </p>
              </div>
              <div className="space-y-4">
                {profile.learning.length > 0 ? (
                  profile.learning.map((s: any) => (
                    <SkillCard key={s.id} skill={s} isRequested={false} />
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] italic">
                    No skills available to learn yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
