<script setup>
// A week as a time grid (days × hours): each item in its type's color at its time, overlapping items side by side.
// The employee's shift is the light band of each day; today, holidays and crowded days are marked on the day head.
// Items without a time (an evaluation without appointment) sit in the «طوال اليوم» row. Clicking an item opens it.
import moment from "moment";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { dayLabel } from "@/utils/studentPrograms";
import { FLAG_META, ITEM_TYPES, STATUS_SEVERITY, formatMinutes, holidayOn, itemSubtitle, itemTitle, layoutDay, minutesOf, needsAttention, statusLabel } from "@/utils/schedules";

const props = defineProps({
  days: { type: Array, required: true },
  items: { type: Array, default: () => [] },
  holidays: { type: Array, default: () => [] },
  now: { type: String, default: null },
  // Show the employee on each item (the parent's and the overview's grids), and the shift band / load (employees).
  showStaff: { type: Boolean, default: false },
  showShift: { type: Boolean, default: true },
  // One child's own grid (the parent's): the cards name what happens — the treatment, the kind of appointment, the
  // evaluation — instead of the child, in bigger type on wider columns; pair it with a taller `hourHeight`.
  ownChild: { type: Boolean, default: false },
  hourHeight: { type: Number, default: 56 }, // px per hour
});

const { t } = useI18n();
const HOUR = computed(() => props.hourHeight);
const evaluationName = (type) => getEvaluationTypeLabel(type, t, t("sch.type_evaluation"));

// The card's words: the child on an employee's grid; on a child's own grid, what the appointment is.
function title(item) {
  if (!props.ownChild) return itemTitle(t, item);
  switch (item.type) {
    case "session": return item.treatment || t("sch.type_session");
    case "inclusion": return item.kind === "supervision" ? t("sp_inclusion_supervision") : t("sch.type_inclusion");
    case "evaluation": return evaluationName(item.evaluation_type);
    default: return item.title || t(`sch.type_${item.type}`);
  }
}
function sub(item) {
  if (!props.ownChild) return [itemSubtitle(t, item, evaluationName), item.room].filter(Boolean).join(" · ");
  const parts = [];
  if (item.type === "session") parts.push(item.treatment ? t("sch.type_session") : null, item.kind ? t(`sp_session_${item.kind}`) : null);
  else if (item.type === "evaluation") parts.push(item.title);
  else if (item.type !== "inclusion" && item.title) parts.push(t(`sch.type_${item.type}`));
  return [...parts, item.room].filter(Boolean).join(" · ");
}

const today = computed(() => (props.now ?? moment().format("YYYY-MM-DD HH:mm")).slice(0, 10));
const nowMinutes = computed(() => minutesOf((props.now ?? moment().format("YYYY-MM-DD HH:mm")).slice(11, 16)));

// From the earliest start (shift or item) to the latest end, whole hours, at least 08:00–16:00.
const hours = computed(() => {
  const starts = [8 * 60];
  const ends = [16 * 60];
  props.items.filter((item) => item.start).forEach((item) => { starts.push(minutesOf(item.start)); ends.push(minutesOf(item.end)); });
  if (props.showShift) props.days.forEach((day) => { if (day.shift) { starts.push(minutesOf(day.shift[0])); ends.push(minutesOf(day.shift[1])); } });
  const first = Math.floor(Math.min(...starts) / 60);
  const last = Math.min(24, Math.ceil(Math.max(...ends) / 60));
  return Array.from({ length: Math.max(1, last - first) }, (_, index) => first + index);
});
const top = (minutes) => ((minutes - hours.value[0] * 60) / 60) * HOUR.value;
const height = computed(() => hours.value.length * HOUR.value);

const columns = computed(() => props.days.map((day) => {
  const dayItems = props.items.filter((item) => item.date === day.date);
  return {
    ...day,
    holiday: day.holiday ?? holidayOn(props.holidays, day.date),
    timed: layoutDay(dayItems.filter((item) => item.start)),
    allDay: dayItems.filter((item) => !item.start),
    attention: dayItems.filter(needsAttention).length,
  };
}));
const hasAllDay = computed(() => columns.value.some((day) => day.allDay.length));

function style(item) {
  const color = ITEM_TYPES[item.type] ?? ITEM_TYPES.availability;
  const width = 100 / item.lanes;
  return {
    top: `${top(item.from)}px`,
    height: `${Math.max(22, ((item.to - item.from) / 60) * HOUR.value - 2)}px`,
    insetInlineStart: `calc(${item.lane * width}% + 2px)`,
    width: `calc(${width}% - 4px)`,
    "--item-bg": color.bg,
    "--item-border": color.border,
    "--item-text": color.text,
  };
}
const flagsOf = (item) => (item.flags ?? []).filter((flag) => FLAG_META[flag]);

const selected = ref(null);
</script>

<template>
  <div class="week-grid-wrap">
    <div class="week-grid" :class="{ 'is-roomy': ownChild }" :style="{ '--days': days.length }">
      <!-- Day heads -->
      <div class="wg-corner" />
      <div v-for="day in columns" :key="`h${day.date}`" class="wg-head"
        :class="{ 'is-today': day.date === today, 'is-holiday': day.holiday, 'is-crowded': day.crowded }">
        <div class="font-bold">{{ dayLabel(t, day.weekday) }}</div>
        <div class="text-xs opacity-80">{{ moment(day.date).format("DD/MM") }}</div>
        <div v-if="day.holiday" class="wg-head-note text-red-700"><i class="pi pi-sun" aria-hidden="true" /> {{ day.holiday.title }}</div>
        <div v-else-if="showShift" class="wg-head-note">
          <span v-if="day.shift" dir="ltr">{{ day.shift[0] }} – {{ day.shift[1] }}</span>
          <template v-else>{{ $t("sch.no_shift") }}</template>
        </div>
        <div v-if="showShift && day.busy_minutes" class="wg-load" :title="$t('sch.load_title', { value: Math.round((day.load ?? 0) * 100) })">
          <span :style="{ width: `${Math.min(100, Math.round((day.load ?? 0) * 100))}%` }" :class="{ 'is-high': day.crowded }" />
        </div>
        <Tag v-if="day.crowded" severity="danger" :value="$t('sch.crowded')" class="wg-tag" />
        <Tag v-else-if="day.attention" severity="warn" :value="$t('sch.attention_count', { count: day.attention })" class="wg-tag" />
      </div>

      <!-- All-day row -->
      <template v-if="hasAllDay">
        <div class="wg-hour wg-allday-label">{{ $t("sch.all_day") }}</div>
        <div v-for="day in columns" :key="`a${day.date}`" class="wg-allday">
          <button v-for="item in day.allDay" :key="item.key" type="button" class="wg-chip"
            :style="{ '--item-bg': ITEM_TYPES[item.type]?.bg, '--item-border': ITEM_TYPES[item.type]?.border, '--item-text': ITEM_TYPES[item.type]?.text }"
            @click="selected = item">
            <i :class="ITEM_TYPES[item.type]?.icon" aria-hidden="true" /> {{ title(item) }}
          </button>
        </div>
      </template>

      <!-- Hours column -->
      <div class="wg-hours" :style="{ height: `${height}px` }">
        <div v-for="hour in hours" :key="hour" dir="ltr" class="wg-hour-label" :style="{ top: `${top(hour * 60)}px` }">{{ String(hour).padStart(2, "0") }}:00</div>
      </div>

      <!-- Day columns -->
      <div v-for="day in columns" :key="`d${day.date}`" class="wg-day" :class="{ 'is-today': day.date === today, 'is-holiday': day.holiday }"
        :style="{ height: `${height}px` }">
        <div v-for="hour in hours" :key="hour" class="wg-line" :style="{ top: `${top(hour * 60)}px` }" />
        <div v-if="showShift && day.shift" class="wg-shift"
          :style="{ top: `${top(minutesOf(day.shift[0]))}px`, height: `${((minutesOf(day.shift[1]) - minutesOf(day.shift[0])) / 60) * hourHeight}px` }" />
        <div v-if="day.date === today && nowMinutes >= hours[0] * 60 && nowMinutes <= (hours[hours.length - 1] + 1) * 60" class="wg-now"
          :style="{ top: `${top(nowMinutes)}px` }" />
        <button v-for="item in day.timed" :key="item.key" type="button" class="wg-item"
          :class="[`is-${item.type}`, `st-${item.status}`, { 'has-conflict': item.flags?.includes('conflict'), 'is-outside': item.flags?.includes('outside_shift'),
            'is-tentative': item.flags?.includes('tentative'), 'has-sub': sub(item) }]"
          :style="style(item)" @click="selected = item">
          <span class="wg-item-time" dir="ltr">{{ item.start }}–{{ item.end }}</span>
          <span class="wg-item-title"><i :class="ITEM_TYPES[item.type]?.icon" aria-hidden="true" /> {{ title(item) }}</span>
          <span v-if="sub(item)" class="wg-item-sub">{{ sub(item) }}</span>
          <span v-if="showStaff && item.staff" class="wg-item-sub wg-item-staff"><i v-if="ownChild" class="pi pi-user" aria-hidden="true" />{{ item.staff }}</span>
          <span class="wg-item-flags">
            <i v-if="['late', 'missed'].includes(item.status)" class="pi pi-exclamation-triangle" :class="item.status === 'missed' ? 'text-red-600' : 'text-orange-500'" aria-hidden="true" />
            <i v-for="flag in flagsOf(item)" :key="flag" :class="FLAG_META[flag].icon" aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>

    <Dialog :visible="!!selected" modal :header="selected ? title(selected) : ''" :style="{ width: '26rem' }" :breakpoints="{ '640px': '94vw' }"
      @update:visible="selected = null">
      <div v-if="selected" class="flex flex-col gap-2 text-sm">
        <div class="flex items-center gap-2">
          <span class="wg-dot" :style="{ background: ITEM_TYPES[selected.type]?.border }" />
          <b>{{ $t(`sch.type_${selected.type}`) }}</b>
          <span class="text-color-secondary">{{ itemSubtitle(t, selected, evaluationName) }}</span>
        </div>
        <div><i class="pi pi-calendar me-1" aria-hidden="true" />{{ dayLabel(t, moment(selected.date).day()) }} {{ selected.date }}
          <template v-if="selected.start"> · <span dir="ltr">{{ selected.start }} – {{ selected.end }}</span></template>
          <template v-else> · {{ $t("sch.all_day") }}</template>
        </div>
        <div v-if="selected.staff"><i class="pi pi-user me-1" aria-hidden="true" />{{ selected.staff }}</div>
        <div v-if="selected.room"><i class="pi pi-home me-1" aria-hidden="true" />{{ selected.room }}</div>
        <div v-if="selected.title && selected.child"><i class="pi pi-tag me-1" aria-hidden="true" />{{ selected.title }}</div>
        <div v-if="selected.status" class="flex flex-wrap gap-1">
          <Tag :severity="STATUS_SEVERITY[selected.status] ?? 'secondary'" :value="statusLabel(t, selected)" />
          <Tag v-for="flag in flagsOf(selected)" :key="flag" :severity="FLAG_META[flag].severity" :icon="FLAG_META[flag].icon" :value="$t(`sch.flag_${flag}`)" />
        </div>
        <div v-if="selected.start" class="text-color-secondary">{{ formatMinutes(t, minutesOf(selected.end) - minutesOf(selected.start)) }}</div>
        <slot name="actions" :item="selected" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.week-grid-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.week-grid {
  display: grid;
  grid-template-columns: 3.5rem repeat(var(--days), minmax(7.5rem, 1fr));
  min-width: calc(3.5rem + var(--days) * 7.5rem);
  border: 1px solid #dfe7e8;
  border-radius: 0.75rem;
  overflow: clip; /* not `hidden`: that would stop the hours column sticking while the wrap scrolls */
  background: #fff;
}
.wg-corner,
.wg-head {
  background: rgb(var(--bp-f3f8f8));
  border-bottom: 1px solid #dfe7e8;
}
.wg-head {
  position: relative;
  padding: 0.5rem 0.4rem 0.6rem;
  text-align: center;
  border-inline-start: 1px solid #e6eded;
  color: rgb(var(--bp-135c65));
  min-height: 5.25rem;
}
.wg-head.is-today {
  background: rgb(var(--bp-135c65));
  color: #fff;
}
.wg-head.is-holiday {
  background: repeating-linear-gradient(135deg, #fdecec, #fdecec 8px, #fff5f5 8px, #fff5f5 16px);
  color: #9b1c1c;
}
.wg-head-note {
  font-size: 0.7rem;
  margin-top: 0.15rem;
  opacity: 0.85;
}
.wg-tag {
  margin-top: 0.3rem;
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
}
.wg-load {
  height: 4px;
  margin: 0.35rem auto 0;
  width: 80%;
  border-radius: 4px;
  background: rgb(var(--bp-135c65) / 0.15);
  overflow: hidden;
}
.wg-head.is-today .wg-load {
  background: rgba(255, 255, 255, 0.3);
}
.wg-load span {
  display: block;
  height: 100%;
  background: #3aa39b;
  border-radius: 4px;
}
.wg-load span.is-high {
  background: #dc2626;
}
.wg-allday-label {
  font-size: 0.65rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 1px solid #dfe7e8;
}
.wg-allday {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.25rem;
  border-inline-start: 1px solid #e6eded;
  border-bottom: 1px solid #dfe7e8;
  background: #fbfcfc;
}
.wg-chip {
  text-align: start;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.4rem;
  background: var(--item-bg);
  color: var(--item-text);
  border-inline-start: 3px solid var(--item-border);
  cursor: pointer;
}
/* The hours stay in view while a phone scrolls through the days. */
.wg-corner,
.wg-allday-label,
.wg-hours {
  position: sticky;
  inset-inline-start: 0;
  z-index: 5;
  background: #fff;
  border-inline-end: 1px solid #e6eded;
}
.wg-corner {
  background: rgb(var(--bp-f3f8f8));
}
.wg-corner + .wg-head,
.wg-allday-label + .wg-allday,
.wg-hours + .wg-day {
  border-inline-start: 0;
}
.wg-hour-label {
  position: absolute;
  inset-inline: 0;
  transform: translateY(-0.45rem);
  font-size: 0.65rem;
  color: #6b7280;
  text-align: center;
}
.wg-hour-label:first-child {
  transform: none;
}
.wg-day {
  position: relative;
  border-inline-start: 1px solid #e6eded;
}
.wg-day.is-today {
  background: rgb(var(--bp-135c65) / 0.035);
}
.wg-day.is-holiday {
  background: repeating-linear-gradient(135deg, #fff6f6, #fff6f6 8px, #fff 8px, #fff 16px);
}
.wg-line {
  position: absolute;
  inset-inline: 0;
  border-top: 1px dashed #edf1f2;
}
.wg-shift {
  position: absolute;
  inset-inline: 0;
  background: rgba(58, 163, 155, 0.08);
  border-inline-start: 3px solid rgba(58, 163, 155, 0.45);
}
.wg-now {
  position: absolute;
  inset-inline: 0;
  border-top: 2px solid #ef4444;
  z-index: 3;
}
.wg-now::before {
  content: "";
  position: absolute;
  inset-inline-start: -4px;
  top: -5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}
.wg-item {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow: hidden;
  text-align: start;
  padding: 0.2rem 0.35rem;
  border-radius: 0.45rem;
  background: var(--item-bg);
  color: var(--item-text);
  border-inline-start: 4px solid var(--item-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.wg-item:hover,
.wg-item:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  z-index: 4;
}
.wg-item.is-availability {
  background: repeating-linear-gradient(135deg, #f7f8f9, #f7f8f9 6px, #eef1f3 6px, #eef1f3 12px);
  border-inline-start-style: dashed;
}
.wg-item.st-finished {
  opacity: 0.7;
}
.wg-item.st-compensated {
  opacity: 0.55;
  text-decoration: line-through;
}
.wg-item.st-ongoing {
  box-shadow: 0 0 0 2px #22c55e;
}
.wg-item.st-late {
  box-shadow: 0 0 0 2px #f59e0b;
}
.wg-item.st-missed {
  background: #fde8e8;
  border-inline-start-color: #dc2626;
  color: #7f1d1d;
}
.wg-item.has-conflict {
  box-shadow: 0 0 0 2px #dc2626;
}
.wg-item.is-outside {
  outline: 2px dashed #f59e0b;
  outline-offset: -2px;
}
.wg-item.is-tentative {
  border-inline-start-style: dashed;
}
.wg-item-time {
  align-self: flex-start;
  font-size: 0.62rem;
  font-weight: 700;
  opacity: 0.85;
}
.wg-item-title {
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wg-item-sub {
  font-size: 0.65rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.85;
}
.wg-item-flags {
  position: absolute;
  top: 0.2rem;
  inset-inline-end: 0.25rem;
  display: flex;
  gap: 0.15rem;
  font-size: 0.65rem;
}
/* One child's own grid: wider columns, each card's lines big enough to read — time, what, where, with whom. */
.week-grid.is-roomy {
  grid-template-columns: 3.75rem repeat(var(--days), minmax(9.5rem, 1fr));
  min-width: calc(3.75rem + var(--days) * 9.5rem);
}
.is-roomy .wg-hour-label {
  font-size: 0.72rem;
}
.is-roomy .wg-chip {
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
}
.is-roomy .wg-item {
  gap: 2px;
  padding: 0.3rem 0.45rem;
  line-height: 1.25;
}
.is-roomy .wg-item-time {
  font-size: 0.74rem;
  opacity: 1;
}
.is-roomy .wg-item-title {
  font-size: 0.86rem;
}
/* A long name (an evaluation's) may take two lines when the card has no detail line to make room for. */
.is-roomy .wg-item:not(.has-sub) .wg-item-title {
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.is-roomy .wg-item-sub {
  font-size: 0.76rem;
  opacity: 0.95;
}
.is-roomy .wg-item-staff .pi {
  font-size: 0.7rem;
  margin-inline-end: 0.25rem;
  opacity: 0.75;
}
.wg-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  display: inline-block;
}
@media (prefers-reduced-motion: reduce) {
  .wg-item { transition: none; }
}
@media print {
  .week-grid-wrap { overflow: visible; }
  .week-grid { min-width: 0; grid-template-columns: 2.5rem repeat(var(--days), 1fr); }
  .wg-item { box-shadow: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .wg-head, .wg-day, .wg-shift, .wg-chip { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
