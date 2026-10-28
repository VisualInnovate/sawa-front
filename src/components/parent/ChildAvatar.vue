<script setup>
// A child's round badge: the first letters of the name on one of four soft colours (the same colour every time).
import { computed } from "vue";
import { initials, paletteOf } from "@/utils/parentPortal";

const props = defineProps({
  child: { type: Object, required: true },
  size: { type: Number, default: 56 },
});
const palette = computed(() => paletteOf(props.child));
</script>

<template>
  <span class="pp-avatar" :class="`pp-avatar--${palette}`" :style="{ '--size': `${size}px` }" aria-hidden="true">
    {{ initials(child.name) }}
  </span>
</template>

<style scoped>
.pp-avatar {
  display: inline-grid;
  place-items: center;
  width: var(--size);
  height: var(--size);
  border-radius: 38% 62% 55% 45% / 45% 40% 60% 55%;
  font-size: calc(var(--size) * 0.36);
  font-weight: 800;
  flex-shrink: 0;
  letter-spacing: 0.02em;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.06);
}
.pp-avatar--teal {
  background: linear-gradient(135deg, rgb(var(--bp-d2e8ea)), rgb(var(--bp-a7ebf6)));
  color: rgb(var(--bp-035b65));
}
.pp-avatar--magenta {
  background: linear-gradient(135deg, #ffd9df, rgb(var(--bs-fdeef3)));
  color: rgb(var(--bs-b21553));
}
.pp-avatar--cyan {
  background: linear-gradient(135deg, rgb(var(--bp-eafcff)), rgb(var(--bp-a7ebf6)));
  color: rgb(var(--bp-1c6772));
}
.pp-avatar--sun {
  background: linear-gradient(135deg, #fff1bf, #ffe08a);
  color: #7a5a00;
}
</style>
