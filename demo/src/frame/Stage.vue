<script setup lang="ts">
// المسرح: إطارا الحاسوب والهاتف، كلٌّ منهما نسخة حقيقية من التطبيق. الجهاز النشط في المركز والآخر صغير إلى جانبه
// (يبقى يعمل، فتظهر فيه الإشعارات لحظة وصولها).
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useDemo } from "@demo/store/demo";
import { frames } from "@demo/engine/frames";
import { chapters } from "@demo/chapters";

const store = useDemo();
const stage = ref<HTMLElement | null>(null);
const size = ref({ w: 1200, h: 700 });
let ro: ResizeObserver | null = null;
onMounted(() => {
  ro = new ResizeObserver(([e]) => { size.value = { w: e.contentRect.width, h: e.contentRect.height }; });
  if (stage.value) ro.observe(stage.value);
});
onBeforeUnmount(() => ro?.disconnect());

// أبعاد الشاشتَين الحقيقية؛ تُصغَّر بـtransform لتلائم المسرح.
const DESK = { w: 1366, h: 820 };
const PHONE = { w: 390, h: 844 };
const PAD = 24;
const activePhone = computed(() => store.active === "phone");

// الجهاز النشط يأخذ معظم العرض؛ الجانبي يأخذ الباقي.
const deskScale = computed(() => {
  const availW = activePhone.value ? size.value.w * 0.42 : size.value.w - 2 * PAD - size.value.w * 0.17;
  const availH = (size.value.h - 2 * PAD) * (activePhone.value ? 0.6 : 1) - (activePhone.value ? 0 : 36);
  return Math.min(availW / DESK.w, availH / DESK.h);
});
const phoneScale = computed(() => {
  const availH = (size.value.h - 2 * PAD) * (activePhone.value ? 1 : 0.62) - 24;
  const availW = activePhone.value ? size.value.w * 0.3 : size.value.w * 0.16;
  return Math.min(availH / (PHONE.h + 24), availW / (PHONE.w + 24));
});
const chapter = computed(() => chapters[store.chapter]);
</script>

<template>
  <main ref="stage" class="stage" :class="activePhone ? 'phone-active' : 'desktop-active'">
    <!-- الحاسوب -->
    <div class="device desktop" :style="{ '--s': deskScale, '--w': DESK.w + 'px', '--h': DESK.h + 'px' }">
      <div class="browser-bar">
        <span class="dots"><i /><i /><i /></span>
        <span class="url ltr">app.enable360.local{{ chapter.start.desktop }}</span>
      </div>
      <div class="screen">
        <iframe :ref="(el) => (frames.desktop.el = el as HTMLIFrameElement)" name="demo-desktop" title="لوحة التحكم" />
      </div>
    </div>

    <!-- الهاتف -->
    <div class="device phone" :style="{ '--s': phoneScale, '--w': PHONE.w + 'px', '--h': PHONE.h + 'px' }">
      <div class="phone-body">
        <div class="notch" />
        <iframe :ref="(el) => (frames.phone.el = el as HTMLIFrameElement)" name="demo-phone" title="هاتف ولي الأمر" />
      </div>
    </div>

    <span class="badge">بيانات تجريبية</span>
    <Transition name="cap">
      <p v-if="store.caption" :key="store.caption" class="caption">{{ store.caption }}</p>
    </Transition>
    <div v-if="store.loading" class="loading">جارٍ تحميل الشاشات…</div>
  </main>
</template>

<style scoped>
.stage { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; gap: 24px; padding: 24px; }
.device { transition: all var(--t-slow) cubic-bezier(.22, 1, .36, 1); flex: none; }
/* الإطار يُرسم بحجمه الحقيقي ثم يُصغَّر؛ الحاوية تأخذ الحجم المصغَّر حتى لا يتداخل مع الباقي. */
.desktop { width: calc(var(--w) * var(--s)); height: calc((var(--h) + 36px) * var(--s)); position: relative; }
.desktop > * { position: absolute; inset-inline-start: 0; transform-origin: top right; transform: scale(var(--s)); width: var(--w); }
.browser-bar { top: 0; height: 36px; display: flex; align-items: center; gap: .8rem; padding: 0 .9rem; background: #dbe5ee; border-radius: 18px 18px 0 0; }
.dots i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #b9c8d6; margin-inline-end: 4px; }
.url { flex: 1; background: #fff; border-radius: 8px; padding: .1rem .7rem; font-size: .8rem; color: var(--ink-muted); text-align: left; line-height: 1.6; }
.screen { top: 36px; height: var(--h); background: #fff; border-radius: 0 0 18px 18px; overflow: hidden; box-shadow: 0 30px 60px -30px rgb(10 37 64 / .5); }
.screen iframe, .phone-body iframe { border: 0; width: 100%; height: 100%; display: block; background: #fff; }

.phone { width: calc((var(--w) + 24px) * var(--s)); height: calc((var(--h) + 24px) * var(--s)); position: relative; }
.phone-body { position: absolute; inset-inline-start: 0; top: 0; width: calc(var(--w) + 24px); height: calc(var(--h) + 24px); transform-origin: top right; transform: scale(var(--s)); background: #0b1726; border-radius: 48px; padding: 12px; box-shadow: 0 30px 60px -30px rgb(10 37 64 / .55); }
.phone-body iframe { border-radius: 36px; }
.notch { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); width: 110px; height: 26px; background: #0b1726; border-radius: 16px; z-index: 2; }

.phone-active .desktop, .desktop-active .phone { opacity: .92; filter: saturate(.9); }

.badge { position: absolute; top: 1.2rem; inset-inline-start: 1.4rem; background: var(--brand-orange); color: var(--brand-navy); font-weight: 800; font-size: .75rem; border-radius: 999px; padding: .1rem .7rem; z-index: 5; }
.caption { position: absolute; bottom: 1rem; inset-inline: 0; margin: auto; width: fit-content; max-width: 70%; background: rgb(10 37 64 / .94); color: var(--ink-on-dark); border-radius: 14px; padding: .4rem 1.2rem; font-weight: 600; z-index: 5; }
.cap-enter-active, .cap-leave-active { transition: opacity var(--t-fast), transform var(--t-fast); }
.cap-enter-from, .cap-leave-to { opacity: 0; transform: translateY(8px); }
.loading { position: absolute; inset: 0; display: grid; place-items: center; background: rgb(245 247 250 / .55); color: var(--ink-muted); font-weight: 700; z-index: 4; backdrop-filter: blur(2px); }
</style>
