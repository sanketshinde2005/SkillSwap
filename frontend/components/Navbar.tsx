"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { theme } from "@/lib/theme";
import { isLoggedIn, getUserRole, logout } from "@/lib/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);

  useEffect(() => {
    const syncAuthState = () => {
      setLoggedIn(isLoggedIn());
      setRole(getUserRole());
    };

    // Initial check (client-side only)
    syncAuthState();

    // Sync across tabs
    window.addEventListener("storage", syncAuthState);

    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  return (
    <nav
      className="w-full border-b"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold"
          style={{ color: theme.primary }}
        >
          SkillSwap
        </Link>

        {/* Links */}
        <div className="flex gap-6 text-sm items-center">
          {loggedIn ? (
            <>
              <Link href="/skills" style={{ color: theme.textPrimary }}>
                Skills
              </Link>

              <Link href="/swaps" style={{ color: theme.textPrimary }}>
                Swaps
              </Link>

              {/* 🔐 ADMIN ONLY LINK */}
              {role === "ADMIN" && (
                <Link
                  href="/admin/swaps"
                  style={{ color: theme.primary }}
                >
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                style={{ color: theme.primary }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: theme.textPrimary }}>
                Login
              </Link>

              <Link href="/register" style={{ color: theme.primary }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
