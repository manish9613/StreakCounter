import { useMemo, useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function toKey(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

const STATUS_LABEL = {
  sealed: "Sealed",
  missed: "Broken link",
  open: "Forge open — seal it",
  future: "Not yet",
};

function LinkIcon({ state }) {
  // state: 'sealed' | 'missed' | 'open' | 'future'
  const stroke =
    state === "sealed"
      ? "#FFB347"
      : state === "missed"
      ? "#3A4059"
      : state === "open"
      ? "#FF6B35"
      : "#242B45";
  const fill = state === "sealed" ? "rgba(255,179,71,0.18)" : "transparent";

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={state === "open" ? "animate-flicker" : ""}>
      <rect
        x="3" y="8" width="10" height="8" rx="4"
        fill={fill}
        stroke={stroke}
        strokeWidth={state === "future" ? 1 : 1.6}
      />
      <rect
        x="11" y="8" width="10" height="8" rx="4"
        fill={fill}
        stroke={stroke}
        strokeWidth={state === "future" ? 1 : 1.6}
      />
    </svg>
  );
}

export default function ChainCalendar({ checkins, today, unlocked }) {
  const checkinSet = useMemo(() => new Set(checkins), [checkins]);
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(null);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function statusFor(day) {
    if (!day) return null;
    const key = toKey(viewYear, viewMonth, day);
    if (checkinSet.has(key)) return "sealed";
    if (key === today) return unlocked ? "open" : "future";
    if (key > today) return "future";
    return "missed";
  }

  function shiftMonth(delta) {
    setDirection(delta);
    setHovered(null);
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  return (
    <div className="w-full max-w-md bg-midnight-soft/60 border border-brokenlink/60 rounded-2xl p-5 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => shiftMonth(-1)}
          className="focus-ring text-slatemuted hover:text-lavender px-2 py-1 transition-all hover:scale-125 active:scale-95"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div
          key={`${viewYear}-${viewMonth}`}
          className={`font-body font-semibold text-lavender tracking-wide text-sm uppercase ${
            direction > 0 ? "animate-slideSwapLeft" : "animate-slideSwapRight"
          }`}
        >
          {MONTHS[viewMonth]} {viewYear}
        </div>
        <button
          onClick={() => shiftMonth(1)}
          className="focus-ring text-slatemuted hover:text-lavender px-2 py-1 transition-all hover:scale-125 active:scale-95"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="text-center font-mono text-[10px] text-slatemuted uppercase"
          >
            {w}
          </div>
        ))}
      </div>

      <div
        key={`${viewYear}-${viewMonth}-grid`}
        className="grid grid-cols-7 gap-y-2"
      >
        {cells.map((day, i) => {
          const status = statusFor(day);
          const key = day ? toKey(viewYear, viewMonth, day) : null;
          const isToday = day && key === today;
          return (
            <div
              key={i}
              className="relative flex flex-col items-center gap-1 py-1"
              onMouseEnter={() => day && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {day && (
                <>
                  {hovered === i && (
                    <div
                      className="absolute -top-8 z-10 whitespace-nowrap px-2 py-1 rounded-md bg-midnight-panel border border-brokenlink/70 text-[10px] font-mono text-lavender animate-popIn shadow-emberSoft"
                      role="tooltip"
                    >
                      {STATUS_LABEL[status]}
                    </div>
                  )}
                  <span
                    className={`font-mono text-[10px] transition-colors ${
                      isToday ? "text-ember-bright" : "text-slatemuted/80"
                    }`}
                  >
                    {day}
                  </span>
                  <div
                    className="cursor-default transition-transform hover:scale-125 animate-cellPop"
                    style={{ animationDelay: `${Math.min(i, 20) * 12}ms` }}
                  >
                    <LinkIcon state={status} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[10px] text-slatemuted uppercase tracking-wide">
        <span className="flex items-center gap-1">
          <LinkIcon state="sealed" /> sealed
        </span>
        <span className="flex items-center gap-1">
          <LinkIcon state="missed" /> broken
        </span>
        <span className="flex items-center gap-1">
          <LinkIcon state="open" /> today
        </span>
      </div>
    </div>
  );
}
