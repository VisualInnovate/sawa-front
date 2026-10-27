<script setup lang="ts">
// العدّادان: يُحسبان من السيناريو نفسه ويحملان وسم «في هذا العرض» حتى لا يُقرآ كإحصاء.
defineProps<{ transferred: number; reentered: number }>();
</script>

<template>
  <div class="counters" aria-live="polite">
    <div class="counter" data-demo="counter-transferred">
      <span class="k">حقول نُقلت تلقائياً</span>
      <b class="num">{{ transferred }}</b>
    </div>
    <div class="counter zero">
      <span class="k">بيانات أُعيد إدخالها</span>
      <b class="num">{{ reentered }}</b>
    </div>
    <small class="tag">في هذا العرض</small>
  </div>
</template>

<style scoped>
.counters { display: flex; align-items: center; gap: .75rem; }
.counter { display: flex; align-items: baseline; gap: .5rem; background: var(--navy-raised); color: var(--ink-on-dark); border-radius: 14px; padding: .2rem .8rem; }
.counter .k { font-size: .78rem; opacity: .85; }
.counter b { font-size: 1.25rem; color: var(--brand-orange); }
.counter.zero b { color: #7fe0a8; }
.tag { color: var(--ink-muted); font-size: .7rem; }
</style>
