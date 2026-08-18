import { useMemo } from "react";

// Ambient embers drifting up from the bottom of the screen — pure CSS,
// generated once so they don't re-shuffle on every render.
export default function EmberParticles({ count = 16 }) {
  const embers = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + Math.random() * 3.5;
      return {
        id: i,
        left: Math.random() * 100,
        size,
        duration: 9 + Math.random() * 10,
        delay: Math.random() * -18,
        drift: `${(Math.random() - 0.5) * 120}px`,
        opacity: 0.35 + Math.random() * 0.45,
      };
    });
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-0 rounded-full animate-emberFloat"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            background:
              "radial-gradient(circle, rgba(255,179,71,0.95) 0%, rgba(255,107,53,0.5) 60%, transparent 100%)",
            boxShadow: "0 0 6px 1px rgba(255,107,53,0.6)",
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            "--drift": e.drift,
            opacity: e.opacity,
          }}
        />
      ))}
    </div>
  );
}
