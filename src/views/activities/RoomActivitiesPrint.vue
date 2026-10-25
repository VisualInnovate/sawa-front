<script setup>
// A room's weekly activities as a printable sheet (A4 landscape), like the centre's class schedule: a row per day,
// a column per time slot (the slots are cut wherever an activity starts or ends), each activity with its image and
// name across the slots it covers.
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { DAY_INDEXES } from "@/utils/activities";

const { t } = useI18n();
const route = useRoute();
const loading = ref(true);
const failed = ref(false);
const room = ref(null);
const entries = ref([]);
const hours = ref({});

const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
})();
const hm = (value) => String(value ?? "").replace(/^0(\d):/, "$1:");

// The days that work (have hours) or have activities, Sunday first.
const days = computed(() => DAY_INDEXES.filter((day) => hours.value[day]?.length || entries.value.some((entry) => entry.days.includes(day))));
// Every start and end makes a cut; a slot is kept when some activity covers it on some day.
const slots = computed(() => {
  const cuts = [...new Set(entries.value.flatMap((entry) => [entry.start, entry.end]))].sort();
  const list = [];
  for (let i = 0; i < cuts.length - 1; i += 1) {
    const slot = { start: cuts[i], end: cuts[i + 1] };
    if (entries.value.some((entry) => entry.start <= slot.start && slot.end <= entry.end)) list.push(slot);
  }
  return list;
});
// One day's row: an activity cell spanning its slots, or an empty cell.
const rowOf = (day) => {
  const cells = [];
  let i = 0;
  while (i < slots.value.length) {
    const slot = slots.value[i];
    const entry = entries.value.find((item) => item.days.includes(day) && item.start === slot.start);
    if (entry) {
      let span = 1;
      while (i + span < slots.value.length && slots.value[i + span].end <= entry.end) span += 1;
      cells.push({ key: `${day}-${i}`, entry, span });
      i += span;
    } else {
      cells.push({ key: `${day}-${i}`, entry: null, span: 1 });
      i += 1;
    }
  }
  return cells;
};

const previousTitle = document.title;
async function load() {
  loading.value = true;
  failed.value = false;
  try {
    const { data } = await axios.get(`api/room-activities/rooms/${route.params.roomId}/week`);
    room.value = data.room;
    entries.value = data.data ?? [];
    hours.value = data.hours ?? {};
    document.title = `${t("activities.print_title")} - ${data.room?.name ?? ""}`;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
const print = () => window.print();
onMounted(load);
onBeforeUnmount(() => { document.title = previousTitle; });
</script>

<template>
  <div class="wp-root" dir="rtl">
    <header class="wp-toolbar">
      <strong>{{ $t("activities.print_title") }}<template v-if="room"> — {{ room.name }}</template></strong>
      <Button :label="$t('print')" icon="pi pi-print" :disabled="loading || failed" @click="print" />
    </header>

    <p v-if="loading" class="wp-state">{{ $t("loading") }}</p>
    <p v-else-if="failed" class="wp-state">{{ $t("request_failed_retry") }}</p>

    <section v-else class="wp-sheet">
      <div class="wp-head">
        <div class="wp-head-side">
          <h1>{{ $t("activities.print_title") }}</h1>
          <p>{{ $t("activities.room") }}: <b>{{ room?.name }}</b></p>
        </div>
        <img :src="sawaLogo" alt="Sawa" class="wp-logo" />
        <div class="wp-head-side wp-head-date">
          <p>{{ $t("activities.print_date") }}: <b dir="ltr">{{ today }}</b></p>
        </div>
      </div>

      <p v-if="!slots.length" class="wp-state">{{ $t("activities.no_room_activities") }}</p>
      <table v-else class="wp-table">
        <thead>
          <tr>
            <th class="wp-day-col" />
            <th v-for="slot in slots" :key="slot.start"><span dir="ltr">{{ hm(slot.start) }}-{{ hm(slot.end) }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="day in days" :key="day">
            <th class="wp-day">{{ $t("activities.day_" + day) }}</th>
            <td v-for="cell in rowOf(day)" :key="cell.key" :colspan="cell.span" class="wp-cell">
              <figure v-if="cell.entry" class="wp-activity">
                <img v-if="cell.entry.activity?.image_url" :src="cell.entry.activity.image_url" alt="" />
                <figcaption>{{ cell.entry.activity?.name }}</figcaption>
              </figure>
            </td>
          </tr>
        </tbody>
      </table>

      <footer class="wp-foot">
        <div v-for="key in ['supervision', 'students', 'accounting']" :key="key" class="wp-stamp">
          <img :src="sawaLogo" alt="" />
          <span>{{ $t("activities.stamp_" + key) }}</span>
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.wp-root { min-height: 100vh; background: #e8edef; color: #111827; }
.wp-toolbar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .7rem 1.25rem; background: #fff; border-bottom: 1px solid #e2e8f0; }
.wp-toolbar strong { color: var(--sawa-primary, #135c65); }
.wp-state { padding: 3rem 1rem; text-align: center; color: #64748b; }
/* A4 landscape */
.wp-sheet { box-sizing: border-box; display: flex; flex-direction: column; gap: 6mm; width: 297mm; min-height: 210mm; margin: 24px auto; padding: 10mm 12mm; background: #fff; box-shadow: 0 10px 30px -12px rgba(15, 23, 42, .35); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.wp-head { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 6mm; }
.wp-head h1 { margin: 0; font-size: 18pt; font-weight: 800; }
.wp-head p { margin: 1mm 0 0; font-size: 11pt; }
.wp-head-date { text-align: end; }
.wp-logo { height: 22mm; }
.wp-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 10pt; }
.wp-table th, .wp-table td { border: 1.5px solid #1f2937; text-align: center; vertical-align: middle; }
.wp-table thead th { height: 10mm; padding: 1mm; background: #fff; font-size: 11pt; font-weight: 800; }
.wp-day-col { width: 26mm; background: #e5e7eb !important; }
.wp-day { padding: 2mm; font-size: 12pt; font-weight: 800; }
.wp-cell { height: 27mm; padding: 1.5mm; }
.wp-activity { display: grid; justify-items: center; gap: 1mm; margin: 0; }
.wp-activity img { width: 17mm; height: 17mm; object-fit: cover; border-radius: 2mm; }
.wp-activity figcaption { font-family: "Times New Roman", serif; font-size: 10pt; font-weight: 700; line-height: 1.2; }
.wp-foot { display: flex; justify-content: space-around; gap: 6mm; margin-top: auto; }
.wp-stamp { display: grid; justify-items: center; gap: 1mm; min-width: 50mm; padding: 2mm 4mm; border: 2px solid #1d4ed8; border-radius: 3px; color: #1d4ed8; font-size: 9pt; font-weight: 700; }
.wp-stamp img { height: 7mm; }
</style>

<style>
@media print {
  @page { size: A4 landscape; margin: 0; }
  html, body { margin: 0 !important; background: #fff !important; }
  .wp-toolbar { display: none !important; }
  .wp-root { background: #fff !important; min-height: 0 !important; }
  .wp-sheet { width: 100% !important; min-height: 208mm !important; margin: 0 !important; box-shadow: none !important; }
}
</style>
