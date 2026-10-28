import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Cancelled, Player } from "./player";
import { frames, load, setSessions } from "./frames";
import { chapters } from "@demo/chapters";
import { useDemo } from "@demo/store/demo";
import { backend } from "./backend";
import { staffByKey } from "../../scenario";
import { toggleFullscreen } from "./fullscreen";

// المخرج: يعيد بناء حالة الفصول السابقة في الخادم الوهمي (فورياً)، يحمّل الإطارَين على مسارَي الفصل، ثم يشغّل حركته.
export function useDirector() {
  const store = useDemo();
  let player: Player | null = null;
  const finished = ref(false);

  function parentSession() {
    const p = backend.db.parent;
    return p ? { parent_id: p.id, fname: p.fname, lname: p.lname, phone: p.phone, email: p.email, image: null } : null;
  }

  /** العدّاد بعد الفصول السابقة: مجموع ما تنقله بطاقاتها الطائرة. */
  function transfersOf(index: number) {
    return chapters[index].timeline(backend.db).reduce((n, a) => (a.type === "fly" && a.counts !== false ? n + (typeof a.counts === "number" ? a.counts : 1) : n), 0);
  }

  // إن أُعيد تحميل الشِّل (تحديث عرضي أو Vite) نستأنف من الفصل نفسه بالسرعة والوضع نفسيهما.
  const RESUME_KEY = "demo:resume";
  const saveResume = (index: number) => { try { sessionStorage.setItem(RESUME_KEY, JSON.stringify({ chapter: index, mode: store.mode, speed: store.speed })); } catch {} };
  const readResume = (): { chapter: number; mode: typeof store.mode; speed: typeof store.speed } | null => { try { return JSON.parse(sessionStorage.getItem(RESUME_KEY) ?? "null"); } catch { return null; } };

  async function play(index: number) {
    player?.cancel();
    finished.value = false;
    store.running = false;
    store.loading = true;
    store.caption = "";
    store.chapter = index;
    saveResume(index);
    const chapter = chapters[index];

    backend.db.reset();
    store.resetCounters();
    for (let i = 0; i < index; i++) {
      chapters[i].apply(backend.db);
      store.counters.transferred += transfersOf(i);
      store.markDone(i);
    }
    backend.onChange?.();

    const staff = staffByKey(chapter.staff);
    backend.db.currentStaffId = staff.id;
    store.staffKey = chapter.staff;
    setSessions(backend.db.userResource(staff), parentSession());
    store.active = chapter.device;
    await Promise.all([load("phone", chapter.start.phone), load("desktop", chapter.start.desktop)]);
    await nextTick();
    store.loading = false;

    const p = new Player(store, backend);
    player = p;
    store.running = true;
    try {
      await p.run(chapter.timeline(backend.db));
      if (player === p) { store.markDone(index); finished.value = true; store.running = false; retried = -1; }
      if (store.mode === "auto" && player === p && index < chapters.length - 1) {
        await new Promise((r) => setTimeout(r, 2200 / store.speed));
        if (player === p && store.mode === "auto") play(index + 1);
      }
    } catch (e) {
      if (e instanceof Cancelled) return;
      console.error(e);
      // في التشغيل التلقائي: محاولة ثانية للفصل نفسه (الحالة تُبنى من جديد في play) قبل إظهار الخطأ.
      if (store.mode === "auto" && player === p && retried !== index) { retried = index; store.caption = "إعادة محاولة الفصل…"; await new Promise((r) => setTimeout(r, 800)); if (player === p) play(index); return; }
      store.caption = `تعذّر إكمال الحركة: ${(e as Error).message}`; store.running = false;
    }
  }
  let retried = -1;

  const next = () => { if (store.chapter < chapters.length - 1) play(store.chapter + 1); };
  const prev = () => { if (store.chapter > 0) play(store.chapter - 1); };
  const skip = () => player?.skip();
  const restart = () => { try { sessionStorage.removeItem(RESUME_KEY); } catch {} retried = -1; play(0); };
  const togglePause = () => { store.paused = !store.paused; };

  function onKey(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    // الاتجاه عربي: السهم الأيسر = التالي، الأيمن = رجوع.
    if (e.key === "ArrowLeft" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowRight") prev();
    else if (e.key === "r" || e.key === "R") restart();
    else if (e.key === "n" || e.key === "N") store.notesOpen = !store.notesOpen;
    else if (e.key === "s" || e.key === "S") skip();
    else if (e.key === "p" || e.key === "P") togglePause();
    // F11 يصل إلى الصفحة في بعض المتصفحات فقط؛ وإن لم يصل فملء شاشة المتصفح نفسه يؤدي الغرض.
    else if (e.key === "f" || e.key === "F" || e.key === "F11") { e.preventDefault(); toggleFullscreen(); }
    else if (/^[0-9]$/.test(e.key)) { const i = Number(e.key); if (i < chapters.length) play(i); }
  }

  onMounted(() => {
    window.addEventListener("keydown", onKey);
    // الإطاران يُركَّبان في المسرح؛ نبدأ حين يكونان موجودَين.
    const resume = readResume();
    if (resume && resume.chapter > 0 && resume.chapter < chapters.length) { store.mode = resume.mode; store.speed = resume.speed; }
    const first = resume && resume.chapter > 0 && resume.chapter < chapters.length ? resume.chapter : 0;
    const start = () => (frames.phone.el && frames.desktop.el ? play(first) : setTimeout(start, 50));
    start();
  });
  onBeforeUnmount(() => { window.removeEventListener("keydown", onKey); player?.cancel(); });
  watch(() => store.mode, (m) => { if (m === "auto" && finished.value) next(); });

  return { play, next, prev, skip, restart, togglePause, finished };
}
