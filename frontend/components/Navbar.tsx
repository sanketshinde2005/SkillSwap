"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, getUserRole, logout } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const syncAuthState = () => {
      setLoggedIn(isLoggedIn());
      setRole(getUserRole());
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  return (
    <nav className="w-full border-b bg-[var(--background)] border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-blue-600">
          SkillSwap
        </Link>

        <div className="flex gap-5 text-sm items-center">
          {loggedIn && (
            <>
              <Link
                href="/skills"
                className="text-[var(--text-primary)] hover:text-[var(--primary)]"
              >
                Skills
              </Link>
              <Link
                href="/swaps"
                className="text-[var(--text-primary)] hover:text-[var(--primary)]"
              >
                Swaps
              </Link>

              {role === "ADMIN" && (
                <Link href="/admin/swaps" className="text-[var(--primary)]">
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Logout
              </button>
            </>
          )}

          {!loggedIn && (
            <>
              <Link
                href="/login"
                className="text-[var(--text-primary)] hover:text-[var(--primary)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Register
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded border border-[var(--border)] text-[var(--text-primary)] text-xs hover:bg-[var(--surface)]"
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}
