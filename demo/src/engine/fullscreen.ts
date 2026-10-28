// ملء الشاشة (Fullscreen API) للشِّل كله: زر في شريط التحكم أو المفتاح F (وF11 حيث يصل إلى الصفحة).
import { useDemo } from "@demo/store/demo";

export function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen().catch(() => {});
}

/** يُبقي store.fullscreen متزامناً مع حالة المتصفح (بما فيها الخروج بـEsc). */
export function watchFullscreen() {
  const store = useDemo();
  const sync = () => { store.fullscreen = !!document.fullscreenElement; };
  document.addEventListener("fullscreenchange", sync);
  sync();
  return () => document.removeEventListener("fullscreenchange", sync);
}
