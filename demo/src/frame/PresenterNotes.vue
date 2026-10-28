<script setup lang="ts">
// ملاحظات المقدّم (N): نقاط حديث وسؤال متوقع وجوابه لكل فصل.
import type { Chapter } from "@demo/engine/actions";
defineProps<{ chapter: Chapter; index: number }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <aside class="notes">
    <header>
      <b>ملاحظات المقدّم · الفصل {{ index + 1 }}</b>
      <button class="x" @click="emit('close')" aria-label="إغلاق">×</button>
    </header>
    <h3>{{ chapter.title }}</h3>
    <ol>
      <li v-for="(p, i) in chapter.notes.points" :key="i">{{ p }}</li>
    </ol>
    <div class="qa">
      <b>سؤال متوقع:</b> {{ chapter.notes.question }}
      <br /><b>الجواب:</b> {{ chapter.notes.answer }}
    </div>
    <small>المفاتيح: ← التالي · → رجوع · 0–9 قفز · R إعادة · S تخطٍّ · P إيقاف · F ملء الشاشة · N هذه النافذة</small>
  </aside>
</template>

<style scoped>
.notes { position: fixed; inset-inline-start: 1rem; bottom: 5rem; width: 380px; background: var(--brand-navy); color: var(--ink-on-dark); border-radius: var(--radius); padding: 1rem 1.2rem; z-index: 60; box-shadow: 0 20px 40px -20px rgb(0 0 0 / .5); }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .4rem; }
.x { background: none; border: 0; color: inherit; font-size: 1.4rem; line-height: 1; }
h3 { color: var(--brand-orange); font-size: 1rem; margin-bottom: .3rem; }
ol { margin: 0; padding-inline-start: 1.2rem; font-size: .9rem; }
.qa { margin-top: .6rem; background: var(--navy-raised); border-radius: 12px; padding: .5rem .8rem; font-size: .85rem; }
small { display: block; margin-top: .6rem; opacity: .7; font-size: .7rem; }
</style>
