// الفصل 1 — ولي الأمر (الهاتف): ينشئ حسابه بنفسه ويسجّل يوسف.
import type { Chapter } from "@demo/engine/actions";
import { phone } from "@demo/engine/actions";
import { scenario } from "../../scenario";

const P = scenario.parent, C = scenario.child;

export const register: Chapter = {
  key: "register",
  title: "ولي الأمر يسجّل طفله",
  role: "ولي الأمر",
  device: "phone",
  staff: "consultant",
  start: { phone: "/web/parent/register", desktop: "/sawa-admin/welcome" },
  apply(db) {
    db.parent = { id: 1, fname: P.fname, lname: P.lname, phone: P.phone, email: null };
    db.children.push({ id: db.id(), parent_id: 1, name: C.name, birth_date: C.birthDate, birth_place: C.birthPlace, address: C.address, national_id: C.nationalId, gender: C.gender === "male" ? "0" : "1", nationalty: C.nationality, lang: C.lang, created_at: db.now() });
  },
  timeline: () => [
    { type: "caption", text: "ولي الأمر يبدأ من هاتفه: حساب جديد في دقيقة" },
    { type: "type", target: phone("#reg-fname"), text: P.fname },
    { type: "type", target: phone("#reg-lname"), text: P.lname },
    { type: "type", target: phone("#reg-phone"), text: P.phone, cps: 18 },
    { type: "type", target: phone("#reg-password"), text: P.password, cps: 22 },
    { type: "type", target: phone("#reg-confirm"), text: P.password, cps: 30 },
    { type: "click", target: phone('button[type="submit"]') },
    { type: "waitFor", target: phone(".pp-hello") },
    { type: "caption", text: "لا أطفال بعد — يُسجّل يوسف من البوابة نفسها" },
    { type: "wait", ms: 900 },
    { type: "click", target: phone(".pp-hello__actions a", "اضافة طفل") },
    { type: "waitFor", target: phone("#c-name") },
    { type: "type", target: phone("#c-name"), text: C.name },
    { type: "type", target: phone("#c-birth input"), text: C.birthDate, cps: 18 },
    { type: "select", target: phone("#c-gender"), option: C.gender === "male" ? "ذكر" : "أنثى" },
    { type: "type", target: phone("#c-place"), text: C.birthPlace },
    { type: "type", target: phone("#c-national"), text: C.nationalId, cps: 18 },
    { type: "type", target: phone("#c-nat input"), text: C.nationality },
    { type: "type", target: phone("#c-lang input"), text: "Arabic" },
    { type: "type", target: phone("#c-address"), text: C.address },
    { type: "click", target: phone('button[type="submit"]') },
    { type: "waitFor", target: phone(".pp-h1", C.firstName) },
    { type: "caption", text: "ملف يوسف فُتح — كل ما يلي يُبنى عليه ولا يُعاد إدخاله" },
    { type: "wait", ms: 1400 },
  ],
  notes: {
    points: ["الأهل يسجّلون من الهاتف بلا موظف استقبال ولا ورقة.", "ملف الطفل يُفتح مرة واحدة ويمرّ بكل المحطات.", "لاحظوا عدّاد «بيانات أُعيد إدخالها»: سيبقى صفراً حتى النهاية."],
    question: "هل يحتاج الأهل تطبيقاً من المتجر؟",
    answer: "لا؛ البوابة تعمل من متصفح الهاتف مباشرة، بالعربية والإنجليزية.",
  },
};
