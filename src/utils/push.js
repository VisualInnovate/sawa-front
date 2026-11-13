// Push notifications of «التواصل»: the service worker (public/sw.js) shows a call or a message while the page is in
// the background or closed (on a phone: the browser closed; on iPhone: only from the app added to the home screen).
import { reactive } from "vue";
import { api } from "./communication";

const DISMISS_KEY = "comm-push-dismissed";
const ua = navigator.userAgent || "";
const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const standalone = window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;

export const push = reactive({
  supported: "serviceWorker" in navigator && "PushManager" in window && "Notification" in window,
  permission: "Notification" in window ? Notification.permission : "denied",
  subscribed: false,
  // An iPhone in Safari: push needs the app added to the home screen first.
  needsInstall: ios && !standalone,
  dismissed: (() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  })(),
});

let registration = null;

export async function registerWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    registration ??= await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return registration;
  } catch {
    return null;
  }
}

const keyBytes = (base64) => {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

/** Subscribes this browser for the signed-in side when notifications are already allowed. */
export async function initPush() {
  if (!push.supported) return;
  await registerWorker();
  push.permission = Notification.permission;
  if (push.permission === "granted") await subscribe();
}

/** From a button (the browser asks the person). */
export async function enablePush() {
  if (!push.supported) return false;
  push.permission = await Notification.requestPermission();
  if (push.permission === "granted") await subscribe();
  return push.subscribed;
}

export function dismissPush() {
  push.dismissed = true;
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // this visit only
  }
}

async function subscribe() {
  try {
    const reg = await registerWorker();
    if (!reg) return;
    const { public_key: key } = await api("get", "push/key");
    if (!key) return;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(key) });
    const json = sub.toJSON();
    await api("post", "push/subscribe", { endpoint: json.endpoint, keys: json.keys, content_encoding: (PushManager.supportedContentEncodings || ["aes128gcm"])[0] });
    push.subscribed = true;
  } catch {
    push.subscribed = false;
  }
}

/** Signing out on a shared device: this browser stops receiving the account's calls and messages. */
export async function unsubscribePush() {
  try {
    const sub = await (await navigator.serviceWorker?.getRegistration("/"))?.pushManager.getSubscription();
    if (!sub) return;
    // The push service forgets the endpoint; the server drops it at its next send (410 Gone).
    await sub.unsubscribe();
  } catch {
    // nothing to do
  }
}

/** Closes the notification of a call answered or finished here. */
export async function closeCallNotification(callId) {
  try {
    const reg = await navigator.serviceWorker?.getRegistration("/");
    (await reg?.getNotifications({ tag: `call-${callId}` }))?.forEach((n) => n.close());
  } catch {
    // none
  }
}
