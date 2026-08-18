import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";
import Clock from "./components/Clock";
import Flame from "./components/Flame";
import CheckInRitual from "./components/CheckInRitual";
import ChainCalendar from "./components/ChainCalendar";
import NotesJournal from "./components/NotesJournal";
import ActivityGrid from "./components/ActivityGrid";
import EmberParticles from "./components/EmberParticles";
import SealCelebration from "./components/SealCelebration";
import Toast from "./components/Toast";

export default function App() {
  const [state, setState] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [celebrateStreak, setCelebrateStreak] = useState(null);
  const prevCheckedInRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const s = await api.getState();
      setState(s);
      setLoadError(null);
    } catch (e) {
      setLoadError(
        "Can't reach the backend. Make sure the API server is running on port 3001."
      );
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000); // keep unlock/streak state fresh
    return () => clearInterval(id);
  }, [refresh]);

  async function handleCheckIn() {
    const res = await api.checkIn();
    setState(res.state);
  }

  async function handleAddNote(text) {
    const res = await api.addNote(text);
    setState(res.state);
  }

  async function handleDeleteNote(id) {
    const res = await api.deleteNote(id);
    setState(res.state);
  }

  async function handleEditNote(id, text) {
    const res = await api.editNote(id, text);
    setState(res.state);
  }

  async function handleResetStreak() {
    const res = await api.resetStreak();
    setState(res.state);
  }

  // Trigger the seal celebration exactly once, the moment todayCheckedIn
  // flips from false -> true.
  useEffect(() => {
    if (!state) return;
    if (state.todayCheckedIn && !prevCheckedInRef.current) {
      setCelebrateStreak(state.streak);
    }
    prevCheckedInRef.current = state.todayCheckedIn;
  }, [state]);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative">
        <EmberParticles count={10} />
        <div className="max-w-sm text-center relative z-10 animate-rise">
          <p className="font-display text-2xl text-lavender mb-2">
            The forge is cold.
          </p>
          <p className="text-sm text-slatemuted font-body">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <EmberParticles count={10} />
        <p className="font-mono text-sm text-slatemuted animate-flicker relative z-10">
          waking the flame…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 gap-10 relative">
      <EmberParticles />

      <Toast message={loadError} />

      {celebrateStreak !== null && (
        <SealCelebration
          streak={celebrateStreak}
          onClose={() => setCelebrateStreak(null)}
        />
      )}

      <header className="text-center relative z-10 animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ember mb-1">
          Streak Marker
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-lavender font-semibold">
          Forge one link a day
        </h1>
      </header>

      <div className="relative z-10">
        <Clock
          unlocked={state.unlocked}
          nextUnlockAt={state.nextUnlockAt}
          todayCheckedIn={state.todayCheckedIn}
        />
      </div>

      <div className="relative z-10">
        <Flame streak={state.streak} longestStreak={state.longestStreak} />
      </div>

      <div className="relative z-10">
        <CheckInRitual
          unlocked={state.unlocked}
          todayCheckedIn={state.todayCheckedIn}
          onCheckIn={handleCheckIn}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-6 max-w-md relative z-10">
        <ChainCalendar
          checkins={state.checkins}
          today={state.today}
          unlocked={state.unlocked}
        />
        <ActivityGrid
          checkins={state.checkins}
          today={state.today}
          unlocked={state.unlocked}
          streak={state.streak}
          onReset={handleResetStreak}
        />
        <NotesJournal
          notes={state.notes}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
          onEdit={handleEditNote}
        />
      </div>

      <footer className="text-center pt-4 relative z-10">
        <p className="font-mono text-[10px] text-slatemuted/60 uppercase tracking-widest">
          one user · no accounts · the chain remembers
        </p>
      </footer>
    </div>
  );
}
