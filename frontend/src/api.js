const BASE = "/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  getState: () => fetch(`${BASE}/state`).then(handle),
  checkIn: () =>
    fetch(`${BASE}/checkin`, { method: "POST" }).then(handle),
  addNote: (text, date) =>
    fetch(`${BASE}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, date }),
    }).then(handle),
  deleteNote: (id) =>
    fetch(`${BASE}/notes/${id}`, { method: "DELETE" }).then(handle),
  editNote: (id, text) =>
    fetch(`${BASE}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then(handle),
  resetStreak: () =>
    fetch(`${BASE}/reset`, { method: "POST" }).then(handle),
};
