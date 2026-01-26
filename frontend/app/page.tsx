import Navbar from "@/components/Navbar";
import Link from "next/link";
import { theme } from "@/lib/theme";

export default function Home() {
  return (
    <>
      <Navbar />

      <main
        className="min-h-[calc(100vh-64px)] flex items-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left content */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-semibold leading-tight mb-6"
              style={{ color: theme.textPrimary }}
            >
              Exchange Skills. <br />
              <span style={{ color: theme.primary }}>
                Learn Together.
              </span>
            </h1>

            <p
              className="text-lg mb-8 max-w-xl"
              style={{ color: theme.textSecondary }}
            >
              SkillSwap is a student-driven platform where learners exchange
              skills, collaborate on real knowledge, and grow together — no money,
              just mutual learning.
            </p>

            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg font-medium transition"
                style={{
                  backgroundColor: theme.primary,
                  color: "#fff",
                }}
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-medium transition border"
                style={{
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  backgroundColor: theme.surface,
                }}
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right visual block */}
          <div
            className="rounded-2xl p-8 border"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <ul className="space-y-5">
              {[
                "Offer skills you’re good at",
                "Request skills you want to learn",
                "Exchange knowledge without money",
                "Admin-verified, secure swaps",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="mt-1 h-2 w-2 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <p style={{ color: theme.textSecondary }}>{text}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>
    </>
  );
}
