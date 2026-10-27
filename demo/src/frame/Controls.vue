<script setup lang="ts">
import { useDemo, type Speed } from "@demo/store/demo";
const store = useDemo();
defineProps<{ finished: boolean }>();
const emit = defineEmits<{ next: []; prev: []; skip: []; restart: []; pause: [] }>();
const speeds: Array<{ v: Speed; label: string }> = [{ v: 0.6, label: "هادئة" }, { v: 1, label: "عادية" }, { v: 1.8, label: "سريعة" }];
</script>

<template>
  <footer class="controls">
    <div class="group">
      <button class="btn btn-soft" @click="emit('prev')" title="السهم الأيمن">رجوع →</button>
      <button class="btn btn-primary big" @click="emit('next')" title="السهم الأيسر أو المسافة">التالي ←</button>
      <button class="btn btn-soft" @click="emit('skip')" title="S">تخطَّ الحركة</button>
      <button class="btn btn-soft" @click="emit('pause')" title="P">{{ store.paused ? "متابعة" : "إيقاف" }}</button>
      <span v-if="store.running" class="live">● يجري التنفيذ</span>
    </div>
    <div class="group">
      <span class="lbl">السرعة</span>
      <button v-for="s in speeds" :key="s.v" class="pill" :class="{ on: store.speed === s.v }" @click="store.speed = s.v">{{ s.label }}</button>
      <span class="sep" />
      <button class="pill" :class="{ on: store.mode === 'guided' }" @click="store.mode = 'guided'">عرض موجَّه</button>
      <button class="pill" :class="{ on: store.mode === 'auto' }" @click="store.mode = 'auto'">تشغيل تلقائي</button>
      <span class="sep" />
      <button class="pill" @click="store.notesOpen = !store.notesOpen" title="N">ملاحظات المقدّم</button>
      <button class="pill" @click="emit('restart')" title="R">إعادة</button>
    </div>
  </footer>
</template>

<style scoped>
.controls { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: .5rem 1.25rem; background: var(--surface-raised); border-top: 1px solid var(--border); }
.group { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.big { padding-inline: 1.6rem; font-size: 1.05rem; }
.lbl { color: var(--ink-muted); font-size: .8rem; }
.live { color: var(--brand-blue); font-size: .8rem; font-weight: 700; }
.pill { border: 1px solid var(--border); background: #fff; border-radius: 999px; padding: .15rem .8rem; font-size: .8rem; font-weight: 600; color: var(--ink-muted); }
.pill.on { background: var(--brand-navy); color: var(--ink-on-dark); border-color: var(--brand-navy); }
.sep { width: 1px; height: 1.4rem; background: var(--border); margin-inline: .3rem; }
</style>
