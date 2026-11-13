<script setup>
// One video (a remote member's, or mine) played into its box; falls back to the name's initial.
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  track: { type: Object, default: null },
  name: { type: String, default: "" },
  muted: { type: Boolean, default: false },
  speaking: { type: Boolean, default: false },
  mine: { type: Boolean, default: false },
});
const box = ref(null);

watch(
  () => [props.track, box.value],
  ([track, el], old) => {
    old?.[0]?.stop?.();
    if (track && el) track.play(el, { fit: "cover", mirror: props.mine });
  },
  { immediate: true },
);
onBeforeUnmount(() => props.track?.stop?.());
</script>

<template>
  <div class="cm-tile" :class="{ 'is-speaking': speaking }">
    <div v-show="track" ref="box" class="cm-tile__video" />
    <div v-if="!track" class="cm-tile__avatar">{{ (name || "?").trim().charAt(0) }}</div>
    <div class="cm-tile__name">
      <i v-if="muted" class="pi pi-microphone-slash" aria-hidden="true" />
      <span>{{ name }}</span>
    </div>
  </div>
</template>

<style scoped>
.cm-tile { position: relative; background: #1f2a30; border-radius: 14px; overflow: hidden; min-height: 140px; display: flex; align-items: center; justify-content: center; outline: 3px solid transparent; transition: outline-color 0.2s; }
.cm-tile.is-speaking { outline-color: #22c55e; }
.cm-tile__video { position: absolute; inset: 0; }
.cm-tile__avatar { width: 72px; height: 72px; border-radius: 50%; background: #135c65; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; }
.cm-tile__name { position: absolute; bottom: 8px; inset-inline-start: 8px; background: rgba(0, 0, 0, 0.55); color: #fff; padding: 2px 10px; border-radius: 999px; font-size: 0.85rem; display: flex; gap: 6px; align-items: center; }
</style>
