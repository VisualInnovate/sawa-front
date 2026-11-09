<script setup>
// The ELM evaluation of one child (/elm-evaluation/:id): the paper form «تقييم مهارات الاستعداد للتعلم». Each item of the
// four parts (RA, NVI, EL, VI) is answered (+) or (−) with the caregiver and with the therapist; pressing the chosen
// sign again leaves it empty (not tested), and either may stay empty. Each part's percentage of (+) is counted as they
// answer. Then how the child asks for basic needs and the toilet, the behaviour problems, where each came from, and the
// supervisor's recommendations. The parts, items and ages come from «إعدادات ELM».
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toDateOnly } from "@/utils/childAge";
import { childMonths, fitsAge, formatAgeRange } from "@/utils/ageRange";
import EditModeBanner from "@/components/evaluations/EditModeBanner.vue";
import { COLORS, PEOPLE, itemText, liveScore } from "./elm";
import { useEvaluationLeaveGuard } from "@/utils/evaluationLeaveGuard";

// Leaving before saving asks first (the answers are sent only at the end).
useEvaluationLeaveGuard();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const childId = computed(() => Number(route.params.id) || Number(localStorage.getItem("child_id")) || null);
const loading = ref(true);
const loadError = ref("");
const context = ref(null);
const saving = ref(false);
const alertText = ref("");
const date = ref(new Date());
const color = ref(COLORS[0]);
const notes = ref("");
// item id -> { caregiver: true|false|null, therapist: true|false|null }
const answers = ref({});
const emptySource = (direct = "") => ({ direct, indirect: [], other: "" });
const emptyInfo = (direct = "") => ({
  needs: { mode: null, how: "", specific: "", general: [""], general_count: null, notes: "" },
  toilet: { mode: null, how: "", notes: "" },
  behaviors: [""],
  needs_source: emptySource(direct),
  behaviors_source: emptySource(direct),
  recommendations: "",
});
const info = ref(emptyInfo());
// Editing a saved evaluation (?edit=id) before its approval.
const editing = ref(null);

const sections = computed(() => context.value?.sections ?? []);
const child = computed(() => context.value?.child ?? null);
const columnsOf = (section) => ["material", "tool"].map((column) => ({ column, items: section.items.filter((item) => item.column === column) })).filter((group) => group.items.length);
const answeredCount = computed(() => Object.values(answers.value).filter((row) => PEOPLE.some((person) => typeof row?.[person] === "boolean")).length);
const itemCount = computed(() => sections.value.reduce((sum, section) => sum + section.items.length, 0));

const ageMonths = computed(() => (child.value?.birth_date && date.value ? childMonths(child.value.birth_date, date.value) : null));
const range = computed(() => context.value?.age_range ?? {});
const ageWarning = computed(() => ageMonths.value !== null && !fitsAge(range.value.from_months, range.value.to_months, ageMonths.value));

const SOURCES = ["father", "mother", "other"];
const MODES = computed(() => [
  { value: "verbal", label: t("elm.mode_verbal") },
  { value: "nonverbal", label: t("elm.mode_nonverbal") },
]);

// The same sign again empties the answer.
function answer(item, person, value) {
  const row = answers.value[item.id] ?? { caregiver: null, therapist: null };
  answers.value = { ...answers.value, [item.id]: { ...row, [person]: row[person] === value ? null : value } };
}
const valueOf = (item, person) => answers.value[item.id]?.[person] ?? null;

function addLine(list) {
  list.push("");
}
function removeLine(list, index) {
  list.splice(index, 1);
  if (!list.length) list.push("");
}

function fillInfo(saved, direct) {
  const base = emptyInfo(direct);
  const merged = {
    ...base,
    ...saved,
    needs: { ...base.needs, ...(saved?.needs ?? {}) },
    toilet: { ...base.toilet, ...(saved?.toilet ?? {}) },
    needs_source: { ...base.needs_source, ...(saved?.needs_source ?? {}) },
    behaviors_source: { ...base.behaviors_source, ...(saved?.behaviors_source ?? {}) },
  };
  if (!merged.needs.general?.length) merged.needs.general = [""];
  if (!merged.behaviors?.length) merged.behaviors = [""];
  info.value = merged;
}

async function load() {
  loading.value = true;
  loadError.value = "";
  alertText.value = "";
  answers.value = {};
  notes.value = "";
  color.value = COLORS[0];
  date.value = new Date();
  editing.value = null;
  try {
    if (route.query.edit) {
      const { data } = (await axios.get(`api/elm-answers/evaluation/${route.query.edit}/edit`)).data;
      context.value = data.context;
      editing.value = data.evaluation;
      date.value = data.evaluation.date ? new Date(data.evaluation.date) : new Date();
      answers.value = Object.fromEntries(Object.entries(data.answers ?? {}).map(([id, row]) => [Number(id), { caregiver: row?.caregiver ?? null, therapist: row?.therapist ?? null }]));
      color.value = data.color || COLORS[0];
      notes.value = data.notes ?? "";
      fillInfo(data.info ?? {}, "");
      return;
    }
    context.value = (await axios.get(`api/elm-answers/context/${childId.value}`)).data;
    fillInfo({}, context.value.evaluator ?? "");
  } catch (error) {
    loadError.value = error.response?.data?.message || t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}

// What the server keeps: every item of the form, the lists without empty lines.
function payload() {
  const lines = (list) => (list ?? []).map((line) => String(line ?? "").trim()).filter(Boolean);
  return {
    color: color.value,
    notes: notes.value.trim() || null,
    answers: sections.value.flatMap((section) => section.items.map((item) => ({
      item: item.id, caregiver: valueOf(item, "caregiver"), therapist: valueOf(item, "therapist"),
    }))),
    info: {
      ...info.value,
      needs: { ...info.value.needs, general: lines(info.value.needs.general) },
      behaviors: lines(info.value.behaviors),
    },
  };
}

async function save() {
  if (!answeredCount.value) {
    alertText.value = t("elm.answer_one");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  saving.value = true;
  alertText.value = "";
  try {
    if (editing.value) {
      await axios.put(`api/elm-answers/evaluation/${editing.value.id}/edit`, payload());
      router.push({ name: "elm-result", params: { id: child.value?.id ?? childId.value, evaluation: editing.value.id } });
      return;
    }
    const { data } = await axios.post("api/elm-answers", {
      child_id: childId.value, date: toDateOnly(date.value), request_id: route.query.requestId || null, ...payload(),
    });
    router.push({ name: "elm-result", params: { id: childId.value, evaluation: data.evaluation_id } });
  } catch (error) {
    alertText.value = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "elm-evaluation") load();
});
</script>

<template>
  <div class="el-page">
    <header class="el-hero">
      <div class="el-hero-main">
        <span class="el-hero-icon"><i class="pi pi-th-large" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("elm.title") }}</h1>
          <p v-if="child">{{ child.name }}</p>
        </div>
      </div>
      <div v-if="context" class="el-hero-progress">
        <b>{{ answeredCount }}/{{ itemCount }}</b>
        <span>{{ $t("elm.answered") }}</span>
      </div>
    </header>

    <div v-if="loading" class="el-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <template v-else>
      <EditModeBanner v-if="editing" :status="editing.approval_status" :note="editing.approval_note" />
      <Message v-if="alertText" severity="error" :closable="false">{{ alertText }}</Message>

      <section class="el-card">
        <div class="el-grid">
          <div class="el-field">
            <label for="el-date">{{ $t("date") }}</label>
            <DatePicker v-model="date" inputId="el-date" showIcon fluid :disabled="Boolean(editing)" />
          </div>
          <div class="el-field">
            <label>{{ $t("elm.child_age") }}</label>
            <p class="el-age">{{ ageMonths === null ? "—" : $t("elm.months", { n: ageMonths }) }}</p>
          </div>
          <div class="el-field">
            <label>{{ $t("elm.color") }}</label>
            <div class="el-colors" role="radiogroup" :aria-label="$t('elm.color')">
              <button v-for="c in COLORS" :key="c" type="button" role="radio" class="el-color" :class="{ 'is-picked': color === c }"
                :style="{ background: '#' + c }" :aria-checked="color === c" :aria-label="'#' + c" @click="color = c" />
            </div>
          </div>
        </div>
        <Message v-if="ageWarning" severity="warn" :closable="false" class="mt-3">
          {{ $t("elm.age_warning", { age: $t("elm.months", { n: ageMonths }), range: formatAgeRange($t, range.from_months, range.to_months) }) }}
        </Message>
        <p class="el-instructions"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("elm.how_to_answer") }}</p>
      </section>

      <!-- The four parts -->
      <section v-for="section in sections" :key="section.id" class="el-card">
        <header class="el-section-head">
          <span class="el-code">{{ section.code }}</span>
          <h2>{{ section.name }}</h2>
          <div class="el-section-score">
            <span v-for="person in PEOPLE" :key="person">
              {{ $t(`elm.with_${person}`) }}:
              <b class="ltr">{{ liveScore(section.items, answers, person).percent ?? "—" }}<template v-if="liveScore(section.items, answers, person).percent !== null">%</template></b>
            </span>
          </div>
        </header>
        <p v-if="section.instructions" class="el-instructions">{{ section.instructions }}</p>

        <div class="el-columns">
          <div v-for="group in columnsOf(section)" :key="group.column" class="el-column">
            <table class="el-table">
              <thead>
                <tr>
                  <th>{{ $t(`elm.column_${group.column}`) }}</th>
                  <th v-for="person in PEOPLE" :key="person">{{ $t(`elm.with_${person}`) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in group.items" :key="item.id">
                  <td class="el-item">{{ itemText(item.text, child?.name) }}</td>
                  <td v-for="person in PEOPLE" :key="person" class="el-signs">
                    <div role="radiogroup" :aria-label="`${itemText(item.text, child?.name)} — ${$t(`elm.with_${person}`)}`">
                      <button type="button" role="radio" class="el-sign is-plus" :class="{ 'is-picked': valueOf(item, person) === true }"
                        :aria-checked="valueOf(item, person) === true" :aria-label="$t('elm.plus')" @click="answer(item, person, true)">+</button>
                      <button type="button" role="radio" class="el-sign is-minus" :class="{ 'is-picked': valueOf(item, person) === false }"
                        :aria-checked="valueOf(item, person) === false" :aria-label="$t('elm.minus')" @click="answer(item, person, false)">−</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Basic needs -->
      <section class="el-card">
        <h2 class="el-title">{{ $t("elm.needs") }}</h2>
        <div class="el-field">
          <label>{{ $t("elm.request_mode") }}</label>
          <SelectButton v-model="info.needs.mode" :options="MODES" optionLabel="label" optionValue="value" />
        </div>
        <div class="el-grid">
          <div class="el-field">
            <label for="el-needs-how">{{ $t("elm.how") }}</label>
            <InputText id="el-needs-how" v-model="info.needs.how" />
          </div>
          <div class="el-field">
            <label for="el-needs-specific">{{ $t("elm.needs_specific") }}</label>
            <InputText id="el-needs-specific" v-model="info.needs.specific" :placeholder="$t('elm.needs_specific_hint')" />
          </div>
        </div>
        <div class="el-field">
          <label>{{ $t("elm.needs_general") }} <small class="el-hint">{{ $t("elm.needs_general_hint") }}</small></label>
          <div v-for="(line, i) in info.needs.general" :key="'g' + i" class="el-line">
            <InputText v-model="info.needs.general[i]" :aria-label="`${$t('elm.needs_general')} ${i + 1}`" />
            <Button icon="pi pi-times" severity="secondary" variant="text" rounded :aria-label="$t('delete')" @click="removeLine(info.needs.general, i)" />
          </div>
          <Button class="el-add" icon="pi pi-plus" :label="$t('elm.add_line')" size="small" variant="outlined" @click="addLine(info.needs.general)" />
        </div>
        <div class="el-grid">
          <div class="el-field">
            <label for="el-needs-count">{{ $t("elm.needs_count") }}</label>
            <InputNumber inputId="el-needs-count" v-model="info.needs.general_count" :min="0" :max="1000" :useGrouping="false" />
          </div>
          <div class="el-field">
            <label for="el-needs-notes">{{ $t("elm.other_notes") }}</label>
            <InputText id="el-needs-notes" v-model="info.needs.notes" />
          </div>
        </div>
        <fieldset class="el-source">
          <legend>{{ $t("elm.source") }}</legend>
          <div class="el-grid">
            <div class="el-field">
              <label for="el-needs-direct">{{ $t("elm.source_direct") }}</label>
              <InputText id="el-needs-direct" v-model="info.needs_source.direct" :placeholder="$t('elm.source_direct_hint')" />
            </div>
            <div class="el-field">
              <label>{{ $t("elm.source_indirect") }}</label>
              <div class="el-checks">
                <label v-for="who in SOURCES" :key="who" class="el-check">
                  <Checkbox v-model="info.needs_source.indirect" :value="who" /> {{ $t(`elm.source_${who}`) }}
                </label>
                <InputText v-if="info.needs_source.indirect.includes('other')" v-model="info.needs_source.other" :placeholder="$t('elm.source_other_hint')"
                  :aria-label="$t('elm.source_other')" />
              </div>
            </div>
          </div>
        </fieldset>

        <h2 class="el-title el-space">{{ $t("elm.toilet") }}</h2>
        <div class="el-field">
          <label>{{ $t("elm.request_mode") }}</label>
          <SelectButton v-model="info.toilet.mode" :options="MODES" optionLabel="label" optionValue="value" />
        </div>
        <div class="el-grid">
          <div class="el-field">
            <label for="el-toilet-how">{{ $t("elm.how") }}</label>
            <InputText id="el-toilet-how" v-model="info.toilet.how" />
          </div>
          <div class="el-field">
            <label for="el-toilet-notes">{{ $t("elm.other_notes") }}</label>
            <InputText id="el-toilet-notes" v-model="info.toilet.notes" />
          </div>
        </div>
      </section>

      <!-- Behaviour problems -->
      <section class="el-card">
        <h2 class="el-title">{{ $t("elm.behaviors") }}</h2>
        <div v-for="(line, i) in info.behaviors" :key="'b' + i" class="el-line">
          <span class="el-line-num">{{ i + 1 }}.</span>
          <InputText v-model="info.behaviors[i]" :aria-label="`${$t('elm.behaviors')} ${i + 1}`" />
          <Button icon="pi pi-times" severity="secondary" variant="text" rounded :aria-label="$t('delete')" @click="removeLine(info.behaviors, i)" />
        </div>
        <Button class="el-add" icon="pi pi-plus" :label="$t('elm.add_line')" size="small" variant="outlined" @click="addLine(info.behaviors)" />
        <fieldset class="el-source">
          <legend>{{ $t("elm.source") }}</legend>
          <div class="el-grid">
            <div class="el-field">
              <label for="el-beh-direct">{{ $t("elm.source_direct") }}</label>
              <InputText id="el-beh-direct" v-model="info.behaviors_source.direct" :placeholder="$t('elm.source_direct_hint')" />
            </div>
            <div class="el-field">
              <label>{{ $t("elm.source_indirect") }}</label>
              <div class="el-checks">
                <label v-for="who in SOURCES" :key="who" class="el-check">
                  <Checkbox v-model="info.behaviors_source.indirect" :value="who" /> {{ $t(`elm.source_${who}`) }}
                </label>
                <InputText v-if="info.behaviors_source.indirect.includes('other')" v-model="info.behaviors_source.other" :placeholder="$t('elm.source_other_hint')"
                  :aria-label="$t('elm.source_other')" />
              </div>
            </div>
          </div>
        </fieldset>
        <div class="el-field el-space">
          <label for="el-notes">{{ $t("elm.other_notes") }}</label>
          <Textarea id="el-notes" v-model="notes" rows="3" autoResize />
        </div>
        <div class="el-field">
          <label for="el-rec">{{ $t("elm.recommendations") }}</label>
          <Textarea id="el-rec" v-model="info.recommendations" rows="3" autoResize />
        </div>
      </section>

      <!-- The save button first: the dashboard assistant's floating button sits at the other end. -->
      <footer class="el-footer">
        <Button :label="editing ? $t('mae_save') : $t('elm.save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
        <span class="el-total">{{ $t("elm.answered") }}: <b class="ltr">{{ answeredCount }}/{{ itemCount }}</b></span>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.el-page { display: grid; gap: 1rem; }
.el-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, rgb(var(--bp-135c65))) 0%, rgb(var(--bp-1b7c86)) 100%); color: #fff; }
.el-hero-main { display: flex; align-items: center; gap: 1rem; }
.el-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.el-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.el-hero p { margin: .2rem 0 0; opacity: .85; }
.el-hero-progress { display: grid; justify-items: end; }
.el-hero-progress b { font-size: 1.4rem; }
.el-state { display: grid; place-items: center; padding: 3rem; }
.el-card { display: grid; gap: .9rem; padding: 1.1rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.el-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: 1rem; }
.el-field { display: grid; gap: .4rem; align-content: start; }
.el-field > label { font-weight: 700; }
.el-hint { font-weight: 400; color: var(--sawa-muted, #64748b); }
.el-age { margin: 0; padding: .55rem 0; font-weight: 700; }
.el-colors { display: flex; gap: .4rem; padding: .3rem 0; }
.el-color { width: 2rem; height: 2rem; border: 2px solid #fff; border-radius: 8px; box-shadow: 0 0 0 1px #cbd5e1; cursor: pointer; }
.el-color.is-picked { box-shadow: 0 0 0 3px #0f172a; }
.el-instructions { margin: 0; padding: .6rem .8rem; border-radius: 10px; background: #f1f5f9; color: #475569; font-size: .9rem; line-height: 1.7; }
.el-section-head { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.el-section-head h2 { margin: 0; font-size: 1.1rem; font-weight: 800; }
.el-code { display: grid; place-items: center; min-width: 3rem; height: 2.2rem; padding: 0 .5rem; border-radius: 10px; background: var(--sawa-primary, rgb(var(--bp-135c65))); color: #fff; font-weight: 800; }
.el-section-score { display: flex; gap: 1rem; margin-inline-start: auto; color: #475569; font-size: .9rem; }
.el-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr)); gap: 1rem; }
.el-table { width: 100%; border-collapse: collapse; }
.el-table th { padding: .45rem .5rem; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: .85rem; text-align: center; }
.el-table th:first-child { text-align: start; }
.el-table td { padding: .35rem .5rem; border-bottom: 1px solid #f1f5f9; }
.el-item { font-weight: 600; }
.el-signs { text-align: center; white-space: nowrap; }
.el-signs > div { display: inline-flex; gap: .3rem; }
.el-sign { width: 2.3rem; height: 2.1rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 8px; background: #fff; font: inherit; font-size: 1.15rem; font-weight: 800; cursor: pointer; }
.el-sign:hover { border-color: #94a3b8; }
.el-sign:focus-visible { outline: 2px solid var(--sawa-primary, rgb(var(--bp-135c65))); outline-offset: 2px; }
.el-sign.is-plus.is-picked { border-color: #16a34a; background: #16a34a; color: #fff; }
.el-sign.is-minus.is-picked { border-color: #dc2626; background: #dc2626; color: #fff; }
.el-title { margin: 0; font-size: 1.1rem; font-weight: 800; }
.el-space { margin-top: .5rem; }
.el-line { display: flex; align-items: center; gap: .4rem; }
.el-line :deep(.p-inputtext) { flex: 1; }
.el-line-num { min-width: 1.5rem; font-weight: 700; color: #64748b; }
.el-add { justify-self: start; }
.el-source { margin: 0; padding: .75rem 1rem; border: 1px dashed #cbd5e1; border-radius: 12px; }
.el-source legend { padding: 0 .4rem; font-weight: 700; }
.el-checks { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem 1rem; }
.el-check { display: inline-flex; align-items: center; gap: .35rem; font-weight: 400; }
.el-footer { position: sticky; bottom: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; box-shadow: 0 -6px 20px -12px rgba(15, 23, 42, .25); }
.el-total { font-weight: 600; }
</style>
