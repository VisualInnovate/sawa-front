<script setup>
// The Sensory Profile of one child (/sensory-evaluation/:id): the form for the child's age on the test day is chosen
// (infant 0–6 months, toddler 7–36 months, child 3–10 years; another can be picked), the caregiver's details are filled,
// then every item is rated 1 دائماً … 5 أبداً, or X when it was not observed / does not apply. Items sit in the form's
// sections with each section's running total and comments; an item the form asks to specify («اذكر») gets a field.
// Saving shows the result. ?edit=<evaluation id> opens a saved evaluation (before its approval) with its answers.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toDateOnly } from "@/utils/childAge";
import { childMonths } from "@/utils/ageRange";
import EditModeBanner from "@/components/evaluations/EditModeBanner.vue";
import { QUADRANT_COLOR, ageText, formName, itemText, optionLabel, quadrantsOfItem, scaleName, sectionLetter } from "./sensory";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const lang = computed(() => (locale.value === "en" ? "en" : "ar"));

const childId = computed(() => Number(route.params.id) || Number(localStorage.getItem("child_id")) || null);
const loading = ref(true);
const loadError = ref("");
const context = ref(null);
const saving = ref(false);
const showMissing = ref(false);
const alertText = ref("");
const date = ref(new Date());
const formId = ref(null);
const formPicked = ref(false); // the evaluator chose the form (else it follows the age)
// item id -> 1-5, or null (X); an item not in it is not answered yet.
const answers = ref({});
const itemNotes = ref({});
const info = ref({});
const notes = ref("");
const editing = ref(null);

const BIRTH_ORDERS = ["first", "second", "third", "fourth", "fifth", "other"];

const forms = computed(() => context.value?.forms ?? []);
const form = computed(() => forms.value.find((row) => row.id === formId.value) ?? null);
const child = computed(() => context.value?.child ?? null);
const options = computed(() => context.value?.options ?? []);
const items = computed(() => form.value?.items ?? []);
const sections = computed(() => (form.value?.scales ?? []).filter((scale) => scale.kind === "section").map((section) => ({
  ...section, items: items.value.filter((item) => item.section_id === section.id),
})));
const isAnswered = (item) => Object.prototype.hasOwnProperty.call(answers.value, item.id);
const answeredCount = computed(() => items.value.filter(isAnswered).length);
const subtotal = (section) => section.items.reduce((sum, item) => sum + (answers.value[item.id] ?? 0), 0);
const sectionDone = (section) => section.items.filter(isAnswered).length;
const quadrantName = (code) => scaleName((form.value?.scales ?? []).find((scale) => scale.code === code), lang.value);
const earlyForm = computed(() => ["infant", "toddler"].includes(form.value?.key));

const ageMonths = computed(() => (child.value?.birth_date && date.value ? childMonths(child.value.birth_date, date.value) : null));
const formForAge = computed(() => (ageMonths.value === null ? null : forms.value.find((row) =>
  (row.from_months == null || ageMonths.value >= row.from_months) && (row.to_months == null || ageMonths.value <= row.to_months)) ?? null));
const ageWarning = computed(() => form.value && ageMonths.value !== null && formForAge.value?.id !== form.value.id);

// The form follows the age on the test day until the evaluator picks one.
watch(formForAge, (value) => {
  if (!formPicked.value && !editing.value && value) formId.value = value.id;
});

function pickForm(id) {
  formPicked.value = true;
  formId.value = id;
  showMissing.value = false;
}

function answer(item, value) {
  answers.value = { ...answers.value, [item.id]: value };
}

async function load() {
  loading.value = true;
  loadError.value = "";
  showMissing.value = false;
  alertText.value = "";
  answers.value = {};
  itemNotes.value = {};
  info.value = { section_comments: {} };
  notes.value = "";
  date.value = new Date();
  editing.value = null;
  formPicked.value = false;
  try {
    if (route.query.edit) {
      const { data } = (await axios.get(`api/sensory-profile-answers/evaluation/${route.query.edit}/edit`)).data;
      context.value = data.context;
      editing.value = data.evaluation;
      formPicked.value = true;
      formId.value = data.form_id;
      date.value = data.evaluation.date ? new Date(data.evaluation.date) : new Date();
      answers.value = Object.fromEntries(Object.entries(data.answers ?? {}).map(([id, value]) => [Number(id), value === null ? null : Number(value)]));
      itemNotes.value = { ...(data.item_notes ?? {}) };
      info.value = { ...(data.info ?? {}), section_comments: { ...(data.info?.section_comments ?? {}) } };
      notes.value = data.notes ?? "";
      return;
    }
    context.value = (await axios.get(`api/sensory-profile-answers/context/${childId.value}`)).data;
    formId.value = formForAge.value?.id ?? context.value.suggested_form_id ?? context.value.forms?.[1]?.id ?? null;
  } catch (error) {
    loadError.value = error.response?.data?.message || t("request_failed_retry");
  } finally {
    loading.value = false;
  }
}

const payload = () => {
  const specify = new Set(items.value.filter((item) => item.specify).map((item) => item.id));
  return {
    form_id: formId.value,
    answers: items.value.map((item) => ({ item: item.id, value: answers.value[item.id] })),
    item_notes: Object.fromEntries(Object.entries(itemNotes.value).filter(([id, text]) => specify.has(Number(id)) && String(text ?? "").trim())),
    info: {
      ...info.value,
      premature_weeks: info.value.premature ? info.value.premature_weeks ?? null : null,
      section_comments: Object.fromEntries(sections.value.map((section) => [section.code, info.value.section_comments?.[section.code] ?? ""])
        .filter(([, text]) => String(text).trim())),
    },
    notes: notes.value.trim() || null,
  };
};

async function save() {
  const missing = items.value.find((item) => !isAnswered(item));
  if (missing) {
    showMissing.value = true;
    alertText.value = t("sensory.answer_all");
    document.getElementById("si-" + missing.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  saving.value = true;
  alertText.value = "";
  try {
    if (editing.value) {
      await axios.put(`api/sensory-profile-answers/evaluation/${editing.value.id}/edit`, payload());
      router.push({ name: "sensory-result", params: { id: child.value?.id ?? childId.value, evaluation: editing.value.id } });
      return;
    }
    const { data } = await axios.post("api/sensory-profile-answers", {
      child_id: childId.value,
      date: toDateOnly(date.value),
      request_id: route.query.requestId || null,
      ...payload(),
    });
    router.push({ name: "sensory-result", params: { id: childId.value, evaluation: data.evaluation_id } });
  } catch (error) {
    alertText.value = Object.values(error.response?.data?.errors ?? {}).flat().join(" ") || error.response?.data?.message || t("request_failed_retry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } finally {
    saving.value = false;
  }
}

onMounted(load);
watch(childId, (value, before) => {
  if (value && value !== before && route.name === "sensory-evaluation") load();
});
</script>

<template>
  <div class="sp-page">
    <header class="sp-hero">
      <div class="sp-hero-main">
        <span class="sp-hero-icon"><i class="pi pi-sun" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("sensory.title") }}</h1>
          <p v-if="child">{{ child.name }}<template v-if="form"> · {{ formName(form, lang) }}</template></p>
        </div>
      </div>
      <div v-if="form" class="sp-hero-progress">
        <b>{{ answeredCount }}/{{ items.length }}</b>
        <span>{{ $t("sensory.answered") }}</span>
      </div>
    </header>

    <div v-if="loading" class="sp-state"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <Message v-else-if="loadError" severity="error" :closable="false">{{ loadError }}</Message>

    <template v-else>
      <EditModeBanner v-if="editing" :status="editing.approval_status" :note="editing.approval_note" />
      <Message v-if="alertText" severity="error" :closable="false">{{ alertText }}</Message>

      <section class="sp-card">
        <div class="sp-grid">
          <div class="sp-field">
            <label for="sp-date">{{ $t("sensory.test_date") }}</label>
            <DatePicker v-model="date" inputId="sp-date" showIcon fluid :disabled="Boolean(editing)" />
          </div>
          <div class="sp-field">
            <label>{{ $t("sensory.child_age") }}</label>
            <p class="sp-age">{{ ageMonths === null ? "—" : ageText(ageMonths, $t) }}</p>
          </div>
          <div class="sp-field">
            <label for="sp-respondent">{{ $t("sensory.respondent") }}</label>
            <InputText id="sp-respondent" v-model="info.respondent" />
          </div>
          <div class="sp-field">
            <label for="sp-relationship">{{ $t("sensory.relationship") }}</label>
            <InputText id="sp-relationship" v-model="info.relationship" :placeholder="$t('sensory.relationship_placeholder')" />
          </div>
        </div>

        <div class="sp-forms">
          <span class="sp-forms-label">{{ $t("sensory.form") }}</span>
          <button v-for="row in forms" :key="row.id" type="button" class="sp-form-btn" :class="{ 'is-picked': row.id === formId }"
            :aria-pressed="row.id === formId" @click="pickForm(row.id)">
            {{ formName(row, lang) }}
            <small>{{ $t("sensory.items_count", { n: row.items.length }) }}</small>
          </button>
        </div>
        <Message v-if="ageWarning" severity="warn" :closable="false" class="mt-3">
          {{ $t("sensory.form_age_warning", { age: ageText(ageMonths, $t), form: formForAge ? formName(formForAge, lang) : "—" }) }}
        </Message>

        <div v-if="earlyForm" class="sp-grid sp-birth">
          <div class="sp-field sp-check">
            <Checkbox v-model="info.premature" inputId="sp-premature" binary />
            <label for="sp-premature">{{ $t("sensory.premature") }}</label>
            <InputNumber v-if="info.premature" v-model="info.premature_weeks" :min="0" :max="30" :placeholder="$t('sensory.weeks')"
              inputClass="sp-weeks" :aria-label="$t('sensory.weeks')" />
          </div>
          <div class="sp-field">
            <label for="sp-order">{{ $t("sensory.birth_order") }}</label>
            <Select v-model="info.birth_order" inputId="sp-order" :options="BIRTH_ORDERS" :optionLabel="(key) => $t('sensory.order_' + key)" showClear fluid />
          </div>
          <div class="sp-field sp-check sp-wide">
            <Checkbox v-model="info.many_children" inputId="sp-many" binary />
            <label for="sp-many">{{ $t("sensory.many_children") }}</label>
          </div>
        </div>

        <p v-if="form?.instructions" class="sp-instructions"><i class="pi pi-info-circle" aria-hidden="true" /> {{ form.instructions }}</p>
        <div class="sp-key" :aria-label="$t('sensory.scale_key')">
          <span v-for="option in options" :key="option.value"><b class="ltr">{{ option.value }}</b> {{ optionLabel(option, lang) }}</span>
          <span><b>X</b> {{ $t("sensory.x_label") }}</span>
        </div>
      </section>

      <template v-for="(section, index) in sections" :key="section.id">
        <h2 v-if="section.group_name && section.group_name !== sections[index - 1]?.group_name" class="sp-group">{{ section.group_name }}</h2>
        <section class="sp-card sp-section">
          <header class="sp-section-head">
            <h3>{{ sectionLetter(section.code, lang) }}. {{ scaleName(section, lang) }}</h3>
            <span class="sp-subtotal">
              {{ $t("sensory.subtotal") }}: <b class="ltr">{{ subtotal(section) }}</b>
              <small>({{ sectionDone(section) }}/{{ section.items.length }})</small>
            </span>
          </header>

          <div v-for="item in section.items" :id="'si-' + item.id" :key="item.id" class="sp-item"
            :class="{ 'is-missing': showMissing && !isAnswered(item) }">
            <span class="sp-num" :class="{ 'is-done': isAnswered(item) }">{{ item.number }}</span>
            <div class="sp-item-text">
              <p>{{ itemText(item, lang) }}</p>
              <div class="sp-tags">
                <span v-for="code in quadrantsOfItem(form, item.id)" :key="code" class="sp-tag" :style="{ '--q': QUADRANT_COLOR[code] }">{{ quadrantName(code) }}</span>
                <span v-if="item.threshold" class="sp-tag is-threshold" :title="$t('sensory.threshold_' + item.threshold)">{{ item.threshold }}</span>
              </div>
              <InputText v-if="item.specify" v-model="itemNotes[item.id]" class="sp-specify" :placeholder="$t('sensory.specify')" :aria-label="$t('sensory.specify')" />
            </div>
            <div class="sp-choices" role="radiogroup" :aria-label="itemText(item, lang)">
              <button v-for="option in options" :key="option.value" type="button" role="radio" class="sp-choice"
                :class="{ 'is-picked': isAnswered(item) && answers[item.id] === option.value }"
                :aria-checked="isAnswered(item) && answers[item.id] === option.value" :title="optionLabel(option, lang)" @click="answer(item, option.value)">
                <b class="ltr">{{ option.value }}</b><span>{{ optionLabel(option, lang) }}</span>
              </button>
              <button type="button" role="radio" class="sp-choice is-x" :class="{ 'is-picked': isAnswered(item) && answers[item.id] === null }"
                :aria-checked="isAnswered(item) && answers[item.id] === null" :title="$t('sensory.x_label')" @click="answer(item, null)">
                <b>X</b>
              </button>
            </div>
          </div>

          <div class="sp-field sp-comments">
            <label :for="'sp-c-' + section.code">{{ $t("sensory.section_comments") }}</label>
            <Textarea :id="'sp-c-' + section.code" v-model="info.section_comments[section.code]" rows="1" autoResize />
          </div>
        </section>
      </template>

      <section class="sp-card sp-grid">
        <div class="sp-field">
          <label for="sp-strengths">{{ $t("sensory.strengths") }}</label>
          <Textarea id="sp-strengths" v-model="info.strengths" rows="2" autoResize />
        </div>
        <div class="sp-field">
          <label for="sp-concerns">{{ $t("sensory.concerns") }}</label>
          <Textarea id="sp-concerns" v-model="info.concerns" rows="2" autoResize />
        </div>
        <div class="sp-field sp-wide">
          <label for="sp-notes">{{ $t("sensory.notes") }}</label>
          <Textarea id="sp-notes" v-model="notes" rows="2" autoResize />
        </div>
      </section>

      <!-- The button sits at the start: the end corner is the dashboard assistant's floating button. -->
      <footer class="sp-footer">
        <Button :label="editing ? $t('mae_save') : $t('sensory.save')" icon="pi pi-check" :loading="saving" data-no-request-spinner @click="save" />
        <span class="sp-footer-count">{{ answeredCount }}/{{ items.length }} {{ $t("sensory.answered") }}</span>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.sp-page { display: grid; gap: 1rem; }
.sp-hero { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: var(--sawa-radius, 16px); background: linear-gradient(135deg, var(--sawa-primary, rgb(var(--bp-135c65))) 0%, rgb(var(--bp-1b7c86)) 100%); color: #fff; }
.sp-hero-main { display: flex; align-items: center; gap: 1rem; }
.sp-hero-icon { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 14px; background: rgba(255, 255, 255, .15); font-size: 1.4rem; }
.sp-hero h1 { margin: 0; font-size: 1.35rem; font-weight: 800; }
.sp-hero p { margin: .2rem 0 0; opacity: .85; }
.sp-hero-progress { display: grid; justify-items: end; }
.sp-hero-progress b { font-size: 1.4rem; }
.sp-state { display: grid; place-items: center; padding: 3rem; }
.sp-card { padding: 1.1rem 1.25rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 16px; background: #fff; }
.sp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr)); gap: 1rem; }
.sp-field { display: grid; gap: .4rem; align-content: start; }
.sp-field label { font-weight: 700; }
.sp-wide { grid-column: 1 / -1; }
.sp-check { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.sp-check :deep(.sp-weeks) { width: 6rem; }
.sp-birth { margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; }
.sp-age { margin: 0; padding: .55rem 0; font-weight: 700; }
.sp-forms { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; margin-top: 1rem; }
.sp-forms-label { font-weight: 700; margin-inline-end: .25rem; }
.sp-form-btn { display: grid; gap: .1rem; padding: .5rem .9rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 12px; background: #fff; font: inherit; font-weight: 700; text-align: start; cursor: pointer; }
.sp-form-btn small { color: #64748b; font-weight: 500; }
.sp-form-btn.is-picked { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); background: #edf7f5; box-shadow: 0 0 0 1px var(--sawa-primary, rgb(var(--bp-135c65))); }
.sp-form-btn:focus-visible { outline: 2px solid var(--sawa-primary, rgb(var(--bp-135c65))); outline-offset: 2px; }
.sp-instructions { margin: 1rem 0 0; padding: .6rem .8rem; border-radius: 10px; background: #f1f5f9; color: #475569; font-size: .9rem; line-height: 1.7; }
.sp-key { display: flex; flex-wrap: wrap; gap: .4rem .9rem; margin-top: .75rem; color: #334155; font-size: .9rem; }
.sp-key b { display: inline-grid; place-items: center; min-width: 1.4rem; height: 1.4rem; margin-inline-end: .2rem; border-radius: 6px; background: #e2e8f0; }
.sp-group { margin: .5rem 0 0; font-size: 1.15rem; font-weight: 800; color: var(--sawa-primary, rgb(var(--bp-135c65))); }
.sp-section { display: grid; gap: .1rem; }
.sp-section-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .5rem; padding-bottom: .6rem; border-bottom: 2px solid #e2e8f0; }
.sp-section-head h3 { margin: 0; font-size: 1.05rem; font-weight: 800; }
.sp-subtotal { color: #475569; }
.sp-subtotal b { font-size: 1.1rem; color: #0f172a; }
.sp-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .5rem .9rem; padding: .65rem .25rem; border-bottom: 1px solid #f1f5f9; border-radius: 10px; }
.sp-item.is-missing { background: #fef2f2; box-shadow: inset 0 0 0 2px #fecaca; }
.sp-num { display: grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 10px; background: #edf7f5; color: var(--sawa-primary, rgb(var(--bp-135c65))); font-weight: 800; }
.sp-num.is-done { background: var(--sawa-primary, rgb(var(--bp-135c65))); color: #fff; }
.sp-item-text p { margin: 0; font-weight: 600; line-height: 1.7; }
.sp-tags { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .25rem; }
.sp-tag { padding: 0 .45rem; border-radius: 6px; background: color-mix(in srgb, var(--q) 12%, #fff); color: var(--q); font-size: .75rem; font-weight: 700; }
.sp-tag.is-threshold { --q: #475569; }
.sp-specify { margin-top: .4rem; width: 100%; max-width: 26rem; }
.sp-choices { display: flex; gap: .3rem; }
.sp-choice { display: grid; justify-items: center; min-width: 3.4rem; padding: .3rem .35rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 10px; background: #fff; font: inherit; cursor: pointer; line-height: 1.25; }
.sp-choice b { font-size: 1rem; }
.sp-choice span { font-size: .72rem; color: #64748b; }
.sp-choice:hover { border-color: #94a3b8; }
.sp-choice:focus-visible { outline: 2px solid var(--sawa-primary, rgb(var(--bp-135c65))); outline-offset: 2px; }
.sp-choice.is-picked { border-color: var(--sawa-primary, rgb(var(--bp-135c65))); background: var(--sawa-primary, rgb(var(--bp-135c65))); color: #fff; }
.sp-choice.is-picked span { color: #fff; }
.sp-choice.is-x { min-width: 2.6rem; align-content: center; }
.sp-choice.is-x.is-picked { border-color: #475569; background: #475569; }
.sp-comments { margin-top: .6rem; }
.sp-comments label { font-weight: 600; color: #475569; font-size: .9rem; }
.sp-footer { position: sticky; bottom: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; padding: .85rem 1.25rem; padding-inline-end: 5rem; border: 1px solid var(--sawa-border, #e2e8f0); border-radius: 14px; background: #fff; box-shadow: 0 -6px 20px -12px rgba(15, 23, 42, .25); }
.sp-footer-count { font-weight: 700; color: #475569; }
.ltr { direction: ltr; unicode-bidi: isolate; }
@media (max-width: 760px) {
  .sp-item { grid-template-columns: auto minmax(0, 1fr); }
  .sp-choices { grid-column: 1 / -1; }
  .sp-choice { flex: 1 1 0; min-width: 0; }
}
</style>
