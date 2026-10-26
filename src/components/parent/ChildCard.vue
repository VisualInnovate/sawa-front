<script setup>
// A child on the home and "my children" pages: who they are, their programs, their evaluations, the next session,
// and what waits for the parent about them. Opens the child's page.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ChildAvatar from "./ChildAvatar.vue";
import { ageText, fmtDay, fmtTime, isGirl, isToday, meta } from "@/utils/parentPortal";

const props = defineProps({
  child: { type: Object, required: true },
  index: { type: Number, default: 0 },
});
const { t } = useI18n();

const programs = computed(() => props.child.programs ?? []);
const next = computed(() => props.child.next_session);
const nextWhen = computed(() => next.value ? `${isToday(next.value.starts_at) ? t("pp.today") : fmtDay(next.value.starts_at)} · ${fmtTime(next.value.starts_at)}` : "");
const attention = computed(() => Number(props.child.pending_generalizations ?? 0) + Number(props.child.consultations?.waiting ?? 0));
</script>

<template>
  <router-link :to="{ name: 'parent-child', params: { child_id: child.id } }" class="pp-card pp-card--link pp-child pp-in" :style="{ '--i': index }">
    <div class="pp-child__top">
      <ChildAvatar :child="child" :size="64" />
      <div class="min-w-0 flex-1">
        <h3 class="pp-h3 truncate">{{ child.name }}</h3>
        <p class="pp-item__meta">{{ ageText(child) }}<template v-if="child.gender !== null && child.gender !== undefined"> · {{ isGirl(child) ? $t("female") : $t("male") }}</template></p>
      </div>
      <span v-if="attention" class="pp-tag pp-tag--magenta pp-pulse" :title="$t('pp.needs_you')"><i class="pi pi-bell" /> {{ attention }}</span>
    </div>

    <div class="pp-child__tags">
      <span v-for="program in programs.slice(0, 2)" :key="program.id" class="pp-tag" :class="`pp-tag--${meta('programKind', program.kind).severity}`">
        {{ meta("programKind", program.kind).label }}
        <span class="pp-child__sep" aria-hidden="true">·</span>
        {{ meta("programStatus", program.status).label }}
      </span>
      <span v-if="!programs.length" class="pp-tag">{{ $t("pp.no_program_yet") }}</span>
      <span class="pp-tag pp-tag--teal"><i class="pi pi-clipboard" /> {{ $t("pp.evaluations_count", { n: child.evaluations?.approved ?? 0 }) }}</span>
    </div>

    <div class="pp-child__next">
      <template v-if="next">
        <i class="pi pi-clock" aria-hidden="true" />
        <span class="truncate"><b>{{ $t("pp.next_session") }}:</b> {{ nextWhen }}<template v-if="next.treatment"> · {{ next.treatment }}</template></span>
      </template>
      <template v-else>
        <i class="pi pi-calendar" aria-hidden="true" />
        <span>{{ $t("pp.no_upcoming_session") }}</span>
      </template>
    </div>

    <span class="pp-child__cta">{{ $t("pp.open_child_file") }} <i class="pi pi-arrow-left rtl-arrow" aria-hidden="true" /></span>
  </router-link>
</template>

<style scoped>
.pp-child {
  display: grid;
  gap: 0.85rem;
  padding: 1.1rem 1.15rem;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}
.pp-child::after {
  content: "";
  position: absolute;
  inset-inline-end: -40px;
  top: -40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--pp-cyan-50);
  z-index: 0;
}
.pp-child > * {
  position: relative;
  z-index: 1;
}
.pp-child__top {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.pp-child__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.pp-child__sep {
  opacity: 0.6;
}
.pp-child__next {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  background: var(--pp-sand);
  font-size: 0.88rem;
  color: var(--pp-text);
  min-width: 0;
}
.pp-child__next .pi {
  color: var(--pp-teal);
}
.pp-child__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--pp-magenta);
  font-weight: 800;
  font-size: 0.9rem;
}
[dir="ltr"] .rtl-arrow {
  transform: scaleX(-1);
}
</style>
