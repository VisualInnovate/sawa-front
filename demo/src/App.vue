<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useDemo } from "@demo/store/demo";
import { chapters } from "@demo/chapters";
import { useDirector } from "@demo/engine/useDirector";
import Orbit360 from "@demo/frame/Orbit360.vue";
import Counters from "@demo/frame/Counters.vue";
import Stage from "@demo/frame/Stage.vue";
import FxLayer from "@demo/frame/FxLayer.vue";
import Controls from "@demo/frame/Controls.vue";
import PresenterNotes from "@demo/frame/PresenterNotes.vue";
import BrandPanel from "@demo/frame/BrandPanel.vue";
import { useBrand } from "@demo/engine/useBrand";
import { watchFullscreen } from "@demo/engine/fullscreen";
import { scenario, staffByKey } from "../scenario";

const store = useDemo();
const director = useDirector();
const { brand } = useBrand();
const chapter = computed(() => chapters[store.chapter]);
const staff = computed(() => staffByKey(store.staffKey));
let unwatch: (() => void) | null = null;
onMounted(() => { unwatch = watchFullscreen(); });
onBeforeUnmount(() => unwatch?.());
</script>

<template>
  <div class="app">
    <header class="top">
      <div class="brand">
        <img v-if="brand.logo" class="logo-img" :src="brand.logo" alt="" />
        <span v-else class="logo" aria-hidden="true">E</span>
        <div class="brand-text"><b>Enable 360</b><small>{{ scenario.center.name }} · عرض تجريبي</small></div>
      </div>
      <Orbit360 :count="chapters.length" :current="store.chapter" :done="store.doneChapters" :title="chapter.title" @jump="director.play" />
      <div class="role">
        <small>على الحاسوب الآن</small>
        <b>{{ staff.name }} · {{ staff.title }}</b>
      </div>
      <Counters :transferred="store.counters.transferred" :reentered="store.counters.reentered" />
    </header>

    <Stage />

    <Controls :finished="director.finished.value" @next="director.next" @prev="director.prev" @skip="director.skip" @restart="director.restart" @pause="director.togglePause" />
    <PresenterNotes v-if="store.notesOpen" :chapter="chapter" :index="store.chapter" @close="store.notesOpen = false" />
    <BrandPanel v-if="store.brandOpen" @close="store.brandOpen = false" />
    <FxLayer />
  </div>
</template>

<style scoped>
.app { height: 100%; display: grid; grid-template-rows: auto 1fr auto; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding: .5rem 1.5rem; background: var(--surface-raised); border-bottom: 1px solid var(--border); }
.brand { display: flex; align-items: center; gap: .6rem; }
.logo { width: 40px; height: 40px; border-radius: 12px; background: var(--brand-navy); color: #fff; display: grid; place-items: center; font-weight: 800; position: relative; }
.logo::after { content: ""; position: absolute; width: 10px; height: 10px; border-radius: 50%; background: var(--brand-orange); top: 6px; right: 6px; }
.logo-img { height: 40px; max-width: 150px; object-fit: contain; }
.brand-text { display: grid; line-height: 1.2; }
.brand-text b { font-size: 1.05rem; direction: ltr; text-align: right; }
.brand-text small { color: var(--ink-muted); font-size: .75rem; }
.role { display: grid; line-height: 1.2; text-align: center; }
.role small { color: var(--ink-muted); font-size: .72rem; }
.role b { color: var(--ink-accent); font-size: .9rem; }
</style>
