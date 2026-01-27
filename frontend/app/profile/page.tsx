"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fetchMyProfile } from "@/lib/profile";
import SkillCard from "@/components/SkillCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <p className="p-6">Loading profile…</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />

      <main className="min-h-screen bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8 p-6 rounded-xl bg-[var(--surface)] border">
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <span>Incoming: {profile.stats.incomingRequests}</span>
              <span>Outgoing: {profile.stats.outgoingRequests}</span>
            </div>
          </div>

          {/* Offering */}
          <h2 className="text-lg font-semibold mb-3">Offering</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {profile.offering.map((s: any) => (
              <SkillCard key={s.id} skill={s} isRequested={false} />
            ))}
          </div>

          {/* Learning */}
          <h2 className="text-lg font-semibold mb-3">Learning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profile.learning.map((s: any) => (
              <SkillCard key={s.id} skill={s} isRequested={false} />
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
