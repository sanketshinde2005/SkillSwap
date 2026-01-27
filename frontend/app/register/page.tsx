"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { register } from "@/lib/auth";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-[var(--bg-primary)]">
        <div className="card w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-center mb-2 text-[var(--text-primary)]">
            Create Account
          </h2>

          <p className="text-sm text-center mb-6 text-[var(--text-secondary)]">
            Join SkillSwap and start exchanging skills
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
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border-2 bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-primary)" }}
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border-2 bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-primary)" }}
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border-2 bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-primary)" }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium btn disabled:opacity-70"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
