/* «التواصل»: push notifications of calls and messages while the page is in the background or closed.
   The server sends {kind: call | call_end | message, title, body, url, tag, call_id, conversation_id}. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const RING = [600, 300, 600, 300, 600, 300, 600, 300, 600, 300, 600];

self.addEventListener("push", (event) => {
  let d = {};
  try {
    d = event.data ? event.data.json() : {};
  } catch (e) {
    d = { kind: "message", title: "سوا", body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const inFront = windows.some((w) => w.visibilityState === "visible" && w.focused);
      // The open page shows the message itself and rings itself.
      if (inFront && (d.kind === "message" || d.kind === "call")) return;
      if (d.kind === "call_end") {
        (await self.registration.getNotifications({ tag: d.tag })).forEach((n) => n.close());
      }
      const isCall = d.kind === "call";
      await self.registration.showNotification(d.title || "سوا", {
        body: d.body || "",
        tag: d.tag,
        renotify: true,
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-72.png",
        dir: "rtl",
        lang: "ar",
        requireInteraction: isCall,
        vibrate: isCall ? RING : [200, 100, 200],
        data: d,
        actions: isCall ? [{ action: "answer", title: "رد" }, { action: "open", title: "فتح" }] : [],
      });
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  const d = event.notification.data || {};
  event.notification.close();
  let url = d.url || "/";
  if (event.action === "answer" && d.call_id) url += (url.includes("?") ? "&" : "?") + "answer=1";
  event.waitUntil(
    (async () => {
      const target = new URL(url, self.location.origin).href;
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const app = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (app) {
        // The open page answers / opens the conversation without reloading.
        app.postMessage({ type: "comm-notification", action: event.action || "open", data: d });
        try {
          await app.focus();
        } catch (e) {}
        return;
      }
      await self.clients.openWindow(target);
    })()
  );
});
