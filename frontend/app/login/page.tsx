"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { login } from "@/lib/auth.client";
import { getUserRole } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { role } = await login(email, password);

      if (role === "ADMIN") {
        router.push("/admin/swaps");
      } else {
        router.push("/skills");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Invalid Credentials.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-md bg-[var(--surface)] rounded-2xl shadow-lg border border-[var(--border)] p-8">
          <h2 className="text-3xl font-semibold text-center text-[var(--text-primary)] mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
            Login to continue to SkillSwap
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] px-3 py-2 text-sm text-[var(--error-text)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--text-primary)]">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)]
                         text-white py-2.5 font-medium transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
