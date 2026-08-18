# Streak Marker

A single-user streak tracker. Calendar, live clock, streak counter, a
daily "seal the link" check-in that only unlocks late at night, and a
notes journal. No login — it's just for you.

**Design concept:** the streak is a forged chain. Each day you check in
is a link sealed onto the chain; a missed day shows as a broken link on
the calendar. The check-in ritual only unlocks at **11:30 PM** by
default (configurable), so it works as an end-of-day commitment: "did
I actually do the thing today?"

## Stack

- **Frontend:** Vite + React + Tailwind CSS
- **Backend:** Node.js + Express, storing data in a flat `db.json` file
  (no database setup needed — it's one user, this is plenty)

## Project structure

```
streak-app/
├── backend/          # Express API
│   ├── server.js
│   ├── package.json
│   └── .env.example  # copy to .env to change the unlock time
└── frontend/         # Vite + React + Tailwind app
    ├── src/
    └── package.json
```

## Running it locally

You'll need Node.js 18+ installed. Two terminals, one for each half:

### 1. Backend

```bash
cd backend
npm install
npm start
```

This starts the API on `http://localhost:3001` and creates
`backend/db.json` on first run to store your check-ins and notes.

By default, check-in unlocks at **23:30 (11:30 PM)** local server
time. To change it, copy `.env.example` to `.env` in `backend/` and
edit `CHECKIN_HOUR` / `CHECKIN_MINUTE`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

This starts the app on `http://localhost:5173`. It proxies `/api`
requests to the backend, so make sure the backend is running first.

Open `http://localhost:5173` in your browser.

## How it works

- **Check-in ("Seal today's link")** — only clickable after the
  configured unlock time, and only once per day. It marks today's
  date as checked in.
- **Streak counter** — counts consecutive checked-in days ending today
  or yesterday. If you miss a day, it resets to 0 (your history stays
  on the calendar, just not counted as a "live" streak).
- **Calendar** — every day renders as a chain link: glowing amber if
  sealed, dim/broken if missed, flickering if it's today and still
  unsealed.
- **Journal** — free-text notes, one or many per day, newest first.

## Building for production

```bash
cd frontend
npm run build
```

Outputs static files to `frontend/dist/` — serve them with any static
host, pointing `/api` at wherever you run the backend (a small reverse
proxy or setting `VITE`-time env if you want to hit a different origin).
The backend itself can run anywhere Node runs — a small VPS, a
Raspberry Pi, or even alongside the frontend on one machine.
