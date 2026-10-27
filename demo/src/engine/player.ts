import { reactive } from "vue";
import type { Action, Target } from "./actions";
import { doc, find, frames, load, navigate, rectInShell, setSessions, win } from "./frames";
import type { DemoStore } from "@demo/store/demo";
import type { Backend } from "../../mock/backend";
import { staffByKey } from "../../scenario";

export interface Flight { id: number; label: string; from: DOMRect; to: DOMRect }

// حالة المؤشر المرئي والبطاقات الطائرة، تقرأها طبقة الرسم فوق المسرح.
export const fx = reactive({
  cursor: { x: -100, y: -100, visible: false, clicking: false },
  flights: [] as Flight[],
});

export class Cancelled extends Error {}

/** يشغّل أفعال فصل واحد على الإطارات؛ يحترم السرعة والإيقاف والتخطّي، ويُلغى عند القفز إلى فصل آخر. */
export class Player {
  cancelled = false;
  skipping = false;
  private flightId = 1;
  constructor(private store: DemoStore, private backend: Backend) {}

  cancel() { this.cancelled = true; }
  skip() { this.skipping = true; }

  private async sleep(ms: number) {
    if (this.cancelled) throw new Cancelled();
    if (this.skipping) return;
    const end = performance.now() + ms / this.store.speed;
    while (performance.now() < end || this.store.paused) {
      if (this.cancelled) throw new Cancelled();
      if (this.skipping) return;
      await new Promise((r) => setTimeout(r, 30));
    }
  }

  /** ينتظر عنصراً حتى يظهر (الواجهة الحقيقية تطلب بياناتها من الخادم الوهمي). */
  private async waitFor(target: Target, timeout = 15000): Promise<HTMLElement> {
    const end = performance.now() + timeout;
    while (performance.now() < end) {
      if (this.cancelled) throw new Cancelled();
      const el = find(target);
      if (el && el.offsetParent !== null) return el;
      await new Promise((r) => setTimeout(r, 60));
    }
    throw new Error(`[demo] لم يظهر العنصر: ${target.frame} ${target.sel} ${target.text ?? ""}`);
  }

  private async moveCursorTo(target: Target, hold = 350) {
    const el = await this.waitFor(target);
    this.reveal(target.frame, el);
    if (this.skipping) return el;
    await this.sleep(120);
    const r = rectInShell(target, el);
    fx.cursor.visible = true;
    fx.cursor.x = r.left + r.width / 2;
    fx.cursor.y = r.top + Math.min(r.height / 2, 24);
    await this.sleep(hold);
    return el;
  }

  private reveal(frame: Target["frame"], el: HTMLElement) {
    el.scrollIntoView({ block: "center", inline: "nearest", behavior: this.skipping ? "auto" : "smooth" });
  }

  private pressClick(el: HTMLElement) {
    // ضغطة حقيقية: pointer + mouse + click حتى تستجيب مكوّنات PrimeVue وFullCalendar.
    const w = el.ownerDocument.defaultView!;
    const r = el.getBoundingClientRect();
    const init = { bubbles: true, cancelable: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, view: w, button: 0 };
    el.dispatchEvent(new w.PointerEvent("pointerdown", { ...init, pointerId: 1, isPrimary: true }));
    el.dispatchEvent(new w.MouseEvent("mousedown", init));
    el.focus?.();
    el.dispatchEvent(new w.PointerEvent("pointerup", { ...init, pointerId: 1, isPrimary: true }));
    el.dispatchEvent(new w.MouseEvent("mouseup", init));
    el.dispatchEvent(new w.MouseEvent("click", init));
  }

  private setValue(el: HTMLElement, value: string) {
    const w = el.ownerDocument.defaultView!;
    const input = el as HTMLInputElement | HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new w.Event("input", { bubbles: true }));
  }

  async run(actions: Action[]) {
    for (const a of actions) {
      if (this.cancelled) throw new Cancelled();
      await this.step(a);
    }
    fx.cursor.visible = false;
  }

  /** تنفيذ فوري بلا حركة (لإعادة بناء فصل سابق عند القفز). */
  async runInstant(actions: Action[]) {
    this.skipping = true;
    await this.run(actions);
  }

  private async step(a: Action) {
    switch (a.type) {
      case "wait": return this.sleep(a.ms);
      case "caption": this.store.caption = a.text; return;
      case "db": a.run(this.backend.db); this.backend.onChange?.(); return this.sleep(200);
      case "focus":
        this.store.active = a.frame;
        return this.sleep(this.skipping ? 0 : 500);
      case "nav":
        await navigate(a.frame, typeof a.path === "function" ? a.path(this.backend.db) : a.path);
        return this.sleep(300);
      case "role": {
        const s = staffByKey(a.staff);
        this.backend.db.currentStaffId = s.id;
        this.store.staffKey = a.staff;
        setSessions(this.backend.db.userResource(s), this.parentSession());
        await load("desktop", a.path);
        return this.sleep(this.skipping ? 0 : 400);
      }
      case "waitFor":
        await this.waitFor(a.target, a.timeout);
        return;
      case "scroll": {
        const el = await this.waitFor(a.target);
        this.reveal(a.target.frame, el);
        return this.sleep(400);
      }
      case "highlight": {
        const el = await this.waitFor(a.target);
        this.reveal(a.target.frame, el);
        el.classList.add("demo-highlight");
        await this.sleep(a.ms ?? 1200);
        el.classList.remove("demo-highlight");
        return;
      }
      case "click": {
        const el = await this.moveCursorTo(a.target, a.hold ?? 350);
        if (!this.skipping) {
          fx.cursor.clicking = true;
          await this.sleep(160);
          fx.cursor.clicking = false;
        }
        this.pressClick(el);
        return this.sleep(350);
      }
      case "type": {
        let el = await this.moveCursorTo(a.target, 250);
        if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) {
          const inner = el.querySelector<HTMLElement>("input, textarea");
          if (inner) el = inner;
        }
        this.pressClick(el);
        const current = a.clear === false ? (el as HTMLInputElement).value : "";
        if (this.skipping) { this.setValue(el, current + a.text); return; }
        const delay = 1000 / (a.cps ?? 28);
        for (let i = 1; i <= a.text.length; i++) {
          this.setValue(el, current + a.text.slice(0, i));
          await this.sleep(delay);
          if (this.skipping) { this.setValue(el, current + a.text); break; }
        }
        // change + blur: InputNumber وDatePicker يثبّتان القيمة عند مغادرة الحقل.
        el.dispatchEvent(new (el.ownerDocument.defaultView!).Event("change", { bubbles: true }));
        el.dispatchEvent(new (el.ownerDocument.defaultView!).FocusEvent("blur"));
        el.dispatchEvent(new (el.ownerDocument.defaultView!).FocusEvent("focusout", { bubbles: true }));
        return this.sleep(200);
      }
      case "select": {
        // الزر المفتوح: جزء الـSelect الظاهر؛ القائمة تظهر في body الإطار نفسه.
        const el = await this.moveCursorTo(a.target, 300);
        this.pressClick(el);
        const d = doc(a.target.frame)!;
        const list: Target = { frame: a.target.frame, sel: ".p-select-option, .p-multiselect-option, .p-select-option-label, .p-multiselect-option > span", text: a.option };
        const opt = await this.moveCursorTo(list, 350);
        if (!this.skipping) { fx.cursor.clicking = true; await this.sleep(140); fx.cursor.clicking = false; }
        this.pressClick(opt.closest("li") ?? opt);
        await this.sleep(250);
        if (a.close !== false && d.querySelector(".p-multiselect-overlay")) {
          // MultiSelect يبقى مفتوحاً: ضغطة على الحقل نفسه تغلقه.
          this.pressClick(el);
          await this.sleep(150);
        }
        return;
      }
      case "fly": {
        const fromEl = await this.waitFor(a.from);
        this.reveal(a.from.frame, fromEl);
        const from = rectInShell(a.from, fromEl);
        let to: DOMRect | null = null;
        if (a.to === "counter") {
          const c = document.querySelector<HTMLElement>('[data-demo="counter-transferred"]');
          to = c?.getBoundingClientRect() ?? null;
        } else {
          const toEl = find(a.to);
          if (toEl) { this.reveal(a.to.frame, toEl); to = rectInShell(a.to, toEl); }
        }
        if (to && !this.skipping) {
          const flight: Flight = { id: this.flightId++, label: a.label, from, to };
          fx.flights.push(flight);
          await this.sleep(950);
          fx.flights.splice(fx.flights.indexOf(flight), 1);
        }
        if (a.counts !== false) this.store.transferred(typeof a.counts === "number" ? a.counts : 1);
        return this.sleep(150);
      }
    }
  }

  private parentSession() {
    const p = this.backend.db.parent;
    return p ? { parent_id: p.id, fname: p.fname, lname: p.lname, phone: p.phone, email: p.email, image: null } : null;
  }
}

export { frames, win };
