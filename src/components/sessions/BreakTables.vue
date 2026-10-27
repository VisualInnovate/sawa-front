<script setup>
// The two break tables of the paper «BREAK SCHEDUAL», 9 rows each:
// trials: Date · Session/therapist · Place outside / inside · T.1 … T.10 · T.(1*2) … T.(1*5) · breaks in one session
// minutes: the same first three, then 5min … 50min and the breaks.
// Date is picked on a calendar (kept as YYYY-MM-DD, shown dd/mm/yyyy), Session/therapist is typed, Place is one of
// two buttons, inside or outside (pressed again it is cleared); an older typed date or place is shown as it is.
// A mark cell is "/" or empty (a click toggles it); the breaks cell is the row's total of them, a "/" each with the
// number in its corner. Each table prints on its own landscape page.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import sawaLogo from "@/assets/img/sawa_logo.svg";
import { isDate, showDate } from "@/utils/trackingColumns";

const props = defineProps({
  modelValue: { type: Object, required: true }, // { trials: rows, minutes: rows }
  editable: { type: Boolean, default: false },
  childName: { type: String, default: "" },
  // Only one table (the session page shows them one at a time when space is short).
  only: { type: String, default: null },
});
const emit = defineEmits(["update:modelValue", "change"]);
const { t } = useI18n();

const TRIAL_HEADS = [...Array.from({ length: 10 }, (_, i) => `T.${i + 1}`), "T.(1*2)", "T.(1*3)", "T.(1*4)", "T.(1*5)"];
const MINUTE_HEADS = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 5}min`);
const tables = computed(() => [
  { key: "trials", heads: TRIAL_HEADS, title: t("break_table_trials") },
  { key: "minutes", heads: MINUTE_HEADS, title: t("break_table_minutes") },
].filter((table) => !props.only || table.key === props.only));

function commit(mutate) {
  const next = JSON.parse(JSON.stringify(props.modelValue));
  mutate(next);
  emit("update:modelValue", next);
  emit("change", next);
}
const setText = (key, row, field, value) => commit((next) => { next[key][row][field] = value; });
// The breaks of a row = its "/" marks; saved with the row too, so what is stored matches what is shown.
const breaksOf = (row) => (row.marks ?? []).filter(Boolean).length;
const toggle = (key, row, col) => props.editable && commit((next) => {
  next[key][row].marks[col] = !next[key][row].marks[col];
  next[key][row].breaks = breaksOf(next[key][row]);
});

// Date: the cell opens the browser's calendar of a hidden date input.
const dateInputs = {};
function pickDate(key, row) {
  const input = dateInputs[`${key}-${row}`];
  try {
    input.showPicker();
  } catch {
    input.focus();
    input.click();
  }
}
// Place: inside or outside, the same button again clears it.
const PLACES = ["inside", "outside"];
const setPlace = (key, row, place) => setText(key, row, "place", props.modelValue[key][row].place === place ? "" : place);

// Printing one table: only it shows on the page.
const printing = ref(null);
function print(key) {
  printing.value = key;
  document.body.classList.add("bt-print-mode");
  setTimeout(() => {
    window.print();
    document.body.classList.remove("bt-print-mode");
    printing.value = null;
  }, 50);
}
defineExpose({ print });
</script>

<template>
  <div class="bt-root" :class="{ 'is-readonly': !editable }">
    <section v-for="table in tables" :key="table.key" class="bt-table-card" :class="{ 'bt-print-target': printing === table.key }">
      <header class="bt-head">
        <div class="bt-title">
          <img :src="sawaLogo" alt="Sawa" class="bt-logo" />
          <div>
            <h3>BREAK SCHEDUAL <span class="bt-sub">· {{ table.title }}</span></h3>
            <p>Student name: <b>{{ childName || "…………" }}</b></p>
          </div>
        </div>
        <Button icon="pi pi-print" size="small" variant="outlined" :label="$t('print')" class="bt-no-print" @click="print(table.key)" />
      </header>
      <div class="bt-grid-wrap">
        <table class="bt-grid">
          <thead>
            <tr>
              <th class="bt-col-text">Date</th>
              <th class="bt-col-text">Session/<br />therapist</th>
              <th class="bt-col-place">Place Outside<br />/ inside</th>
              <th v-for="head in table.heads" :key="head" class="bt-col-mark ltr">{{ head }}</th>
              <th class="bt-col-breaks">{{ $t("break_count_head") }}<br /><span class="ltr">////</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in modelValue[table.key]" :key="r">
              <td class="bt-text-cell">
                <span v-if="editable" class="bt-date-wrap">
                  <button type="button" class="bt-date" :class="{ 'is-empty': !row.date }" :aria-label="`Date ${r + 1}`" @click="pickDate(table.key, r)">
                    <template v-if="row.date">{{ showDate(row.date) }}</template><i v-else class="pi pi-calendar" />
                  </button>
                  <input :ref="(el) => (dateInputs[`${table.key}-${r}`] = el)" type="date" class="bt-date-input" tabindex="-1" aria-hidden="true"
                    :value="isDate(row.date) ? row.date : ''" @change="setText(table.key, r, 'date', $event.target.value)" />
                </span>
                <span v-else>{{ showDate(row.date) }}</span>
              </td>
              <td class="bt-text-cell">
                <input v-if="editable" :value="row.session" class="bt-input" :aria-label="`session ${r + 1}`"
                  @change="setText(table.key, r, 'session', $event.target.value)" />
                <span v-else>{{ row.session }}</span>
              </td>
              <td class="bt-text-cell">
                <span v-if="editable" class="bt-places" role="radiogroup" :aria-label="`Place ${r + 1}`">
                  <button v-for="place in PLACES" :key="place" type="button" role="radio" :aria-checked="row.place === place"
                    class="bt-place" :class="[`is-${place}`, { 'is-on': row.place === place, 'bt-no-print': row.place !== place }]"
                    @click="setPlace(table.key, r, place)">{{ place }}</button>
                  <small v-if="row.place && !PLACES.includes(row.place)" class="bt-old">{{ row.place }}</small>
                </span>
                <span v-else :class="PLACES.includes(row.place) ? `bt-place-text is-${row.place}` : undefined">{{ row.place }}</span>
              </td>
              <td v-for="(mark, c) in row.marks" :key="c" class="bt-mark-cell" :class="{ 'is-on': mark }"
                :role="editable ? 'button' : undefined" :tabindex="editable ? 0 : undefined"
                :aria-label="`${table.heads[c]} ${r + 1}`" @click="toggle(table.key, r, c)" @keydown.enter.space.prevent="toggle(table.key, r, c)">
                <Transition name="bt-pop"><span v-if="mark" class="bt-slash">/</span></Transition>
              </td>
              <!-- The row's total: a "/" per mark, and the number in the corner. -->
              <td class="bt-breaks-cell" :aria-label="`${$t('break_count_head')} ${r + 1}: ${breaksOf(row)}`">
                <TransitionGroup name="bt-pop" tag="span" class="bt-slashes ltr">
                  <span v-for="n in breaksOf(row)" :key="n">/</span>
                </TransitionGroup>
                <b v-if="breaksOf(row)" class="bt-total ltr">{{ breaksOf(row) }}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bt-root { display: grid; gap: .75rem; min-height: 0; }
.bt-table-card { display: flex; flex-direction: column; min-height: 0; padding: .75rem; border: 1px solid #e2e8f0; border-radius: 14px; background: #fff;
  animation: bt-rise .35s ease both; }
.bt-table-card + .bt-table-card { animation-delay: .08s; }
.bt-head { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: .5rem; }
.bt-title { display: flex; align-items: center; gap: .6rem; }
.bt-logo { height: 2.1rem; }
.bt-title h3 { margin: 0; font-size: .95rem; font-weight: 800; color: #135c65; letter-spacing: .02em; }
.bt-sub { font-weight: 600; color: #64748b; }
.bt-title p { margin: 0; font-size: .8rem; color: #475569; direction: ltr; text-align: start; }
.bt-grid-wrap { min-height: 0; overflow: hidden; }
.bt-grid { width: 100%; border-collapse: collapse; table-layout: fixed; direction: ltr; font-size: .78rem; }
.bt-grid th, .bt-grid td { border: 1px solid #cbd5e1; padding: 0; height: 1.85rem; text-align: center; }
.bt-grid th { background: #eef6f6; color: #0f3d43; font-weight: 700; font-size: .7rem; line-height: 1.15; padding: .15rem; }
.bt-col-text { width: 9%; }
.bt-col-place { width: 10%; }
.bt-col-breaks { width: 11%; direction: rtl; }
.bt-text-cell span { padding: 0 .25rem; }
.bt-input { width: 100%; height: 100%; min-height: 0; padding: 0; line-height: 1.2; border: 0; background: transparent; text-align: center; font: inherit; color: #0f172a; outline: none; }
.bt-input:focus { background: #f0fdfa; box-shadow: inset 0 0 0 2px #14b8a6; }
.bt-date-wrap { position: relative; display: block; height: 100%; }
.bt-date { width: 100%; height: 100%; border: 0; background: transparent; font: inherit; color: #0f172a; font-weight: 600; cursor: pointer; white-space: nowrap; }
.bt-date.is-empty { color: #94a3b8; }
.bt-date:hover, .bt-date:focus-visible { background: #f0fdfa; box-shadow: inset 0 0 0 2px #14b8a6; outline: none; }
.bt-date-input { position: absolute; left: 0; bottom: 0; width: 1px; height: 1px; opacity: 0; pointer-events: none; border: 0; padding: 0; }
.bt-places { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 2px; padding: 2px; }
.bt-place { padding: .1rem .3rem; border: 1px solid #cbd5e1; border-radius: 999px; background: #fff; color: #475569; font: inherit; font-size: .66rem; font-weight: 700;
  cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
.bt-place:hover { border-color: #0f8a7e; }
.bt-place.is-on.is-inside { background: #0f766e; border-color: #0f766e; color: #fff; }
.bt-place.is-on.is-outside { background: #b45309; border-color: #b45309; color: #fff; }
.bt-place-text { font-weight: 700; }
.bt-place-text.is-inside { color: #0f766e; }
.bt-place-text.is-outside { color: #b45309; }
.bt-old { width: 100%; color: #92400e; font-size: .62rem; }
.bt-mark-cell { position: relative; cursor: pointer; transition: background .15s; user-select: none; }
.bt-breaks-cell { position: relative; padding: 0 1rem !important; }
.is-readonly .bt-mark-cell { cursor: default; }
.bt-root:not(.is-readonly) .bt-mark-cell:hover { background: #f0fdfa; }
.bt-mark-cell.is-on { background: #ecfdf5; }
.bt-slash, .bt-slashes { font-weight: 800; color: #0f766e; font-size: 1.05rem; line-height: 1; }
.bt-slashes { display: inline-flex; flex-wrap: wrap; justify-content: center; letter-spacing: .05em; }
/* the number in the cell's corner */
.bt-total { position: absolute; top: 1px; right: 2px; min-width: 1rem; padding: 0 .2rem; border-radius: 999px; background: #135c65; color: #fff;
  font-size: .62rem; font-weight: 800; line-height: 1rem; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.bt-pop-enter-active { animation: bt-pop .25s cubic-bezier(.34, 1.56, .64, 1); }
.bt-pop-leave-active { animation: bt-pop .15s reverse ease-in; }
@keyframes bt-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes bt-rise { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
</style>

<style>
/* Printing one table: everything else hides; the table fills a landscape page. */
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  body.bt-print-mode * { visibility: hidden !important; }
  body.bt-print-mode .bt-print-target, body.bt-print-mode .bt-print-target * { visibility: visible !important; }
  body.bt-print-mode .bt-print-target { position: fixed; inset: 0; border: 0; padding: 0; animation: none; }
  body.bt-print-mode .bt-no-print { display: none !important; }
  body.bt-print-mode .bt-print-target .bt-grid td, body.bt-print-mode .bt-print-target .bt-grid th { height: 12mm; border-color: #000; }
}
</style>
