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
        err?.response?.data?.message || "Login failed. Invalid Credentials.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--bg-primary)] px-4">
        <div className="card w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-center text-[var(--text-primary)] mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
            Login to continue to SkillSwap
          </p>

          {error && (
            <div
              className="mb-4 rounded-md bg-[var(--error)] border-2 px-3 py-2 text-sm text-[var(--text-primary)]"
              style={{ borderColor: "var(--error)" }}
            >
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
                className="w-full rounded-lg border-2 bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]
                           focus:outline-none focus:ring-2"
                style={
                  {
                    borderColor: "var(--border-primary)",
                    "--tw-ring-color": "var(--accent-focus)",
                  } as any
                }
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
                className="w-full rounded-lg border-2 bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]
                           focus:outline-none focus:ring-2"
                style={
                  {
                    borderColor: "var(--border-primary)",
                    "--tw-ring-color": "var(--accent-focus)",
                  } as any
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 font-medium transition btn disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
