<script setup lang="ts">
// طبقة فوق المسرح: المؤشر المرئي والبطاقات الطائرة بين الشاشات.
import { ref, watch } from "vue";
import { fx, type Flight } from "@demo/engine/player";

const chips = ref<Record<number, HTMLElement | null>>({});
watch(() => fx.flights.length, () => {
  requestAnimationFrame(() => {
    for (const f of fx.flights) {
      const node = chips.value[f.id];
      if (!node || node.dataset.started) continue;
      node.dataset.started = "1";
      const fromX = f.from.left + f.from.width / 2 - node.offsetWidth / 2, fromY = f.from.top + f.from.height / 2 - 16;
      const toX = f.to.left + f.to.width / 2 - node.offsetWidth / 2, toY = f.to.top + f.to.height / 2 - 16;
      node.animate(
        [
          { transform: `translate(${fromX}px, ${fromY}px) scale(.9)`, opacity: 0 },
          { transform: `translate(${fromX}px, ${fromY - 28}px) scale(1.05)`, opacity: 1, offset: 0.2 },
          { transform: `translate(${toX}px, ${toY}px) scale(.95)`, opacity: 1, offset: 0.88 },
          { transform: `translate(${toX}px, ${toY}px) scale(.6)`, opacity: 0 },
        ],
        { duration: 950, easing: "cubic-bezier(.22,.8,.3,1)", fill: "forwards" },
      );
    }
  });
});
const setRef = (f: Flight) => (el: unknown) => { chips.value[f.id] = el as HTMLElement | null; };
</script>

<template>
  <div class="fx" aria-hidden="true">
    <div class="cursor" :class="{ visible: fx.cursor.visible, clicking: fx.cursor.clicking }" :style="{ transform: `translate(${fx.cursor.x}px, ${fx.cursor.y}px)` }">
      <svg viewBox="0 0 24 24" width="28" height="28"><path d="M4 2l16 8-7 2-2 7z" fill="#0A2540" stroke="#fff" stroke-width="1.5" /></svg>
    </div>
    <div v-for="f in fx.flights" :key="f.id" :ref="setRef(f)" class="flight">✈ {{ f.label }}</div>
  </div>
</template>

<style scoped>
.fx { position: fixed; inset: 0; pointer-events: none; z-index: 80; }
.cursor { position: absolute; top: 0; left: 0; opacity: 0; transition: transform .38s cubic-bezier(.22,.8,.3,1), opacity .2s; filter: drop-shadow(0 2px 4px rgb(0 0 0 / .35)); }
.cursor.visible { opacity: 1; }
.cursor.clicking svg { transform: scale(.8); }
.cursor::after { content: ""; position: absolute; inset: -8px; border-radius: 50%; border: 2px solid var(--brand-orange); opacity: 0; }
.cursor.clicking::after { animation: ring .35s ease-out; }
@keyframes ring { 0% { opacity: .9; transform: scale(.4); } 100% { opacity: 0; transform: scale(1.4); } }
.flight { position: absolute; top: 0; left: 0; background: var(--brand-navy); color: var(--ink-on-dark); border: 2px solid var(--brand-orange); border-radius: 12px; padding: .2rem .7rem; font-weight: 700; font-size: .85rem; white-space: nowrap; opacity: 0; }
</style>
