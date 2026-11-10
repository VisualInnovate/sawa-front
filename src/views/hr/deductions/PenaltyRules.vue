<script setup>
// «قواعد الخصومات والعقوبات»: each violation (late, early leave, absence — recorded by attendance — or one HR records by
// hand) with its steps by repeat: the first time, the second… Each step is a deduction (how it is calculated) or another
// action (a text). A violation becomes a pending row on the deductions page; its step is fixed when HR confirms it.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import Deduction from "@/components/hr/Deduction.vue";
import { can } from "@/utils/permissions";

const { t } = useI18n();
const toast = useToast();
const rules = ref([]);
const types = ref([]);
const loading = ref(true);
const saving = ref(false);
const form = ref(null); // the rule being added or changed
const errors = ref({});

const TRIGGERS = ["late", "early_leave", "absence", "manual"];
const PERIODS = ["month", "quarter", "year", "never"];
const METHODS = ["fixed", "actual_hours", "hours", "days", "day_percent"];
const triggerOptions = computed(() => TRIGGERS.map((value) => ({ value, label: t(`pen.trigger_${value}`) })));
const periodOptions = computed(() => PERIODS.map((value) => ({ value, label: t(`pen.period_${value}`) })));
const kindOptions = computed(() => ["deduction", "action"].map((value) => ({ value, label: t(`pen.kind_${value}`) })));
// The violation's own time is known for a delay, an early leave, or a manual violation HR gives hours to.
const methodOptions = computed(() => METHODS.filter((value) => value !== "actual_hours" || form.value?.trigger !== "absence")
  .map((value) => ({ value, label: t(`pen.method_${value}`) })));
const TRIGGER_ICONS = { late: "pi pi-clock", early_leave: "pi pi-sign-out", absence: "pi pi-user-minus", manual: "pi pi-pencil" };

async function load() {
  loading.value = true;
  try {
    const [rulesRes, typesRes] = await Promise.all([axios.get("api/penalty-rules"), axios.get("api/deduction-types").catch(() => ({ data: { data: [] } }))]);
    rules.value = rulesRes.data.data;
    types.value = typesRes.data.data ?? [];
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const newStep = () => ({ kind: "deduction", method: "fixed", value: null, action_text: "" });
function open(rule = null) {
  errors.value = {};
  form.value = rule
    ? { id: rule.id, title: rule.title, trigger: rule.trigger, period: rule.period, active: rule.active, deduction_type_id: rule.deduction_type_id,
        steps: rule.steps.map((step) => ({ kind: step.kind, method: step.method ?? "fixed", value: step.value, action_text: step.action_text ?? "" })) }
    : { id: null, title: "", trigger: "manual", period: "month", active: true, deduction_type_id: null, steps: [{ kind: "action", method: "fixed", value: null, action_text: "" }] };
}
// An automatic violation has one rule: its trigger cannot be picked again for another.
const triggerTaken = (value) => value !== "manual" && rules.value.some((rule) => rule.trigger === value && rule.id !== form.value?.id);
function moveStep(i, dir) {
  const j = i + dir;
  const steps = form.value.steps;
  if (j < 0 || j >= steps.length) return;
  [steps[i], steps[j]] = [steps[j], steps[i]];
}

// «خصم 5 د.أ» / «0.5 يوم × أجر اليوم» / «تحذير شفوي».
function stepText(step) {
  if (step.kind === "action") return step.action_text || t("pen.kind_action");
  const value = step.value ?? "";
  return t(`pen.summary_${step.method}`, { value });
}
const repeatLabel = (i, total) => (i === total - 1 && total > 1 ? t("pen.repeat_last", { n: i + 1 }) : t("pen.repeat_n", { n: i + 1 }));

async function save() {
  if (saving.value) return;
  saving.value = true;
  errors.value = {};
  const body = { ...form.value, steps: form.value.steps.map((step) => ({ kind: step.kind, method: step.kind === "deduction" ? step.method : null,
    value: step.kind === "deduction" && step.method !== "actual_hours" ? step.value : null, action_text: step.kind === "action" ? step.action_text : null })) };
  try {
    if (form.value.id) await axios.put(`api/penalty-rules/${form.value.id}`, body);
    else await axios.post("api/penalty-rules", body);
    toast.add({ severity: "success", summary: t("success_message"), detail: t("pen.saved"), life: 2500 });
    form.value = null;
    await load();
  } catch (e) {
    errors.value = e.response?.data?.errors ?? {};
    toast.add({ severity: "error", summary: t("error"), detail: Object.values(errors.value)[0]?.[0] ?? e.response?.data?.message ?? t("request_failed_retry"), life: 4500 });
  } finally {
    saving.value = false;
  }
}

async function toggle(rule) {
  try {
    await axios.put(`api/penalty-rules/${rule.id}`, { ...rule, active: !rule.active });
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("request_failed_retry"), life: 4000 });
  }
}

async function remove(rule) {
  if (!window.confirm(t(rule.trigger === "manual" ? "pen.delete_confirm" : "pen.delete_confirm_auto", { title: rule.title }))) return;
  try {
    await axios.delete(`api/penalty-rules/${rule.id}`);
    await load();
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message ?? t("request_failed_retry"), life: 4000 });
  }
}
</script>

<template>
  <div class="pen-page">
    <Toast />
    <Deduction />
    <header class="pen-head sawa-card">
      <div class="pen-title">
        <span class="pen-icon"><i class="pi pi-sliders-h" aria-hidden="true" /></span>
        <div>
          <h1>{{ $t("pen.title") }}</h1>
          <p>{{ $t("pen.subtitle") }}</p>
        </div>
      </div>
      <Button v-if="can('deduction rules create')" icon="pi pi-plus" :label="$t('pen.add')" @click="open()" />
    </header>

    <p class="pen-note sawa-card"><i class="pi pi-info-circle" aria-hidden="true" /> {{ $t("pen.how") }}</p>

    <p v-if="loading" class="pen-empty sawa-card"><i class="pi pi-spin pi-spinner" aria-hidden="true" /></p>
    <p v-else-if="!rules.length" class="pen-empty sawa-card">{{ $t("pen.empty") }}</p>
    <div v-else class="pen-grid">
      <article v-for="rule in rules" :key="rule.id" class="pen-card sawa-card" :class="{ 'is-off': !rule.active }">
        <div class="pen-card-head">
          <span class="pen-card-icon"><i :class="TRIGGER_ICONS[rule.trigger]" aria-hidden="true" /></span>
          <div class="min-w-0">
            <h2>{{ rule.title }}</h2>
            <small>{{ $t(`pen.trigger_${rule.trigger}`) }} · {{ $t("pen.counted") }} {{ $t(`pen.period_${rule.period}`) }}</small>
          </div>
          <Tag :severity="rule.active ? 'success' : 'secondary'" :value="rule.active ? $t('pen.on') : $t('pen.off')" class="ms-auto" />
        </div>
        <ol class="pen-steps">
          <li v-for="(step, i) in rule.steps" :key="i" :class="`is-${step.kind}`">
            <span class="pen-step-n">{{ repeatLabel(i, rule.steps.length) }}</span>
            <i :class="step.kind === 'action' ? 'pi pi-megaphone' : 'pi pi-minus-circle'" aria-hidden="true" />
            <span class="pen-step-text">{{ stepText(step) }}</span>
          </li>
        </ol>
        <footer class="pen-card-foot">
          <small v-if="rule.used">{{ $t("pen.used", { n: rule.used }) }}</small>
          <span class="ms-auto pen-actions">
            <Button v-if="can('deduction rules edit')" size="small" text :icon="rule.active ? 'pi pi-pause' : 'pi pi-play'" :label="rule.active ? $t('pen.stop') : $t('pen.start')" @click="toggle(rule)" />
            <Button v-if="can('deduction rules edit')" size="small" outlined icon="pi pi-pencil" :label="$t('edit')" @click="open(rule)" />
            <Button v-if="can('deduction rules delete')" size="small" text severity="danger" icon="pi pi-trash" :aria-label="$t('delete')" v-tooltip.top="$t('delete')" @click="remove(rule)" />
          </span>
        </footer>
      </article>
    </div>

    <Dialog :visible="!!form" modal :header="form?.id ? $t('pen.edit_title') : $t('pen.add')" :style="{ width: '46rem' }" :breakpoints="{ '820px': '96vw' }"
      @update:visible="(v) => { if (!v) form = null; }">
      <form v-if="form" class="pen-form" @submit.prevent="save">
        <div class="pen-row">
          <div class="pen-field">
            <label for="pen-title">{{ $t("pen.f_title") }}</label>
            <InputText id="pen-title" v-model="form.title" required :placeholder="$t('pen.f_title_ph')" :invalid="!!errors.title" />
          </div>
          <div class="pen-field">
            <label>{{ $t("pen.f_trigger") }}</label>
            <Select v-model="form.trigger" :options="triggerOptions" optionLabel="label" optionValue="value" :optionDisabled="(option) => triggerTaken(option.value)" :invalid="!!errors.trigger" />
            <small class="pen-hint">{{ $t(form.trigger === "manual" ? "pen.trigger_manual_hint" : "pen.trigger_auto_hint") }}</small>
          </div>
        </div>
        <div class="pen-row">
          <div class="pen-field">
            <label>{{ $t("pen.f_period") }}</label>
            <Select v-model="form.period" :options="periodOptions" optionLabel="label" optionValue="value" />
            <small class="pen-hint">{{ $t("pen.f_period_hint") }}</small>
          </div>
          <div class="pen-field">
            <label>{{ $t("pen.f_type") }}</label>
            <Select v-model="form.deduction_type_id" :options="types" optionLabel="title" optionValue="id" showClear filter :placeholder="$t('pen.f_type_ph')" />
          </div>
        </div>
        <label class="pen-switch"><ToggleSwitch v-model="form.active" /> {{ $t("pen.f_active") }}</label>

        <fieldset class="pen-steps-edit">
          <legend>{{ $t("pen.steps") }}</legend>
          <p class="pen-hint">{{ $t("pen.steps_hint") }}</p>
          <div v-for="(step, i) in form.steps" :key="i" class="pen-step-edit" :class="`is-${step.kind}`">
            <div class="pen-step-top">
              <b>{{ repeatLabel(i, form.steps.length) }}</b>
              <SelectButton v-model="step.kind" :options="kindOptions" optionLabel="label" optionValue="value" :allowEmpty="false" size="small" />
              <span class="ms-auto pen-actions">
                <Button type="button" icon="pi pi-chevron-up" text rounded size="small" severity="secondary" :disabled="i === 0" :aria-label="$t('ablls_ui.move_up')" @click="moveStep(i, -1)" />
                <Button type="button" icon="pi pi-chevron-down" text rounded size="small" severity="secondary" :disabled="i === form.steps.length - 1" :aria-label="$t('ablls_ui.move_down')" @click="moveStep(i, 1)" />
                <Button type="button" icon="pi pi-times" text rounded size="small" severity="danger" :disabled="form.steps.length === 1" :aria-label="$t('delete')" @click="form.steps.splice(i, 1)" />
              </span>
            </div>
            <div v-if="step.kind === 'deduction'" class="pen-row">
              <div class="pen-field">
                <label>{{ $t("pen.f_method") }}</label>
                <Select v-model="step.method" :options="methodOptions" optionLabel="label" optionValue="value" :invalid="!!errors[`steps.${i}.method`]" />
              </div>
              <div v-if="step.method !== 'actual_hours'" class="pen-field">
                <label>{{ $t(`pen.value_${step.method}`) }}</label>
                <InputNumber v-model="step.value" :min="0" :maxFractionDigits="2" :invalid="!!errors[`steps.${i}.value`]" fluid />
              </div>
              <p v-else class="pen-hint pen-field">{{ $t("pen.actual_hint") }}</p>
            </div>
            <div v-else class="pen-field">
              <label>{{ $t("pen.f_action") }}</label>
              <InputText v-model="step.action_text" :placeholder="$t('pen.f_action_ph')" :invalid="!!errors[`steps.${i}.action_text`]" />
            </div>
          </div>
          <Button type="button" icon="pi pi-plus" :label="$t('pen.add_step')" outlined size="small" :disabled="form.steps.length >= 30" @click="form.steps.push(newStep())" />
        </fieldset>

        <div class="pen-form-actions">
          <Button type="button" :label="$t('cancel')" text severity="secondary" @click="form = null" />
          <Button type="submit" icon="pi pi-check" :label="$t('save')" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<style scoped>
.pen-page { display: flex; flex-direction: column; gap: 1rem; }
.pen-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem; }
.pen-title { display: flex; align-items: center; gap: .85rem; }
.pen-title h1 { margin: 0; font-size: 1.3rem; font-weight: 700; color: rgb(var(--bp-135c65)); }
.pen-title p { margin: .15rem 0 0; color: #64748b; font-size: .9rem; }
.pen-icon, .pen-card-icon { display: grid; place-items: center; flex-shrink: 0; border-radius: .8rem; background: rgb(var(--bp-135c65) / .1); color: rgb(var(--bp-135c65)); }
.pen-icon { width: 3rem; height: 3rem; font-size: 1.3rem; }
.pen-card-icon { width: 2.4rem; height: 2.4rem; }
.pen-note { margin: 0; padding: .8rem 1.25rem; color: rgb(var(--bp-135c65)); font-size: .9rem; line-height: 1.7; }
.pen-empty { margin: 0; padding: 2.5rem 1rem; text-align: center; color: #64748b; }
.pen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr)); gap: 1rem; }
.pen-card { display: flex; flex-direction: column; gap: .85rem; padding: 1.1rem 1.25rem; }
.pen-card.is-off { opacity: .7; }
.pen-card-head { display: flex; align-items: center; gap: .7rem; }
.pen-card-head h2 { margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b; }
.pen-card-head small { color: #64748b; }
.pen-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .4rem; }
.pen-steps li { display: flex; align-items: center; gap: .5rem; padding: .45rem .65rem; border-radius: .6rem; background: #f8fafc; font-size: .92rem; }
.pen-steps li.is-deduction > .pi { color: #b91c1c; }
.pen-steps li.is-action > .pi { color: #b45309; }
.pen-step-n { flex-shrink: 0; min-width: 5.5rem; font-weight: 700; color: #475569; font-size: .82rem; }
.pen-step-text { min-width: 0; overflow-wrap: anywhere; }
.pen-card-foot { display: flex; align-items: center; gap: .5rem; margin-top: auto; color: #64748b; }
.pen-actions { display: inline-flex; align-items: center; gap: .25rem; }
.pen-form { display: flex; flex-direction: column; gap: 1rem; }
.pen-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); gap: .9rem; }
.pen-field { display: flex; flex-direction: column; gap: .35rem; min-width: 0; }
.pen-field label, .pen-steps-edit legend { font-size: .85rem; font-weight: 600; color: #334155; }
.pen-hint { margin: 0; color: #64748b; font-size: .8rem; line-height: 1.6; }
.pen-switch { display: inline-flex; align-items: center; gap: .6rem; font-weight: 600; color: #334155; }
.pen-steps-edit { display: flex; flex-direction: column; gap: .7rem; margin: 0; padding: .9rem; border: 1px solid #e2e8f0; border-radius: .8rem; }
.pen-steps-edit legend { padding: 0 .4rem; }
.pen-step-edit { display: flex; flex-direction: column; gap: .7rem; padding: .8rem; border-radius: .7rem; background: #f8fafc; border-inline-start: 3px solid #b91c1c; }
.pen-step-edit.is-action { border-inline-start-color: #b45309; }
.pen-step-top { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; }
.pen-form-actions { display: flex; justify-content: flex-end; gap: .5rem; }
@media (max-width: 640px) {
  .pen-head { padding: 1rem; }
  .pen-head :deep(.p-button) { width: 100%; }
  .pen-step-n { min-width: 4.5rem; }
}
</style>
