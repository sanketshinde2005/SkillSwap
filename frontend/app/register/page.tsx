"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { register } from "@/lib/auth";
import { theme } from "@/lib/theme";
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
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main
        className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="w-full max-w-md rounded-2xl border shadow-lg p-8"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
          }}
        >
          <h2
            className="text-3xl font-semibold text-center mb-2"
            style={{ color: theme.textPrimary }}
          >
            Create Account
          </h2>

          <p
            className="text-sm text-center mb-6"
            style={{ color: theme.textSecondary }}
          >
            Join SkillSwap and start exchanging skills
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: theme.border }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: theme.border }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: theme.border }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium transition"
              style={{
                backgroundColor: theme.primary,
                color: "#fff",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p
            className="text-sm text-center mt-6"
            style={{ color: theme.textSecondary }}
          >
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="cursor-pointer font-medium"
              style={{ color: theme.primary }}
            >
              Login
            </span>
          </p>
        </div>
      </main>
    </>
  );
}
