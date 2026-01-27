"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !isHovering) {
        // Auto-rotate when not hovering
        setRotation((prev) => ({
          x: prev.x + 0.3,
          y: prev.y + 0.5,
        }));
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const x = (e.clientY - rect.top - centerY) / 10;
      const y = (e.clientX - rect.left - centerX) / 10;

      setRotation({ x, y });
    };

    let animationFrame: number;
    const animate = () => {
      handleMouseMove(new MouseEvent("mousemove", { clientX: 0, clientY: 0 }));
      animationFrame = requestAnimationFrame(animate);
    };

    if (!isHovering) {
      animationFrame = requestAnimationFrame(animate);
    }

    if (isHovering) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovering]);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective">
      <style jsx>{`
        .perspective {
          perspective: 1200px;
        }

        .cube-container {
          width: clamp(200px, 60vw, 300px);
          height: clamp(200px, 60vw, 300px);
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 20s infinite linear;
        }

        @keyframes rotateCube {
          0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg);
          }
        }

        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(40px, 10vw, 60px);
          font-weight: bold;
          border: 2px solid var(--border-primary);
          border-radius: clamp(12px, 3vw, 20px);
          backdrop-filter: blur(10px);
          opacity: 0.9;
        }

        .face-1 {
          background: var(--bg-card);
          transform: translateZ(calc(clamp(200px, 60vw, 300px) / 2));
        }

        .face-2 {
          background: var(--bg-card);
          transform: rotateY(180deg)
            translateZ(calc(clamp(200px, 60vw, 300px) / 2));
        }

        .face-3 {
          background: var(--bg-card);
          transform: rotateY(90deg)
            translateZ(calc(clamp(200px, 60vw, 300px) / 2));
        }

        .face-4 {
          background: var(--bg-card);
          transform: rotateY(-90deg)
            translateZ(calc(clamp(200px, 60vw, 300px) / 2));
        }

        .face-5 {
          background: var(--bg-card);
          transform: rotateX(90deg)
            translateZ(calc(clamp(200px, 60vw, 300px) / 2));
        }

        .face-6 {
          background: var(--bg-card);
          transform: rotateX(-90deg)
            translateZ(calc(clamp(200px, 60vw, 300px) / 2));
        }

        .floating-badge {
          position: absolute;
          width: clamp(60px, 15vw, 80px);
          height: clamp(60px, 15vw, 80px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(28px, 7vw, 40px);
          background: var(--accent-primary);
          border: 2px solid var(--border-primary);
          animation: float 4s ease-in-out infinite;
          box-shadow: 0 8px 16px rgba(244, 162, 97, 0.2);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .badge-1 {
          top: clamp(-20px, -8vw, -30px);
          left: 50%;
          animation-delay: 0s;
          transform: translateX(-50%);
        }

        .badge-2 {
          bottom: clamp(-20px, -8vw, -30px);
          left: 50%;
          animation-delay: 1.3s;
          transform: translateX(-50%);
        }

        .badge-3 {
          top: 50%;
          left: clamp(-30px, -10vw, -40px);
          animation-delay: 0.6s;
          transform: translateY(-50%);
        }

        .badge-4 {
          top: 50%;
          right: clamp(-30px, -10vw, -40px);
          animation-delay: 1s;
          transform: translateY(-50%);
        }

        .glow-ring {
          position: absolute;
          width: clamp(250px, 85vw, 350px);
          height: clamp(250px, 85vw, 350px);
          border: 2px solid var(--accent-primary);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 3s ease-in-out infinite;
          opacity: 0.3;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.1;
          }
        }

        @media (max-width: 768px) {
          .floating-badge {
            animation: float 4s ease-in-out infinite;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Glow Ring Background */}
        <div className="glow-ring" />

        {/* 3D Cube */}
        <div
          className="cube-container"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          <div className="cube">
            <div className="cube-face face-1">📚</div>
            <div className="cube-face face-2">💻</div>
            <div className="cube-face face-3">🤝</div>
            <div className="cube-face face-4">📈</div>
            <div className="cube-face face-5">🌐</div>
            <div className="cube-face face-6">✅</div>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="floating-badge badge-1">🖥️</div>
        <div className="floating-badge badge-2">📊</div>
        <div className="floating-badge badge-3">🎓</div>
        <div className="floating-badge badge-4">🛜</div>

        {/* Hover Hint - Mobile and Desktop */}
        {!isHovering && !isMobile && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-[var(--text-muted)] animate-pulse">
              Hover to interact ↗
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
