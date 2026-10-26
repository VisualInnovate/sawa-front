<script setup>
// One line of what is coming for a child: the same items as the weekly schedule (session, inclusion time,
// evaluation appointment, consultation), with the day, the time, who and where.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { SCHEDULE_ICON, fmtDay, fmtTime, isToday, meta, scheduleTitle } from "@/utils/parentPortal";

const props = defineProps({
  item: { type: Object, required: true },
  childName: { type: String, default: "" },
});
const { t } = useI18n();

const iconClass = computed(() => ({ session: "", inclusion: "pp-item__icon--info", evaluation: "pp-item__icon--warn", consultation: "pp-item__icon--magenta", meeting: "pp-item__icon--magenta" })[props.item.type] ?? "");
const when = computed(() => {
  const day = isToday(props.item.date) ? t("pp.today") : fmtDay(props.item.date);
  return props.item.start ? `${day} · ${fmtTime(props.item.start)}` : day;
});
const where = computed(() => [props.item.staff, props.item.room].filter(Boolean).join(" · "));
const status = computed(() => (props.item.status && props.item.status !== "closed" ? meta("session", props.item.status) : null));
</script>

<template>
  <div class="pp-item">
    <span class="pp-item__icon" :class="iconClass"><i :class="SCHEDULE_ICON[item.type] ?? 'pi pi-calendar'" aria-hidden="true" /></span>
    <div class="pp-item__body">
      <p class="pp-item__title">
        {{ scheduleTitle(item) }}
        <span v-if="childName" class="pp-muted font-semibold"> — {{ childName }}</span>
      </p>
      <p class="pp-item__meta">{{ when }}<template v-if="where"> · {{ where }}</template></p>
    </div>
    <span v-if="status" class="pp-tag" :class="`pp-tag--${status.severity}`">{{ status.label }}</span>
  </div>
</template>
