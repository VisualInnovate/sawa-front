// سيناريو الديمو: طفل تجريبي واحد يمرّ بالدورة كاملة. كل الأسماء والأرقام هنا وهمية؛ المحطات لا تحوي بيانات.
// التواريخ نسبية إلى يوم العرض حتى تبقى الحجوزات «قادمة» والتقويمات مفتوحة أياً كان يوم التقديم.

export type Gender = "male" | "female";

export const DAY = 24 * 60 * 60 * 1000;
export const pad = (n: number) => String(n).padStart(2, "0");
export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const ymdhm = (d: Date) => `${ymd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);
/** أول يوم عمل (الأحد–الخميس) بعد n يوم من اليوم. */
export const workDay = (n: number) => {
  let d = addDays(today(), n);
  while ([5, 6].includes(d.getDay())) d = addDays(d, 1);
  return d;
};
export const at = (d: Date, h: number, m = 0) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x; };

export interface Staff {
  id: number;            // users.id = employee_id (بسّطنا الاثنين)
  key: string;
  name: string;
  title: string;
  email: string;
  type: number;          // 5 = مستشار
  role: string;          // اسم الدور كما يظهر في النظام
  perms: string[];       // صلاحيات الدور
  evaluationTypes?: number[]; // أنواع التقييم التي يجريها
  phone?: string;
}

const EVAL_PERMS = [
  "evaluation results list", "evaluation results create", "evaluation results edit",
  "milestone answer list", "milestone answer create", "milestone answer edit", "milestone answer delete",
  "barrier answer list", "barrier answer create", "barrier answer edit",
  "evaluation reports list", "child list", "sessions list", "sessions edit", "session break schedule edit",
  "student program list", "stimulus list", "stimulus create", "stimulus edit", "stimulus test create",
];

export const ADMIN_PERMS = ["ALL"]; // الإدارة: دور admin يحمل السجل كله (يُستبدل بالقائمة الكاملة في الخادم الوهمي)

export const staff: Staff[] = [
  { id: 11, key: "consultant", name: "د. سارة العمري", title: "استشارية تربية خاصة", email: "sara@demo.local", type: 5, role: "مستشار",
    perms: ["bookings list", "bookings edit", "consultations edit", "consultant children list", "child list", "working hours list"] },
  { id: 12, key: "manager", name: "خالد المطيري", title: "مدير البرامج", email: "khaled@demo.local", type: 1, role: "مدير البرامج",
    perms: ["required evaluations list", "evaluation request create", "evaluation request delete", "child list", "bookings list", "student program list", "student program create", "student program edit", "treatment list", "room list"] },
  { id: 13, key: "therapist", name: "نورة القحطاني", title: "أخصائية تحليل سلوك", email: "noura@demo.local", type: 2, role: "أخصائي",
    perms: EVAL_PERMS, evaluationTypes: [2, 3] },
  { id: 14, key: "therapist2", name: "ريم الشهري", title: "أخصائية نطق", email: "reem@demo.local", type: 2, role: "أخصائي",
    perms: EVAL_PERMS, evaluationTypes: [1, 101, 102, 103, 104, 105, 2, 3] },
  { id: 15, key: "management", name: "الإدارة", title: "مدير المركز", email: "admin@demo.local", type: 1, role: "admin", perms: ADMIN_PERMS },
  { id: 16, key: "accountant", name: "منى الدوسري", title: "محاسبة", email: "mona@demo.local", type: 1, role: "محاسب",
    perms: ["accounting list", "accounting programs edit", "accounting evaluations edit", "accounting payments create", "accounting payments delete",
      "accounting charges create", "accounting charges delete", "accounting credits edit", "accounting settings edit", "accounting reports list",
      "program fees edit", "child list", "student program list"] },
];

export const staffByKey = (key: string) => staff.find((s) => s.key === key)!;

export const scenario = {
  center: { name: "مركز الأمل للتربية الخاصة", currency: "ر.س" },
  parent: { fname: "أحمد", lname: "الحربي", phone: "0551234567", password: "Demo@2026", relative: "الأب" },
  child: {
    name: "يوسف أحمد الحربي",
    firstName: "يوسف",
    gender: "male" as Gender,
    birthDate: "2022-08-14",
    birthPlace: "الرياض",
    nationality: "سعودي",
    nationalId: "1234567890",
    lang: "Arabic",
    address: "الرياض — حي النرجس",
  },
  // الاستشارة: بعد 3 أيام عمل، الساعة 10:00 مع المستشارة.
  consultation: {
    day: workDay(3),
    slots: [9, 10, 11, 12],
    chosenHour: 10,
    problem: "توحد",
    parentsProblems: "تأخر في الكلام، لا يستجيب لاسمه دائماً، يلعب وحده ويكرّر حركات معيّنة.",
    priorities: "تطوير التواصل والكلام، وتقليل نوبات الغضب، والاندماج مع أقرانه.",
    health: "ولادة طبيعية بوزن 3.2 كغ. تطوّر حركي سليم؛ تأخر لغوي ملحوظ منذ السنة الثانية. لا أمراض مزمنة.",
    recommendations: "يحتاج يوسف إلى تقييم شامل للمهارات اللغوية والاجتماعية وتحديد العوائق قبل وضع البرنامج.",
    notes: "الأهل متعاونون ومستعدون للتدريب المنزلي.",
    requiredTypes: [2, 3], // Milestones + Barriers
  },
  // مواعيد التقييم التي يحجزها مدير البرامج: بعد الاستشارة بيومَي عمل.
  evaluation: {
    day: workDay(6),
    milestonesHour: 9,
    barriersHour: 10,
  },
};
