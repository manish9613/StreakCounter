import { useMemo, useState } from "react";

const DAY_COUNT = 210; // roughly 30 weeks of history, oldest -> newest

function pad(n) {
  return String(n).padStart(2, "0");
}

function toKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatLabel(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ActivityGrid({
  checkins,
  today,
  unlocked,
  streak,
  onReset,
}) {
  const checkinSet = useMemo(() => new Set(checkins), [checkins]);
  const [hovered, setHovered] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);

  const days = useMemo(() => {
    const out = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = DAY_COUNT - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const key = toKey(d);
      let status = "empty";
      if (checkinSet.has(key)) status = "sealed";
      else if (key === today) status = unlocked ? "open" : "future";
      out.push({ key, status });
    }
    return out;
  }, [checkinSet, today, unlocked]);

  const totalActiveDays = checkins.length;

  async function handleReset() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setResetting(true);
    try {
      await onReset();
    } finally {
      setResetting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-midnight-soft/60 border border-brokenlink/60 rounded-2xl p-5 backdrop-blur-sm">
      <h2 className="font-body font-semibold text-lavender text-sm uppercase tracking-wide mb-3">
        Learning History
      </h2>

      <div className="relative">
        {hovered && (
          <div
            className="absolute -top-8 z-10 whitespace-nowrap px-2 py-1 rounded-md bg-midnight-panel border border-brokenlink/70 text-[10px] font-mono text-lavender animate-popIn shadow-emberSoft"
            style={{ left: hovered.x, transform: "translateX(-50%)" }}
            role="tooltip"
          >
            {formatLabel(hovered.key)}
            {hovered.status === "sealed" ? " · sealed" : ""}
          </div>
        )}
        <div className="flex flex-wrap gap-[3px]">
          {days.map((day, i) => {
            const cls =
              day.status === "sealed"
                ? "bg-ember-bright shadow-[0_0_5px_rgba(255,179,71,0.65)]"
                : day.status === "open"
                ? "bg-ember/70 animate-flicker"
                : day.status === "future"
                ? "bg-midnight-panel"
                : "bg-brokenlink/60";
            return (
              <div
                key={day.key}
                className={`w-[9px] h-[9px] rounded-[2px] cursor-default transition-transform hover:scale-150 animate-cellPop ${cls}`}
                style={{ animationDelay: `${Math.min(i, 60) * 4}ms` }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const parentRect =
                    e.currentTarget.parentElement.getBoundingClientRect();
                  setHovered({
                    key: day.key,
                    status: day.status,
                    x: rect.left - parentRect.left + rect.width / 2,
                  });
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <div className="px-3 py-1.5 rounded-full bg-midnight border border-brokenlink/70 font-mono text-[11px] text-lavender">
          Current Streak: <span className="text-ember-bright">{streak}</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-midnight border border-brokenlink/70 font-mono text-[11px] text-lavender">
          Total Active Days:{" "}
          <span className="text-ember-bright">{totalActiveDays}</span>
        </div>
        <button
          onClick={handleReset}
          onBlur={() => setConfirming(false)}
          disabled={resetting}
          className={`focus-ring px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wide transition-all
            ${
              confirming
                ? "bg-ember-bright text-midnight animate-shake"
                : "bg-ember/90 text-midnight hover:bg-ember-bright hover:scale-105"
            } active:scale-95 disabled:opacity-60`}
        >
          {resetting
            ? "Resetting…"
            : confirming
            ? "Tap again to confirm"
            : "Reset Streak"}
        </button>
      </div>
    </div>
  );
}
