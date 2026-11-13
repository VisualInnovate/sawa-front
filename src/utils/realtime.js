// The real-time connection to the backend's Reverb server (wss://<backend>/app), for the staff dashboard and for the
// parents' portal. One connection per page; private channels are signed by api/broadcasting/auth with the bearer
// token of whoever is signed in (staff or parent). Without a key in the build it stays off and nothing breaks.
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo = null;
let tokenInUse = null;

const backendHost = () => {
  try {
    return new URL(axios.defaults.baseURL).host;
  } catch {
    return window.location.host;
  }
};

/** Connects (or reuses the connection) with this token; returns Echo, or null when real time is not configured. */
export function connectRealtime(token) {
  const key = import.meta.env.VITE_REVERB_APP_KEY;
  if (!key || !token) return null;
  if (echo && tokenInUse === token) return echo;
  disconnectRealtime();
  window.Pusher = Pusher;
  tokenInUse = token;
  const host = import.meta.env.VITE_REVERB_HOST || backendHost();
  echo = new Echo({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 443),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT || 443),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || "https") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: new URL("api/broadcasting/auth", axios.defaults.baseURL).toString(),
    auth: { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } },
  });
  return echo;
}

export function disconnectRealtime() {
  try {
    echo?.disconnect();
  } catch {
    // already closed
  }
  echo = null;
  tokenInUse = null;
}

export const realtime = () => echo;
