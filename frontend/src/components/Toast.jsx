export default function Toast({ message, tone = "error" }) {
  if (!message) return null;
  return (
    <div
      className="fixed top-5 left-1/2 z-50 animate-toastIn animate-shake"
      role="alert"
    >
      <div
        className={`px-4 py-2.5 rounded-full font-mono text-xs backdrop-blur-sm border shadow-emberSoft
          ${
            tone === "error"
              ? "bg-midnight-panel/95 border-ember/50 text-ember-bright"
              : "bg-midnight-panel/95 border-ember-bright/50 text-lavender"
          }`}
      >
        {message}
      </div>
    </div>
  );
}
