<script setup>
// The two break tables of the paper «BREAK SCHEDUAL», 9 rows each:
// trials: Date · Session/therapist · Place out side · T.1 … T.10 · T.(1*2) … T.(1*5) · breaks in one session
// minutes: the same first three, then 5min … 50min and the breaks.
// The first three cells are typed; a mark cell is "/" or empty (a click toggles it); the breaks cell holds several
// "/" (a click adds one, the small minus removes one). Each table prints on its own landscape page.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import sawaLogo from "@/assets/img/sawa_logo.svg";

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
const toggle = (key, row, col) => props.editable && commit((next) => { next[key][row].marks[col] = !next[key][row].marks[col]; });
const addBreak = (key, row) => props.editable && commit((next) => { next[key][row].breaks = Math.min(30, next[key][row].breaks + 1); });
const removeBreak = (key, row) => props.editable && commit((next) => { next[key][row].breaks = Math.max(0, next[key][row].breaks - 1); });

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
              <th class="bt-col-place">Place Out<br />side</th>
              <th v-for="head in table.heads" :key="head" class="bt-col-mark ltr">{{ head }}</th>
              <th class="bt-col-breaks">{{ $t("break_count_head") }}<br /><span class="ltr">////</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in modelValue[table.key]" :key="r">
              <td v-for="field in ['date', 'session', 'place']" :key="field" class="bt-text-cell">
                <input v-if="editable" :value="row[field]" class="bt-input" :aria-label="`${field} ${r + 1}`"
                  @change="setText(table.key, r, field, $event.target.value)" />
                <span v-else>{{ row[field] }}</span>
              </td>
              <td v-for="(mark, c) in row.marks" :key="c" class="bt-mark-cell" :class="{ 'is-on': mark }"
                :role="editable ? 'button' : undefined" :tabindex="editable ? 0 : undefined"
                :aria-label="`${table.heads[c]} ${r + 1}`" @click="toggle(table.key, r, c)" @keydown.enter.space.prevent="toggle(table.key, r, c)">
                <Transition name="bt-pop"><span v-if="mark" class="bt-slash">/</span></Transition>
              </td>
              <td class="bt-breaks-cell" :role="editable ? 'button' : undefined" :tabindex="editable ? 0 : undefined"
                @click="addBreak(table.key, r)" @keydown.enter.space.prevent="addBreak(table.key, r)">
                <TransitionGroup name="bt-pop" tag="span" class="bt-slashes ltr">
                  <span v-for="n in row.breaks" :key="n">/</span>
                </TransitionGroup>
                <button v-if="editable && row.breaks" type="button" class="bt-minus bt-no-print" :aria-label="$t('remove')"
                  @click.stop="removeBreak(table.key, r)"><i class="pi pi-minus" /></button>
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
.bt-col-place { width: 7%; }
.bt-col-breaks { width: 11%; direction: rtl; }
.bt-text-cell span { padding: 0 .25rem; }
.bt-input { width: 100%; height: 100%; min-height: 0; padding: 0; line-height: 1.2; border: 0; background: transparent; text-align: center; font: inherit; color: #0f172a; outline: none; }
.bt-input:focus { background: #f0fdfa; box-shadow: inset 0 0 0 2px #14b8a6; }
.bt-mark-cell, .bt-breaks-cell { position: relative; cursor: pointer; transition: background .15s; user-select: none; }
.is-readonly .bt-mark-cell, .is-readonly .bt-breaks-cell { cursor: default; }
.bt-root:not(.is-readonly) .bt-mark-cell:hover, .bt-root:not(.is-readonly) .bt-breaks-cell:hover { background: #f0fdfa; }
.bt-mark-cell.is-on { background: #ecfdf5; }
.bt-slash, .bt-slashes { font-weight: 800; color: #0f766e; font-size: 1.05rem; line-height: 1; }
.bt-slashes { display: inline-flex; letter-spacing: .05em; }
.bt-minus { position: absolute; inset-inline-end: 2px; top: 50%; transform: translateY(-50%); width: 1.1rem; height: 1.1rem; border: 0; border-radius: 50%;
  background: #fee2e2; color: #b91c1c; font-size: .55rem; display: grid; place-items: center; opacity: 0; transition: opacity .15s; cursor: pointer; }
.bt-breaks-cell:hover .bt-minus, .bt-minus:focus { opacity: 1; }
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
