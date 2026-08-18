// Streak Marker — backend
// Plain Express + a JSON file on disk. No database, no auth, one user.

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

// --- tiny .env loader (avoids adding a dotenv dependency) ---
(function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
})();

const PORT = process.env.PORT || 3001;
const CHECKIN_HOUR = parseInt(process.env.CHECKIN_HOUR ?? "23", 10);
const CHECKIN_MINUTE = parseInt(process.env.CHECKIN_MINUTE ?? "30", 10);

const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { checkins: [], notes: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- date helpers, all in server-local time, keyed as YYYY-MM-DD ---
function pad(n) {
  return String(n).padStart(2, "0");
}

function dateToStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayStr() {
  return dateToStr(new Date());
}

function shiftDateStr(str, deltaDays) {
  const [y, m, d] = str.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  return dateToStr(dt);
}

function isUnlocked(now = new Date()) {
  const h = now.getHours();
  const m = now.getMinutes();
  return h > CHECKIN_HOUR || (h === CHECKIN_HOUR && m >= CHECKIN_MINUTE);
}

function nextUnlockISO(now = new Date()) {
  const unlock = new Date(now);
  unlock.setHours(CHECKIN_HOUR, CHECKIN_MINUTE, 0, 0);
  if (unlock <= now) unlock.setDate(unlock.getDate() + 1);
  return unlock.toISOString();
}

function calcStreak(checkins) {
  if (!checkins.length) return 0;
  const set = new Set(checkins);
  const sorted = [...checkins].sort();
  const last = sorted[sorted.length - 1];
  const today = todayStr();
  const yesterday = shiftDateStr(today, -1);
  // The streak only counts as "alive" if the most recent seal was
  // today or yesterday — otherwise the chain has broken.
  if (last !== today && last !== yesterday) return 0;
  let streak = 0;
  let cursor = last;
  while (set.has(cursor)) {
    streak++;
    cursor = shiftDateStr(cursor, -1);
  }
  return streak;
}

function longestStreak(checkins) {
  if (!checkins.length) return 0;
  const sorted = [...checkins].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (shiftDateStr(sorted[i - 1], 1) === sorted[i]) {
      run++;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }
  return longest;
}

function buildState() {
  const db = readDB();
  const today = todayStr();
  return {
    checkins: db.checkins,
    notes: db.notes.sort((a, b) => (a.date < b.date ? 1 : -1)),
    streak: calcStreak(db.checkins),
    longestStreak: longestStreak(db.checkins),
    todayCheckedIn: db.checkins.includes(today),
    today,
    unlocked: isUnlocked(),
    nextUnlockAt: nextUnlockISO(),
    checkinHour: CHECKIN_HOUR,
    checkinMinute: CHECKIN_MINUTE,
    serverNow: new Date().toISOString(),
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/state", (req, res) => {
  res.json(buildState());
});

app.post("/api/checkin", (req, res) => {
  const db = readDB();
  const today = todayStr();

  if (db.checkins.includes(today)) {
    return res.status(200).json({ ok: true, alreadySealed: true, state: buildState() });
  }

  if (!isUnlocked()) {
    return res.status(403).json({
      ok: false,
      error: `Check-in unlocks at ${pad(CHECKIN_HOUR)}:${pad(CHECKIN_MINUTE)}.`,
      nextUnlockAt: nextUnlockISO(),
    });
  }

  db.checkins.push(today);
  writeDB(db);
  res.status(201).json({ ok: true, alreadySealed: false, state: buildState() });
});

app.get("/api/notes", (req, res) => {
  const db = readDB();
  res.json(db.notes.sort((a, b) => (a.date < b.date ? 1 : -1)));
});

app.post("/api/notes", (req, res) => {
  const { text, date } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ ok: false, error: "Note text is required." });
  }
  const db = readDB();
  const note = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    date: date || todayStr(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  db.notes.push(note);
  writeDB(db);
  res.status(201).json({ ok: true, note, state: buildState() });
});

app.delete("/api/notes/:id", (req, res) => {
  const db = readDB();
  const before = db.notes.length;
  db.notes = db.notes.filter((n) => n.id !== req.params.id);
  if (db.notes.length === before) {
    return res.status(404).json({ ok: false, error: "Note not found." });
  }
  writeDB(db);
  res.json({ ok: true, state: buildState() });
});

// Edit an existing note's text (the "Edit Feature").
app.put("/api/notes/:id", (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ ok: false, error: "Note text is required." });
  }
  const db = readDB();
  const note = db.notes.find((n) => n.id === req.params.id);
  if (!note) {
    return res.status(404).json({ ok: false, error: "Note not found." });
  }
  note.text = text.trim();
  note.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ ok: true, note, state: buildState() });
});

// Reset the streak — clears sealed days but keeps the journal/learning
// entries intact, since those are a record worth keeping.
app.post("/api/reset", (req, res) => {
  const db = readDB();
  db.checkins = [];
  writeDB(db);
  res.json({ ok: true, state: buildState() });
});

app.listen(PORT, () => {
  console.log(`Streak Marker API listening on http://localhost:${PORT}`);
  console.log(`Check-in unlocks daily at ${pad(CHECKIN_HOUR)}:${pad(CHECKIN_MINUTE)}`);
});
