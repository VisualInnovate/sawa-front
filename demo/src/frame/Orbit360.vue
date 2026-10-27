<script setup lang="ts">
// مدار 360: قطعة لكل فصل، تمتلئ مع الفصول المنجزة، وتُستخدم للقفز.
import { computed } from "vue";
const props = defineProps<{ count: number; current: number; done: number[]; title: string }>();
const emit = defineEmits<{ jump: [index: number] }>();
const R = 26, C = 32;
const segments = computed(() => {
  const gap = 3, total = 360 / props.count;
  return Array.from({ length: props.count }, (_, i) => {
    const a0 = -90 + i * total + gap / 2, a1 = -90 + (i + 1) * total - gap / 2;
    const p = (a: number) => [C + R * Math.cos((a * Math.PI) / 180), C + R * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return { i, d: `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}` };
  });
});
</script>

<template>
  <div class="orbit" :title="`الفصل ${current + 1} من ${count}`">
    <svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true">
      <path v-for="s in segments" :key="s.i" :d="s.d" class="seg" :class="{ done: done.includes(s.i), current: s.i === current }" @click="emit('jump', s.i)" />
      <text x="32" y="36" text-anchor="middle" class="label">360</text>
    </svg>
    <div class="orbit-text">
      <b>{{ current + 1 }}<span class="muted">/{{ count }}</span> · {{ title }}</b>
      <small>المدار يكتمل مع كل فصل · الأرقام 0–9 للقفز</small>
    </div>
  </div>
</template>

<style scoped>
.orbit { display: flex; align-items: center; gap: .6rem; }
.seg { fill: none; stroke: #d6e2ee; stroke-width: 6; cursor: pointer; transition: stroke var(--t-slow); }
.seg.done { stroke: var(--brand-blue); }
.seg.current { stroke: var(--brand-orange); }
.label { font: 800 13px var(--font); fill: var(--brand-navy); }
.orbit-text { display: grid; line-height: 1.25; }
.orbit-text b { font-size: 1rem; }
.orbit-text .muted { color: var(--ink-muted); font-weight: 600; font-size: .85rem; }
.orbit-text small { color: var(--ink-muted); font-size: .72rem; }
</style>
