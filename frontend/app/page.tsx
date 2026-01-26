import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] flex items-center bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6 text-[var(--text-primary)]">
              Exchange Skills. <br />
              <span className="text-blue-500">Learn Together.</span>
            </h1>

            <p className="text-lg mb-8 max-w-xl text-[var(--text-secondary)]">
              SkillSwap is a student-driven platform where learners exchange
              skills, collaborate, and grow together — no money involved.
            </p>

            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-medium border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface)]"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-2xl p-8 border border-[var(--border)] bg-[var(--surface)]">
            <ul className="space-y-4 text-[var(--text-secondary)]">
              <li>• Offer skills you’re good at</li>
              <li>• Request skills you want to learn</li>
              <li>• Exchange knowledge without money</li>
              <li>• Admin-verified secure swaps</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
