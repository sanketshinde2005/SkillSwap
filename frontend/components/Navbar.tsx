"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isLoggedIn, getUserRole, logout } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "STUDENT" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const syncAuthState = () => {
      setLoggedIn(isLoggedIn());
      setRole(getUserRole());
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-[var(--border)]
                 backdrop-blur-md bg-[color:var(--background)/0.7]"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold -ml-4 lg:-ml-15"
          style={{ color: "var(--accent-primary)" }}
        >
          SkillSwap
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {loggedIn && (
            <>
              {[
                ["/skills", "Skills"],
                ["/swaps", "Swaps"],
                ["/profile", "Profile"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative transition ${
                    isActive(href)
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--primary)] rounded-full" />
                  )}
                </Link>
              ))}

              {role === "ADMIN" && (
                <Link
                  href="/admin/swaps"
                  className="text-[var(--primary)] font-medium"
                >
                  Admin
                </Link>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 ml-4">
            {!loggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full border border-[var(--border)]
                             text-[var(--text-primary)] hover:bg-[var(--surface)]
                             transition"
                >
                  Login
                </Link>

                {/* Register with glow */}
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-full font-semibold
                             bg-[var(--accent-primary)] text-[var(--text-on-accent)]
                             shadow-md hover:shadow-[0_0_20px_var(--accent-primary)]
                             transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="px-4 py-2 rounded-full border border-[var(--border)]
                           text-[var(--primary)] hover:bg-[var(--surface)]
                           transition"
              >
                Logout
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         border border-[var(--border)]
                         hover:bg-[var(--surface)]
                         transition transform hover:scale-110"
            >
              <span
                className={`transition-all duration-300 ease-out ${
                  theme === "dark" ? "rotate-0 scale-100" : "rotate-0 scale-100"
                }`}
              >
                {theme === "dark" ? "☀" : "🌙"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-[var(--text-primary)]"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-[var(--border)]
                     backdrop-blur-md bg-[color:var(--background)/0.85]"
        >
          <div className="px-6 py-4 flex flex-col gap-4 text-sm">
            {loggedIn && (
              <>
                <Link href="/skills">Skills</Link>
                <Link href="/swaps">Swaps</Link>
                <Link href="/profile">Profile</Link>
                {role === "ADMIN" && <Link href="/admin/swaps">Admin</Link>}
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                  className="text-left text-[var(--primary)]"
                >
                  Logout
                </button>
              </>
            )}

            {!loggedIn && (
              <>
                <Link href="/login">Login</Link>
                <Link
                  href="/register"
                  className="font-semibold text-[var(--primary)]"
                >
                  Register
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="self-start mt-2 text-[var(--text-primary)]"
            >
              {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
