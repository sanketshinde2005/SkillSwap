import Navbar from "@/components/Navbar";
import Link from "next/link";
import AnimatedHero3D from "@/components/AnimatedHero3D";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        {/* Hero Section */}
        <div className="min-h-auto lg:min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 lg:py-0">
          <div className="max-w-7xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start lg:items-center">
              {/* Left Content */}
              <div className="space-y-8 order-1 lg:order-1">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
                    Exchange
                    <br />
                    <span style={{ color: "var(--accent-primary)" }}>
                      Skills Freely
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed">
                    Join a community where students trade knowledge without
                    money. Learn what you want, teach what you know.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/register"
                    className="px-8 py-4 rounded-lg font-semibold btn text-center transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Get Started Free
                  </Link>

                  <Link
                    href="/login"
                    className="px-8 py-4 rounded-lg font-semibold border-2 text-[var(--text-primary)] text-center transition-all duration-200 hover:bg-[var(--bg-secondary)]"
                    style={{ borderColor: "var(--border-primary)" }}
                  >
                    Sign In
                  </Link>
                </div>

                {/* Social Proof */}
                <div
                  className="pt-6 border-t-2"
                  style={{ borderColor: "var(--border-secondary)" }}
                >
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    💚 Trusted by students everywhere
                  </p>
                </div>
              </div>

              {/* Center - 3D Animation (Desktop Only) */}
              <div className="hidden lg:block order-1 lg:order-2 h-[500px]">
                <AnimatedHero3D />
              </div>

              {/* Right Side - 4 Steps */}
              <div className="order-2 lg:order-3 space-y-4 lg:ml-4 w-full lg:w-auto">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] lg:text-left">
                  How It Works
                </h3>

                {/* Step 1 */}
                <div className="card p-4 flex gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    1
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                      List Skills
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      Add what you can teach
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="card p-4 flex gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    2
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                      Find & Request
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      Browse skills you want
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="card p-4 flex gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    3
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                      Get Approval
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      Admin verification
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="card p-4 flex gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "var(--text-primary)",
                    }}
                  >
                    ✓
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                      Swap & Learn
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      Start learning today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div
          className="bg-[var(--bg-secondary)] border-t-2"
          style={{ borderColor: "var(--border-secondary)" }}
        >
          <div className="max-w-5xl mx-auto px-4 py-16 lg:py-24">
            <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-4">
              Why SkillSwap?
            </h2>
            <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
              A smarter way to learn and grow
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div className="card p-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  💰
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  100% Free
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  No fees, no hidden costs. Pure knowledge exchange.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="card p-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  👥
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Community
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Connect with passionate learners from everywhere.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="card p-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  🎓
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  Learn Anything
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  From tech to arts, languages to life skills.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-[var(--bg-primary)]">
          <div className="max-w-5xl mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Ready to start your learning journey?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Join hundreds of students already exchanging skills on SkillSwap.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-4 rounded-lg font-semibold btn transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
