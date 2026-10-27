// الفصل 11 — المحاسبة (الحاسوب): حساب البرنامج بأقساط شهرية، تثبيته، سند قبض للقسط الأول؛ الأهل يرون الرسوم على الهاتف.
import type { Chapter } from "@demo/engine/actions";
import { desk, phone } from "@demo/engine/actions";
import { scenario } from "../../scenario";
import { pay } from "../../mock/handlers/accounting";

export function confirmAndPay(db: any) {
  const p = db.programs[0];
  const charge = db.charges.find((c: any) => c.program_id === p.id);
  p.accounting_status = "confirmed"; p.tentative_until = null; p.confirmed_at = db.now(); p.confirmed_by = 16;
  db.currentStaffId = 16;
  pay(db, { child_id: p.student_id, installment_ids: [charge.installments[0].id], method: "cash", paid_on: db.now().slice(0, 10) });
}

export const accounting: Chapter = {
  key: "accounting",
  title: "المحاسبة",
  role: "المحاسبة",
  device: "desktop",
  staff: "accountant",
  start: { phone: "/web/clidreen_parents", desktop: "/accounting/programs" },
  apply: confirmAndPay,
  timeline: (db) => [
    { type: "caption", text: "«تثبيت البرامج»: البرنامج المبدئي ينتظر المحاسبة خلال يومين" },
    { type: "waitFor", target: desk("td", scenario.child.firstName) },
    { type: "click", target: desk("td", scenario.child.firstName) },
    { type: "waitFor", target: desk(".p-dialog .acc-stat") },
    { type: "caption", text: "حساب البرنامج: السعر شهراً بشهر، والأقساط قسط لكل شهر — تلقائياً" },
    { type: "fly", from: desk(".p-dialog .acc-stat", "", 0), to: "counter", label: "الرسوم + الأقساط الشهرية", counts: 3 },
    { type: "scroll", target: desk(".p-dialog .p-datatable", "", 1) },
    { type: "wait", ms: 1500 },
    { type: "click", target: desk(".p-dialog-footer button", "تثبيت البرنامج") },
    { type: "waitFor", target: desk(".p-toast-message-success") },
    { type: "caption", text: "ثُبّت البرنامج — الجلسات أصبحت فعلية. الآن القسط الأول: سند قبض" },
    { type: "wait", ms: 800 },
    { type: "click", target: desk(".p-dialog-footer button", "تسجيل دفعة") },
    { type: "waitFor", target: desk(".p-dialog .p-checkbox-input") },
    { type: "wait", ms: 900 },
    { type: "click", target: desk(".p-dialog-footer button", "حفظ السند") },
    { type: "waitFor", target: desk(".p-toast-message-success", "سند") },
    { type: "nav", frame: "desktop", path: (d) => `/accounting-receipt/${d.payments.at(-1)?.id}` },
    { type: "waitFor", target: desk(".receipt") },
    { type: "caption", text: "سند القبض يُطبع من النظام؛ والأهل يرونه في كشف حسابهم فوراً" },
    { type: "nav", frame: "phone", path: `/web/children/${db.children[0].id}?tab=finance` },
    { type: "waitFor", target: phone(".pp-installment.is-paid") },
    { type: "fly", from: desk(".receipt"), to: phone(".pp-installment.is-paid"), label: "سند قبض", counts: false },
    { type: "wait", ms: 1600 },
  ],
  notes: {
    points: ["الرسوم تُحسب من جدول الرسوم ولا تُكتب يدوياً؛ الخصم بقرار المحاسب وبسبب مكتوب.", "قسط كل شهر يستحق في يوم بداية البرنامج؛ التأخر يظهر للأهل وللمحاسبة.", "دفع القسط الأول كاملاً يثبّت البرنامج تلقائياً أيضاً."],
    question: "ماذا يحدث لو تأخر قسط؟",
    answer: "يظهر «متأخر» في كشف الحساب وفي البوابة، ويمكن للمحاسبة إيقاف جلسات البرنامج حتى السداد ثم استئنافها.",
  },
};
