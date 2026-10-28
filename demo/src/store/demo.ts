import { defineStore } from "pinia";

export type Speed = 0.6 | 1 | 1.8;
export type Device = "phone" | "desktop";

/** حالة الشِّل فقط؛ بيانات الطفل تعيش في الخادم الوهمي (window.__demoBackend). */
export const useDemo = defineStore("demo", {
  state: () => ({
    chapter: 0,
    doneChapters: [] as number[],
    speed: 1 as Speed,
    mode: "guided" as "guided" | "auto",
    running: false,
    paused: false,
    loading: false,
    caption: "",
    notesOpen: false,
    /** لوحة التخصيص (الشعار والألوان) مفتوحة. */
    brandOpen: false,
    /** الصفحة في وضع ملء الشاشة (Fullscreen API). */
    fullscreen: false,
    /** الجهاز الذي يحتل مركز المسرح الآن. */
    active: "phone" as Device,
    /** الدور الظاهر على الحاسوب الآن (مفتاح الموظف في السيناريو). */
    staffKey: "consultant",
    counters: { transferred: 0, reentered: 0 },
    /** إصدار الحالة: يرتفع مع كل تغيير في الخادم الوهمي ليعيد الشِّل قراءة ما يعرضه. */
    version: 0,
  }),
  actions: {
    transferred(n = 1) { this.counters.transferred += n; },
    markDone(i: number) { if (!this.doneChapters.includes(i)) this.doneChapters.push(i); },
    resetCounters() { this.counters = { transferred: 0, reentered: 0 }; this.doneChapters = []; },
  },
});

export type DemoStore = ReturnType<typeof useDemo>;
