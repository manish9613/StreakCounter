import { useEffect, useRef, useState } from "react";
import { useCountUp } from "../hooks/useCountUp";

export default function Flame({ streak, longestStreak }) {
  // Flame grows subtly with streak length, capped so it never gets absurd.
  const scale = Math.min(1 + streak * 0.015, 1.4);
  const glow = Math.min(0.35 + streak * 0.02, 0.9);

  const displayStreak = useCountUp(streak, 550);
  const prevStreak = useRef(streak);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (streak > prevStreak.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 550);
      prevStreak.current = streak;
      return () => clearTimeout(t);
    }
    prevStreak.current = streak;
  }, [streak]);

  return (
    <div className="flex flex-col items-center animate-rise">
      <div
        className="relative flex items-center justify-center"
        style={{
          filter: `drop-shadow(0 0 ${18 + streak * 1.5}px rgba(255,107,53,${glow}))`,
        }}
      >
        <svg
          width="120"
          height="140"
          viewBox="0 0 120 140"
          style={{
            transform: `scale(${pulse ? scale * 1.08 : scale})`,
            transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          className="animate-flicker"
        >
          <defs>
            <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="55%" stopColor="#FF8C42" />
              <stop offset="100%" stopColor="#FFB347" />
            </linearGradient>
          </defs>
          <path
            d="M60 8
               C 40 35, 20 50, 24 78
               C 26 100, 42 118, 60 132
               C 78 118, 94 100, 96 78
               C 100 50, 80 35, 60 8 Z"
            fill="url(#flameGrad)"
          />
          <path
            d="M60 45
               C 50 60, 42 68, 44 82
               C 45 96, 52 106, 60 114
               C 68 106, 75 96, 76 82
               C 78 68, 70 60, 60 45 Z"
            fill="#0B0E1A"
            opacity="0.35"
          />
        </svg>
      </div>

      <div
        className={`mt-3 font-display text-7xl sm:text-8xl font-semibold text-lavender tabular-nums transition-transform ${
          pulse ? "animate-countPulse" : ""
        }`}
      >
        {displayStreak}
      </div>
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-slatemuted mt-1">
        {streak === 1 ? "day sealed" : "days sealed"}
      </div>
      {longestStreak > streak && (
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-slatemuted/70 mt-2">
          longest chain: {longestStreak}
        </div>
      )}
    </div>
  );
}
