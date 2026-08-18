import { useEffect, useMemo } from "react";

const MILESTONES = new Set([3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365]);

function milestoneLine(streak) {
  if (streak === 1) return "The first link is forged.";
  if (streak === 7) return "One full week. The chain holds.";
  if (streak === 30) return "Thirty days. This is a habit now.";
  if (streak === 100) return "One hundred links. Legendary.";
  if (streak === 365) return "A full year of fire. Unbelievable.";
  if (MILESTONES.has(streak)) return `${streak} days — a milestone reached.`;
  return "Another link, forged and unbroken.";
}

export default function SealCelebration({ streak, onClose }) {
  const isMilestone = MILESTONES.has(streak);

  const sparks = useMemo(() => {
    const n = isMilestone ? 28 : 16;
    return Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.3;
      const dist = 60 + Math.random() * (isMilestone ? 90 : 50);
      return {
        id: i,
        sx: `${Math.cos(angle) * dist}px`,
        sy: `${Math.sin(angle) * dist - dist * 0.3}px`,
        delay: Math.random() * 0.15,
        size: 3 + Math.random() * 4,
        hue: Math.random() > 0.5 ? "#FF8C42" : "#FFB347",
      };
    });
  }, [isMilestone]);

  useEffect(() => {
    const t = setTimeout(onClose, isMilestone ? 3400 : 2200);
    return () => clearTimeout(t);
  }, [onClose, isMilestone]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-overlayIn"
      style={{ background: "rgba(11,14,26,0.55)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* expanding ring burst */}
        <span
          className="absolute rounded-full border-2 animate-ringBurst"
          style={{
            width: 90,
            height: 90,
            borderColor: isMilestone ? "#FFB347" : "#FF6B35",
          }}
        />
        {isMilestone && (
          <span
            className="absolute rounded-full border animate-ringBurst"
            style={{ width: 90, height: 90, borderColor: "#FFB347", animationDelay: "0.15s" }}
          />
        )}

        {/* sparks */}
        {sparks.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full animate-sparkOut"
            style={{
              width: s.size,
              height: s.size,
              background: s.hue,
              boxShadow: `0 0 8px 1px ${s.hue}`,
              "--sx": s.sx,
              "--sy": s.sy,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative flex flex-col items-center text-center px-8 py-7 rounded-2xl border animate-modalIn
            bg-midnight-panel/95 backdrop-blur-sm
            ${isMilestone ? "border-ember-bright shadow-ember" : "border-ember/40 shadow-emberSoft"}`}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-2">
            {isMilestone ? "Milestone Sealed" : "Link Sealed"}
          </div>
          <div className="font-display text-5xl font-semibold text-lavender tabular-nums animate-countPulse">
            {streak}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slatemuted mt-1 mb-3">
            {streak === 1 ? "day" : "days"}
          </div>
          <p className="font-body text-sm text-lavender/90 max-w-[220px]">
            {milestoneLine(streak)}
          </p>
        </div>
      </div>
    </div>
  );
}
