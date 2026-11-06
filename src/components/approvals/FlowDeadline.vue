<script setup>
// A request's place in its approval flow (phase 6a: leaves, departures, advances, overtime): the stage, the time left
// (or how late it is), escalations, standing in for someone, and the history. state = the API's «approval» object.
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({ state: { type: Object, default: null }, compact: { type: Boolean, default: false } });
const { t } = useI18n();

const running = computed(() => props.state?.status === "running");
function duration(minutes) {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  return [days ? t("apf.d", { n: days }) : "", hours ? t("apf.h", { n: hours }) : "", !days && mins ? t("apf.m", { n: mins }) : ""].filter(Boolean).join(" ") || t("apf.m", { n: 0 });
}
const left = computed(() => {
  const m = props.state?.minutes_left;
  if (!running.value || m === null || m === undefined) return null;
  return m < 0 ? { text: t("apf.late_by", { time: duration(-m) }), severity: "danger" } : { text: t("apf.left", { time: duration(m) }), severity: m < 240 ? "warn" : "success" };
});
</script>

<template>
  <div v-if="state" class="flow-deadline">
    <div class="flex flex-wrap items-center gap-2">
      <Tag v-if="left" :value="left.text" :severity="left.severity" icon="pi pi-clock" />
      <Tag v-if="running && state.escalations" :value="$t('apf.escalated_times', { n: state.escalations })" severity="danger" icon="pi pi-arrow-up" />
      <small v-if="running && state.due_at" class="text-muted-color">{{ $t("apf.deadline") }}: <bdi dir="ltr">{{ state.due_at }}</bdi></small>
    </div>
    <small v-if="state.on_behalf_of" class="text-muted-color">{{ $t("apf.for", { name: state.on_behalf_of }) }}</small>
    <details v-if="!compact && state.history?.length" class="flow-history">
      <summary>{{ $t("apf.history") }}</summary>
      <ul>
        <li v-for="(h, i) in state.history" :key="i">
          <bdi dir="ltr" class="text-muted-color">{{ h.at }}</bdi> — {{ $t(`apf.action_${h.action}`) }}<template v-if="h.user"> · {{ h.user }}</template>
          <span v-if="h.on_behalf_of" class="text-muted-color"> ({{ $t("apf.for", { name: h.on_behalf_of }) }})</span>
          <div v-if="h.note && h.note !== 'auto'" class="flow-note">{{ h.note }}</div>
        </li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.flow-deadline { display: grid; gap: 0.4rem; }
.flow-history summary { cursor: pointer; font-size: 0.85rem; font-weight: 600; }
.flow-history ul { margin: 0.4rem 0 0; padding-inline-start: 1rem; display: grid; gap: 0.25rem; font-size: 0.82rem; }
.flow-note { color: var(--p-text-muted-color); font-style: italic; }
</style>
