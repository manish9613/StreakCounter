import { useState } from "react";

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NotesJournal({ notes, onAdd, onDelete, onEdit }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [focused, setFocused] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await onAdd(text.trim());
      setText("");
    } finally {
      setBusy(false);
    }
  }

  function handleDelete(id) {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onDelete(id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 320);
  }

  function startEdit(note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(id) {
    if (!editText.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      await onEdit(id, editText.trim());
      setEditingId(null);
      setEditText("");
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-midnight-soft/60 border border-brokenlink/60 rounded-2xl p-5 backdrop-blur-sm">
      <h2 className="font-body font-semibold text-lavender text-sm uppercase tracking-wide mb-3">
        Journal
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="What kept the fire going today?"
          rows={2}
          className={`focus-ring w-full bg-midnight border rounded-lg px-3 py-2 text-sm text-lavender placeholder:text-slatemuted/60 font-body resize-none transition-all duration-300
            ${focused ? "border-ember/70 shadow-emberSoft" : "border-brokenlink"}`}
        />
        <button
          type="submit"
          disabled={!text.trim() || busy}
          className="focus-ring self-end px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-ember/90 text-midnight disabled:bg-brokenlink disabled:text-slatemuted transition-all hover:bg-ember-bright hover:scale-105 active:scale-95"
        >
          {busy ? "Adding…" : "Add note"}
        </button>
      </form>

      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {notes.length === 0 && (
          <p className="text-xs text-slatemuted font-body italic animate-rise">
            No entries yet — the first one starts the journal.
          </p>
        )}
        {notes.map((n) => {
          const isEditing = editingId === n.id;
          return (
            <div
              key={n.id}
              className={`group flex items-start justify-between gap-2 bg-midnight/60 border rounded-lg px-3 py-2 origin-top transition-colors
                ${isEditing ? "border-ember/70 shadow-emberSoft" : "border-brokenlink/50"}
                ${removingIds.has(n.id) ? "animate-noteOut" : "animate-rise"}`}
            >
              <div className="flex-1">
                <div className="font-mono text-[10px] text-ember-bright/90 uppercase tracking-wide mb-0.5">
                  {formatDate(n.date)}
                  {n.updatedAt && !isEditing && (
                    <span className="text-slatemuted/70 normal-case tracking-normal">
                      {" "}
                      · edited
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="focus-ring w-full bg-midnight border border-ember/60 rounded-lg px-2 py-1.5 text-sm text-lavender font-body resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="focus-ring px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide text-slatemuted hover:text-lavender transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(n.id)}
                        disabled={!editText.trim() || savingEdit}
                        className="focus-ring px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-ember/90 text-midnight disabled:bg-brokenlink disabled:text-slatemuted hover:bg-ember-bright transition-all hover:scale-105 active:scale-95"
                      >
                        {savingEdit ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-lavender/90 font-body whitespace-pre-wrap break-words">
                    {n.text}
                  </p>
                )}
              </div>

              {!isEditing && (
                <div className="flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(n)}
                    className="focus-ring text-slatemuted hover:text-ember-bright hover:scale-125 text-xs transition-all"
                    aria-label="Edit note"
                    title="Edit note"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="focus-ring text-slatemuted hover:text-ember-bright hover:scale-125 text-xs transition-all"
                    aria-label="Delete note"
                    title="Delete note"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
