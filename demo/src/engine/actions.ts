import type { Device } from "@demo/store/demo";
import type { DB } from "../../mock/db";

/** هدف داخل أحد الإطارَين: محدد CSS، ويُضيَّق اختيارياً بنصّ يحتويه العنصر وبترتيبه بين المطابقات. */
export interface Target { frame: Device; sel: string; text?: string; nth?: number }

// أفعال الـtimeline: كل فصل قائمة من هذه الأفعال تُنفَّذ بالتسلسل على واجهة النظام الحقيقية داخل الإطارات.
export type Action =
  /** انتظار ظهور عنصر (بعد تنقّل أو نداء). */
  | { type: "waitFor"; target: Target; timeout?: number }
  /** تحريك المؤشر إلى عنصر وضغطه (الضغطة حقيقية تصل إلى Vue). */
  | { type: "click"; target: Target; hold?: number }
  /** كتابة حيّة في حقل حقيقي حرفاً حرفاً (input/textarea، أو حقل مكوّن PrimeVue). */
  | { type: "type"; target: Target; text: string; cps?: number; clear?: boolean }
  /** فتح قائمة PrimeVue (Select/MultiSelect) واختيار خيار بنصّه. */
  | { type: "select"; target: Target; option: string; close?: boolean }
  /** التنقّل داخل إطار إلى مسار (دون إعادة تحميل). */
  | { type: "nav"; frame: Device; path: string | ((db: DB) => string) }
  /** إبراز الجهاز في مركز المسرح. */
  | { type: "focus"; frame: Device }
  /** تبديل موظف الحاسوب وإعادة تحميل الإطار على مسار. */
  | { type: "role"; staff: string; path: string }
  /** بطاقة تطير من عنصر إلى عنصر (أو إلى عدّاد الحقول المنقولة). counts=false لا يرفع العدّاد. */
  | { type: "fly"; from: Target; to: Target | "counter"; label: string; counts?: boolean | number }
  | { type: "highlight"; target: Target; ms?: number }
  | { type: "scroll"; target: Target }
  /** تنفيذ شيء على الخادم الوهمي مباشرة (ما لا تفعله الواجهة في الديمو: مرور الوقت، إشعار…). */
  | { type: "db"; run: (db: DB) => void }
  | { type: "caption"; text: string }
  | { type: "wait"; ms: number };

export const t = (frame: Device, sel: string, text?: string, nth?: number): Target => ({ frame, sel, text, nth });
export const phone = (sel: string, text?: string, nth?: number) => t("phone", sel, text, nth);
export const desk = (sel: string, text?: string, nth?: number) => t("desktop", sel, text, nth);

export interface Chapter {
  key: string;
  title: string;
  role: string;
  device: Device;
  /** موظف الحاسوب في هذا الفصل (مفتاحه في السيناريو). */
  staff: string;
  /** مسارا الإطارَين عند بداية الفصل (بعد إعادة بناء الحالة). */
  start: { phone: string; desktop: string };
  /** أثر الفصل في الحالة، للقفز إليه دون تشغيل حركته. */
  apply: (db: DB) => void;
  timeline: (db: DB) => Action[];
  notes: { points: string[]; question: string; answer: string };
}
