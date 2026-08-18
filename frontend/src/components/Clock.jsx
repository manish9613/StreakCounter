import { useEffect, useState } from "react";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function Clock({ unlocked, nextUnlockAt, todayCheckedIn }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;

  const countdown = nextUnlockAt
    ? formatCountdown(new Date(nextUnlockAt).getTime() - now.getTime())
    : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="font-mono text-4xl sm:text-5xl tracking-widest text-lavender transition-all duration-500"
        style={
          unlocked && !todayCheckedIn
            ? { textShadow: "0 0 18px rgba(255,107,53,0.45)" }
            : undefined
        }
      >
        {timeStr}
      </div>
      <div className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em]">
        {todayCheckedIn ? (
          <span className="text-ember-bright animate-rise">Today's link is sealed</span>
        ) : unlocked ? (
          <span className="text-ember animate-flicker">
            The forge is open — seal your link
          </span>
        ) : (
          <span className="text-slatemuted">
            Forge opens in{" "}
            <span className="text-lavender">{countdown}</span>
          </span>
        )}
      </div>
    </div>
  );
}
