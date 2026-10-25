// What waits for the signed-in user (the menu's counters): trackings to approve, the classes' generalizations and the
// generalizations sent to them — or, on the parents' portal, the home generalizations. Read every minute, when the
// window comes back into focus, and right after a request is answered (refreshPendingCounts()).
import axios from "axios";
import { reactive } from "vue";

export const pendingCounts = reactive({ staff: {}, parent: {} });

const REFRESH_MS = 60_000;
let timers = {};

async function load(side) {
  try {
    const { data } = await axios.get(side === "parent" ? "/api/parent/pending-counts" : "api/pending-counts");
    pendingCounts[side] = data.data ?? {};
  } catch {
    // Not signed in or offline: keep what was shown.
  }
}

export function refreshPendingCounts(side = "staff") {
  return load(side);
}

/** Starts reading the counts for one side; returns the function that stops it. */
export function watchPendingCounts(side = "staff") {
  load(side);
  clearInterval(timers[side]);
  timers[side] = setInterval(() => load(side), REFRESH_MS);
  const onFocus = () => load(side);
  window.addEventListener("focus", onFocus);
  return () => {
    clearInterval(timers[side]);
    window.removeEventListener("focus", onFocus);
  };
}

/** A menu item's count: its own badge key, or (a group) the sum of its children's. */
export function menuCount(item) {
  if (item.children) return item.children.reduce((sum, child) => sum + menuCount(child), 0);
  return item.badge ? Number(pendingCounts.staff[item.badge] ?? 0) : 0;
}
