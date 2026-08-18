import { useRef, useState } from "react";

export default function CheckInRitual({ unlocked, todayCheckedIn, onCheckIn }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bursts, setBursts] = useState([]);
  const burstId = useRef(0);

  function spawnBurst() {
    const n = 10;
    const sparks = Array.from({ length: n }, (_, i) => {
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const dist = 30 + Math.random() * 30;
      return {
        id: burstId.current++,
        sx: `${Math.cos(angle) * dist}px`,
        sy: `${Math.sin(angle) * dist - dist * 0.4}px`,
        size: 2.5 + Math.random() * 3,
      };
    });
    setBursts(sparks);
    setTimeout(() => setBursts([]), 750);
  }

  async function handleClick() {
    if (!unlocked || todayCheckedIn || loading) return;
    spawnBurst();
    setLoading(true);
    setError(null);
    try {
      await onCheckIn();
    } catch (e) {
      setError(e.message || "Couldn't seal today's link.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = !unlocked || todayCheckedIn || loading;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {bursts.map((s) => (
          <span
            key={s.id}
            className="absolute left-1/2 top-1/2 rounded-full pointer-events-none animate-sparkOut"
            style={{
              width: s.size,
              height: s.size,
              background: "#FFB347",
              boxShadow: "0 0 6px 1px rgba(255,179,71,0.8)",
              "--sx": s.sx,
              "--sy": s.sy,
            }}
          />
        ))}
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`focus-ring group relative px-8 py-3 rounded-full font-body font-semibold tracking-wide transition-all duration-300
            ${
              todayCheckedIn
                ? "bg-midnight-panel text-ember-bright border border-ember/40 cursor-default"
                : unlocked
                ? "bg-ember text-midnight shadow-ember hover:bg-ember-bright hover:scale-[1.03] active:scale-90"
                : "bg-midnight-panel text-slatemuted border border-brokenlink cursor-not-allowed"
            }`}
        >
          {todayCheckedIn
            ? "✓ Link sealed for today"
            : loading
            ? "Sealing…"
            : unlocked
            ? "Seal today's link"
            : "Locked until the forge opens"}
        </button>
      </div>
      {error && (
        <p className="text-xs font-mono text-ember-bright/90 animate-shake">
          {error}
        </p>
      )}
    </div>
  );
}
