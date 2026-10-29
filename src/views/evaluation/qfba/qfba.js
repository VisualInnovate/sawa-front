// QFBA (Questions About Behavioral Function), evaluation type 9 — the same rules as the server's App\Support\Qfba\Qfba:
// each question points to one function; per function «عدد البنود المؤيدة» = its questions answered above 0 and «الشدة» =
// the sum of those answers («لا ينطبق» = null counts for neither). The likely function has the most endorsed questions,
// then the highest severity. Every text exists in Arabic and English: the evaluator picks the form's language, and its
// result and report are drawn in that language (the texts below, and each question/function/answer's own `_en`).

export const LANGUAGES = ["ar", "en"];

const TEXT = {
  ar: {
    title: "QFBA — أسئلة حول وظيفة السلوك",
    result_title: "نتيجة تقييم QFBA",
    language: "لغة النموذج",
    interviewee: "اسم من أجاب",
    interviewee_placeholder: "ولي الأمر، المعلم...",
    target_behavior: "السلوك المستهدف",
    target_behavior_placeholder: "مثال: العض، الضرب، الصراخ...",
    child_age: "عمر الطفل",
    months: "{n} شهر",
    test_date: "تاريخ التقييم",
    tester: "الفاحص",
    na: "لا ينطبق",
    answered: "تمت الإجابة",
    answer_all: "أجب عن جميع الأسئلة (اختر «لا ينطبق» إذا لم يناسب الموقف الطفل).",
    function: "الوظيفة",
    endorsed: "عدد البنود المؤيدة",
    severity: "الشدة",
    results: "النتائج",
    likely: "الوظيفة الأرجح للسلوك",
    no_function: "لم تُؤيَّد أي وظيفة (كل الإجابات صفر أو لا ينطبق).",
    clear: "وظيفة محتملة",
    clear_hint: "تُعدّ الوظيفة محتملة عندما تُؤيَّد {n} بنود أو أكثر من بنودها (إجابة أكبر من صفر).",
    meaning: "ماذا يعني ذلك",
    answers: "الإجابات",
    question: "السؤال",
    response: "الإجابة",
    notes: "ملاحظات",
    scale: "سلم الإجابة",
    save: "حفظ التقييم",
    chart_title: "الشدة لكل وظيفة",
    intro: "تم تقييم {name} على QFBA للسلوك المستهدف «{behavior}» وكانت النتائج كما يلي",
    intro_plain: "تم تقييم {name} على QFBA وكانت النتائج كما يلي",
    out_of: "من",
    of_questions: "{n} من {total}",
  },
  en: {
    title: "QFBA — Questions About Behavioral Function",
    result_title: "QFBA result",
    language: "Form language",
    interviewee: "Name of interviewee",
    interviewee_placeholder: "Parent, teacher...",
    target_behavior: "Target behavior",
    target_behavior_placeholder: "e.g. biting, hitting, screaming...",
    child_age: "Child's age",
    months: "{n} months",
    test_date: "Date",
    tester: "Evaluator",
    na: "N/A",
    answered: "answered",
    answer_all: "Answer every question (choose «N/A» when the situation does not fit the child).",
    function: "Function",
    endorsed: "Number endorsed",
    severity: "Severity",
    results: "Results",
    likely: "Most likely function of the behavior",
    no_function: "No function was endorsed (every answer is 0 or N/A).",
    clear: "Likely function",
    clear_hint: "A function is likely when {n} or more of its questions are endorsed (answered above 0).",
    meaning: "What it means",
    answers: "Answers",
    question: "Question",
    response: "Response",
    notes: "Notes",
    scale: "Rating scale",
    save: "Save evaluation",
    chart_title: "Severity per function",
    intro: "{name} was evaluated on the QFBA for the target behavior «{behavior}» with the following results",
    intro_plain: "{name} was evaluated on the QFBA with the following results",
    out_of: "of",
    of_questions: "{n} of {total}",
  },
};

/** A QFBA text in the form's language, with {placeholders} filled. */
export const qt = (lang, key, params = {}) =>
  String(TEXT[lang === "en" ? "en" : "ar"][key] ?? TEXT.ar[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");

// The English text when the form is in English and one was written, else the Arabic.
const pick = (lang, ar, en) => (lang === "en" && en ? en : ar ?? "");
export const questionText = (question, lang) => pick(lang, question?.text, question?.text_en);
export const functionName = (fn, lang) => pick(lang, fn?.name, fn?.name_en);
export const functionDescription = (fn, lang) => pick(lang, fn?.description, fn?.description_en);
export const optionLabel = (option, lang) => pick(lang, option?.label, option?.label_en);
export const instructionsOf = (data, lang) => pick(lang, data?.instructions, data?.instructions_en);

/** The function's color in the charts and tables. */
export const FUNCTION_COLORS = { attention: "#2563eb", escape: "#d97706", non_social: "#7c3aed", physical: "#dc2626", tangible: "#059669" };
export const functionColor = (key) => FUNCTION_COLORS[key] ?? "#135c65";

/** Each function's scores from answers { question id: value | null } (as the server counts them). */
export function scoresOf(functions, questions, answers, maxValue) {
  return (functions ?? []).map((fn) => {
    const own = (questions ?? []).filter((question) => question.function_id === fn.id);
    const values = own.map((question) => answers[question.id]).filter((value) => value !== null && value !== undefined && Number(value) > 0);
    return {
      function_id: fn.id, key: fn.key, name: fn.name, name_en: fn.name_en,
      questions: own.length, endorsed: values.length, severity: values.reduce((sum, value) => sum + Number(value), 0),
      max_severity: own.length * (maxValue ?? 0),
    };
  });
}

/** The likely function(s): the most endorsed questions, then the highest severity (none when nothing is endorsed). */
export function primaryOf(scores) {
  const rank = (score) => score.endorsed * 10000 + score.severity;
  const endorsed = (scores ?? []).filter((score) => score.endorsed > 0);
  if (!endorsed.length) return [];
  const best = Math.max(...endorsed.map(rank));
  return endorsed.filter((score) => rank(score) === best).map((score) => score.key);
}
