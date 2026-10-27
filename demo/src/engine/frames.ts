// الإطارات: الهاتف والحاسوب، كلٌّ منهما نسخة حقيقية من التطبيق داخل iframe من الأصل نفسه.
import { reactive } from "vue";
import type { Device } from "@demo/store/demo";
import type { Target } from "./actions";

export const frames = reactive<Record<Device, { el: HTMLIFrameElement | null; ready: boolean }>>({
  phone: { el: null, ready: false },
  desktop: { el: null, ready: false },
});

export const win = (d: Device) => frames[d].el?.contentWindow ?? null;
export const doc = (d: Device) => frames[d].el?.contentDocument ?? null;

/** يجد العنصر: محدد + نصّ يحتويه (اختياري) + ترتيب. */
export function find(target: Target): HTMLElement | null {
  const d = doc(target.frame);
  if (!d) return null;
  let list = [...d.querySelectorAll<HTMLElement>(target.sel)];
  if (target.text) {
    const needle = target.text.trim();
    list = list.filter((el) => (el.textContent ?? "").replace(/\s+/g, " ").includes(needle));
    // الأعمق أولاً: عنصر النص نفسه لا حاوياته.
    list = list.filter((el) => !list.some((other) => other !== el && el.contains(other)));
  }
  return list[target.nth ?? 0] ?? null;
}

/** مستطيل العنصر في إحداثيات الشِّل، مع احتساب تصغير الإطار (transform: scale). */
export function rectInShell(target: Target, el: HTMLElement): DOMRect {
  const frame = frames[target.frame].el!;
  const fr = frame.getBoundingClientRect();
  const scale = fr.width / frame.offsetWidth;
  const r = el.getBoundingClientRect();
  return new DOMRect(fr.left + r.left * scale, fr.top + r.top * scale, r.width * scale, r.height * scale);
}

/** تنقّل داخل الإطار عبر history + popstate (vue-router يستمع إليه) دون إعادة تحميل. */
export async function navigate(d: Device, path: string) {
  const w = win(d);
  if (!w) return;
  // المسار نفسه: الصفحة لا تُعاد قراءتها بالتنقّل، فنعيد تحميل الإطار.
  if (w.location.pathname + w.location.search === path) return load(d, path);
  // التطبيق لم يركَّب بعد (وحدات Vite ما زالت تُحمَّل): لا مستمع للتنقّل، فنحمّل الإطار على المسار مباشرة.
  const end = performance.now() + 4000;
  while (!(w.document.getElementById("app")?.children.length) && performance.now() < end) await new Promise((r) => setTimeout(r, 60));
  if (!w.document.getElementById("app")?.children.length) return load(d, path);
  const app = w.document.getElementById("app")!;
  const changed = new Promise<void>((resolve) => {
    // ننتظر أول تغيير في الشجرة بعد التنقّل حتى لا يلتقط waitFor عناصر الصفحة السابقة.
    const mo = new MutationObserver(() => { mo.disconnect(); resolve(); });
    mo.observe(app, { childList: true, subtree: true, attributes: true });
    setTimeout(() => { mo.disconnect(); resolve(); }, 2500);
  });
  w.history.pushState({}, "", path);
  w.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
  await changed;
  await new Promise((r) => setTimeout(r, 80));
}

/** إعادة تحميل الإطار على مسار، والانتظار حتى يجهز. */
export function load(d: Device, path: string) {
  return new Promise<void>((resolve) => {
    const el = frames[d].el;
    if (!el) return resolve();
    frames[d].ready = false;
    const onLoad = () => {
      el.removeEventListener("load", onLoad);
      frames[d].ready = true;
      hookFrame(d);
      resolve();
    };
    el.addEventListener("load", onLoad);
    el.src = path;
  });
}

/** يمرّر مفاتيح الإطار إلى الشِّل ويخفي ما لا يخدم العرض. */
export function hookFrame(d: Device) {
  const w = win(d);
  if (!w) return;
  w.addEventListener("keydown", (e) => window.dispatchEvent(new KeyboardEvent("keydown", { key: e.key, bubbles: true })));
}

/** جلسة لوحة التحكم وجلسة الأهل في localStorage (الأصل مشترك بين الشِّل والإطارَين). */
export function setSessions(staffUser: Record<string, any> | null, parent: Record<string, any> | null) {
  const put = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));
  if (staffUser) {
    put("authenticated", true); put("token", "demo-token"); put("authUser", staffUser);
    put("userPermissions", staffUser.roles_permissions ?? []); put("type", staffUser.type); put("user_id", staffUser.user_id);
  } else {
    ["authenticated", "token", "authUser", "userPermissions", "type", "user_id"].forEach((k) => localStorage.removeItem(k));
  }
  if (parent) {
    put("parentAuth", true); put("parentToken", "demo-parent-token"); put("parent", parent); put("parent_id", parent.parent_id);
  } else {
    ["parentAuth", "parentToken", "parent", "parent_id", "lastRoute"].forEach((k) => localStorage.removeItem(k));
  }
  localStorage.setItem("appLang", "ar");
  localStorage.setItem("isRtl", "true");
}
