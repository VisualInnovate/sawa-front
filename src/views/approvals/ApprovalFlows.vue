<script setup>
// «مسارات الموافقة»: each kind of transaction's stages — who approves (and who instead), the deadline and its kind,
// reminders, what a timeout does, where a rejection goes, skip rules. Saving makes a new version (running transactions
// keep theirs). The visual editor comes in phase 7; this is the stages' form. Also the academy's working hours.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const { t, locale } = useI18n();
const toast = useToast();
const ar = computed(() => locale.value === "ar");
const editable = computed(() => can("approval flows edit"));

const flows = ref([]);
const options = ref({ roles: [] });
const loading = ref(true);
const selectedKey = ref(null);
const stages = ref([]);
const note = ref("");
const saving = ref(false);
const errors = ref({});
const viewing = ref(null); // an older version shown read-only

const selected = computed(() => flows.value.find((f) => f.key === selectedKey.value));
const flowName = (f) => (ar.value ? f.name_ar : f.name_en || f.name_ar);

// Approver tokens as strings for the selects: «requester», «department_head», «role:technical_supervisor», «user:7».
const toValue = (token) =>
  token.type === "role" ? `role:${token.role}` : token.type === "user" ? `user:${token.user_id}` : token.type === "permission" ? `permission:${token.permission}` : token.type;
const toToken = (value) => {
  if (value.startsWith("role:")) return { type: "role", role: value.slice(5) };
  if (value.startsWith("permission:")) return { type: "permission", permission: value.slice(11) };
  if (value.startsWith("user:")) return { type: "user", user_id: Number(value.slice(5)) };
  return { type: value };
};
const tokenOptions = computed(() => [
  ...["requester", "department_head", "department_deputy", "direct_manager", "assignee"].map((type) => ({ value: type, label: t(`apf.who_${type}`), group: "dynamic" })),
  ...(options.value.permissions ?? []).map((p) => ({ value: `permission:${p.value}`, label: `${t("apf.who_permission", { name: ar.value ? p.ar : p.en })} (${t("apf.people", { n: p.people })})`,
    group: "role", empty: !p.people })),
  ...options.value.roles.map((r) => ({ value: `role:${r.value}`, label: `${ar.value ? r.ar : r.en} (${t("apf.people", { n: r.people })})`, group: "role", empty: !r.people })),
]);
const withUnknown = (values) => {
  const known = new Set(tokenOptions.value.map((o) => o.value));
  return [...tokenOptions.value, ...values.filter((v) => !known.has(v)).map((v) => ({ value: v, label: v }))];
};
const timeoutOptions = computed(() => ["none", "auto_approve", "escalate"].map((value) => ({ value, label: t(`apf.timeout_${value}`) })));
const rejectOptions = computed(() => ["previous", "first", "stage", "requester", "end"].map((value) => ({ value, label: t(`apf.reject_${value}`) })));
const kindOptions = computed(() => ["plain", "working"].map((value) => ({ value, label: t(`apf.kind_${value}`) })));
const skipRequesterOptions = computed(() => [{ value: null, label: t("apf.skip_none") }, { value: "skip", label: t("apf.skip_skip") }, { value: "direct_manager", label: t("apf.skip_direct_manager") }]);

function toForm(stage) {
  return {
    key: stage.key, name: stage.name,
    approvers: (stage.approvers ?? []).map(toValue), fallback: (stage.fallback ?? []).map(toValue), escalate_to: (stage.escalate_to ?? []).map(toValue),
    deadline_hours: stage.deadline_hours ?? null, deadline_kind: stage.deadline_kind ?? "plain", after_reject_hours: stage.after_reject_hours ?? null,
    remind_every_hours: stage.remind_every_hours ?? null, on_timeout: stage.on_timeout ?? "none", on_reject: stage.on_reject ?? "end",
    on_reject_stage: stage.on_reject_stage ?? null, reject_note_required: stage.reject_note_required ?? true,
    skip_requester: stage.skip_rules?.requester_is_approver ?? null, skip_approved_by_requester: stage.skip_rules?.approved_by_requester === "skip",
    skip_owner_head: stage.skip_rules?.owner_is_head === "skip",
    // Kept as it is (set by the system: a stage only some transactions need).
    only_if_meta: stage.skip_rules?.only_if_meta ?? null,
  };
}
function toBody(stage) {
  const skip = {};
  if (stage.skip_requester) skip.requester_is_approver = stage.skip_requester;
  if (stage.skip_approved_by_requester) skip.approved_by_requester = "skip";
  if (stage.skip_owner_head) skip.owner_is_head = "skip";
  if (stage.only_if_meta) skip.only_if_meta = stage.only_if_meta;
  return {
    key: stage.key, name: stage.name, approvers: stage.approvers.map(toToken), fallback: stage.fallback.map(toToken),
    escalate_to: stage.on_timeout === "escalate" ? stage.escalate_to.map(toToken) : [],
    deadline_hours: stage.deadline_hours || null, deadline_kind: stage.deadline_kind, after_reject_hours: stage.after_reject_hours || null,
    remind_every_hours: stage.remind_every_hours || null, on_timeout: stage.on_timeout, on_reject: stage.on_reject,
    on_reject_stage: stage.on_reject === "stage" ? stage.on_reject_stage : null, reject_note_required: stage.reject_note_required, skip_rules: skip,
  };
}

async function load() {
  loading.value = true;
  try {
    const { data } = await axios.get("api/approval-flows");
    flows.value = data.data;
    options.value = data.options;
    if (!selectedKey.value && flows.value.length) selectedKey.value = flows.value[0].key;
    pick(selectedKey.value);
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 4000 });
  } finally {
    loading.value = false;
  }
}

function pick(key) {
  selectedKey.value = key;
  viewing.value = null;
  errors.value = {};
  note.value = "";
  stages.value = (selected.value?.active_version?.stages ?? []).map(toForm);
}

async function viewVersion(version) {
  if (version.id === selected.value?.active_version?.id) {
    pick(selectedKey.value);
    return;
  }
  const { data } = await axios.get(`api/approval-flows/${selected.value.id}/versions/${version.id}`);
  viewing.value = data.data.version;
  stages.value = data.data.stages.map(toForm);
}

function addStage() {
  stages.value.push(toForm({ key: `stage${stages.value.length + 1}`, name: "", approvers: [], on_timeout: "none", on_reject: "end" }));
}
function move(index, by) {
  const list = [...stages.value];
  const [item] = list.splice(index, 1);
  list.splice(index + by, 0, item);
  stages.value = list;
}
const earlierKeys = (index) => stages.value.slice(0, index).map((s) => ({ value: s.key, label: s.name || s.key }));

// Warnings before saving (the server checks the same and refuses what cannot work).
const warnings = computed(() => {
  const list = [];
  stages.value.forEach((s, i) => {
    const n = s.name || `#${i + 1}`;
    if (!s.approvers.length) list.push(t("apf.warn_no_approver", { n }));
    if (!s.fallback.length) list.push(t("apf.warn_no_fallback", { n }));
    const empty = s.approvers.filter((v) => tokenOptions.value.find((o) => o.value === v)?.empty);
    if (empty.length && empty.length === s.approvers.length) list.push(t("apf.warn_nobody", { n }));
    if (s.on_timeout !== "none" && !s.deadline_hours) list.push(t("apf.warn_timeout_no_deadline", { n }));
    if (s.deadline_hours && s.on_timeout === "none" && !s.remind_every_hours) list.push(t("apf.warn_deadline_no_action", { n }));
    if (i === 0 && s.on_reject === "previous") list.push(t("apf.warn_first_previous", { n }));
  });
  return list;
});

async function save() {
  saving.value = true;
  errors.value = {};
  try {
    await axios.post(`api/approval-flows/${selected.value.id}/versions`, { stages: stages.value.map(toBody), note: note.value || null });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("apf.version_saved"), life: 3000 });
    await load();
  } catch (e) {
    errors.value = e.response?.data?.errors ?? {};
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    saving.value = false;
  }
}
const errorOf = (i, field) => {
  const key = Object.keys(errors.value).find((k) => k === `stages.${i}.${field}` || k.startsWith(`stages.${i}.${field}.`));
  return key ? [errors.value[key]].flat()[0] : null;
};

// Working hours (deadlines counted in working hours).
const days = ref([]);
const savingHours = ref(false);
const dayNames = computed(() => (ar.value
  ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
  : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]));
async function loadHours() {
  const { data } = await axios.get("api/org-working-hours");
  const byDay = Object.fromEntries(data.data.map((d) => [d.day, d]));
  days.value = [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, on: !!byDay[day], start: byDay[day]?.start ?? "08:00", end: byDay[day]?.end ?? "16:00" }));
}
async function saveHours() {
  savingHours.value = true;
  try {
    await axios.put("api/org-working-hours", { days: days.value.filter((d) => d.on).map(({ day, start, end }) => ({ day, start, end })) });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("apf.hours_saved"), life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(e), life: 5000 });
  } finally {
    savingHours.value = false;
  }
}

onMounted(() => {
  load();
  loadHours();
});
</script>

<template>
  <div class="sawa-card p-3 flex flex-column gap-3">
    <Toast />
    <div>
      <p class="text-xl text-bp-135c65 font-bold m-0">{{ $t("apf.flows_title") }}</p>
      <small class="text-color-secondary">{{ $t("apf.flows_hint") }}</small>
    </div>

    <div v-if="loading" class="py-4 text-center"><ProgressSpinner style="width: 40px; height: 40px" /></div>
    <div v-else class="apf-layout">
      <!-- Flows -->
      <nav class="apf-flows" :aria-label="$t('apf.flows_title')">
        <button v-for="f in flows" :key="f.key" type="button" class="apf-flow" :class="{ active: f.key === selectedKey }" @click="pick(f.key)">
          <span>{{ flowName(f) }}</span>
          <small>{{ $t("apf.version_n", { n: f.active_version?.version ?? "—" }) }}<template v-if="f.running"> · {{ $t("apf.running_n", { n: f.running }) }}</template></small>
        </button>
      </nav>

      <!-- Stages -->
      <section v-if="selected" class="flex flex-column gap-3 min-w-0">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="font-bold text-lg m-0">{{ flowName(selected) }}</p>
          <div class="flex items-center gap-2">
            <label for="apf-version" class="text-sm">{{ $t("apf.versions") }}</label>
            <Select inputId="apf-version" :modelValue="viewing ?? selected.active_version?.version" :options="selected.versions" optionValue="version"
              :optionLabel="(v) => `${$t('apf.version_n', { n: v.version })} · ${v.created_at}${v.by ? ' · ' + v.by : ''}`"
              @update:modelValue="(n) => viewVersion(selected.versions.find((v) => v.version === n))" class="w-18rem" />
          </div>
        </div>
        <Message v-if="viewing" severity="info" :closable="false">{{ $t("apf.viewing_old", { n: viewing }) }}</Message>

        <div v-for="(s, i) in stages" :key="i" class="apf-stage">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <b>{{ $t("apf.stage_n", { n: i + 1 }) }}</b>
            <div v-if="editable && !viewing" class="flex gap-1">
              <Button icon="pi pi-arrow-up" variant="text" size="small" :disabled="i === 0" @click="move(i, -1)" :aria-label="$t('apf.move_up')" />
              <Button icon="pi pi-arrow-down" variant="text" size="small" :disabled="i === stages.length - 1" @click="move(i, 1)" :aria-label="$t('apf.move_down')" />
              <Button icon="pi pi-trash" variant="text" size="small" severity="danger" :disabled="stages.length === 1" @click="stages.splice(i, 1)" :aria-label="$t('delete')" />
            </div>
          </div>
          <fieldset :disabled="!editable || !!viewing" class="apf-grid">
            <div class="field">
              <label :for="`n-${i}`">{{ $t("apf.stage_name") }}</label>
              <InputText :id="`n-${i}`" v-model="s.name" :invalid="!!errorOf(i, 'name')" />
            </div>
            <div class="field">
              <label :for="`k-${i}`">{{ $t("apf.stage_key") }}</label>
              <InputText :id="`k-${i}`" v-model="s.key" dir="ltr" :invalid="!!errorOf(i, 'key')" />
            </div>
            <div class="field wide">
              <label :for="`a-${i}`">{{ $t("apf.approvers") }}</label>
              <MultiSelect :inputId="`a-${i}`" v-model="s.approvers" :options="withUnknown(s.approvers)" optionLabel="label" optionValue="value" filter display="chip"
                :invalid="!!errorOf(i, 'approvers')" />
              <small v-if="errorOf(i, 'approvers')" class="text-red-600">{{ errorOf(i, "approvers") }}</small>
            </div>
            <div class="field wide">
              <label :for="`f-${i}`">{{ $t("apf.fallback") }}</label>
              <MultiSelect :inputId="`f-${i}`" v-model="s.fallback" :options="withUnknown(s.fallback)" optionLabel="label" optionValue="value" filter display="chip" />
            </div>
            <div class="field">
              <label :for="`d-${i}`">{{ $t("apf.deadline_hours") }}</label>
              <InputNumber :inputId="`d-${i}`" v-model="s.deadline_hours" :min="0" :maxFractionDigits="2" :placeholder="$t('apf.no_deadline')" :invalid="!!errorOf(i, 'deadline_hours')" />
              <small v-if="errorOf(i, 'deadline_hours')" class="text-red-600">{{ errorOf(i, "deadline_hours") }}</small>
            </div>
            <div class="field">
              <label>{{ $t("apf.deadline_kind") }}</label>
              <SelectButton v-model="s.deadline_kind" :options="kindOptions" optionLabel="label" optionValue="value" :allowEmpty="false" />
            </div>
            <div class="field">
              <label :for="`r-${i}`">{{ $t("apf.after_reject_hours") }}</label>
              <InputNumber :inputId="`r-${i}`" v-model="s.after_reject_hours" :min="0" :maxFractionDigits="2" />
            </div>
            <div class="field">
              <label :for="`m-${i}`">{{ $t("apf.remind_every") }}</label>
              <InputNumber :inputId="`m-${i}`" v-model="s.remind_every_hours" :min="0" :maxFractionDigits="2" />
            </div>
            <div class="field">
              <label :for="`t-${i}`">{{ $t("apf.on_timeout") }}</label>
              <Select :inputId="`t-${i}`" v-model="s.on_timeout" :options="timeoutOptions" optionLabel="label" optionValue="value" :invalid="!!errorOf(i, 'on_timeout')" />
              <small v-if="errorOf(i, 'on_timeout')" class="text-red-600">{{ errorOf(i, "on_timeout") }}</small>
            </div>
            <div v-if="s.on_timeout === 'escalate'" class="field">
              <label :for="`e-${i}`">{{ $t("apf.escalate_to") }}</label>
              <MultiSelect :inputId="`e-${i}`" v-model="s.escalate_to" :options="withUnknown(s.escalate_to)" optionLabel="label" optionValue="value" filter display="chip"
                :placeholder="$t('apf.who_direct_manager')" />
            </div>
            <div class="field">
              <label :for="`j-${i}`">{{ $t("apf.on_reject") }}</label>
              <Select :inputId="`j-${i}`" v-model="s.on_reject" :options="rejectOptions" optionLabel="label" optionValue="value" :invalid="!!errorOf(i, 'on_reject')" />
            </div>
            <div v-if="s.on_reject === 'stage'" class="field">
              <label :for="`js-${i}`">{{ $t("apf.reject_to_stage") }}</label>
              <Select :inputId="`js-${i}`" v-model="s.on_reject_stage" :options="earlierKeys(i)" optionLabel="label" optionValue="value" :invalid="!!errorOf(i, 'on_reject_stage')" />
            </div>
            <div class="field">
              <label :for="`sr-${i}`">{{ $t("apf.skip_requester") }}</label>
              <Select :inputId="`sr-${i}`" v-model="s.skip_requester" :options="skipRequesterOptions" optionLabel="label" optionValue="value" />
            </div>
            <div class="field checks">
              <label class="flex items-center gap-2"><Checkbox v-model="s.skip_approved_by_requester" binary />{{ $t("apf.skip_approved_by_requester") }}</label>
              <label class="flex items-center gap-2"><Checkbox v-model="s.skip_owner_head" binary />{{ $t("apf.skip_owner_head") }}</label>
              <label class="flex items-center gap-2"><Checkbox v-model="s.reject_note_required" binary />{{ $t("apf.reject_note_required") }}</label>
            </div>
          </fieldset>
        </div>

        <template v-if="editable && !viewing">
          <Button icon="pi pi-plus" :label="$t('apf.add_stage')" variant="outlined" class="self-start" @click="addStage" />
          <Message v-if="warnings.length" severity="warn" :closable="false">
            <ul class="m-0 ps-3"><li v-for="w in warnings" :key="w">{{ w }}</li></ul>
          </Message>
          <small v-if="errors.stages" class="text-red-600">{{ [errors.stages].flat()[0] }}</small>
          <div class="flex flex-wrap items-end gap-2">
            <div class="flex flex-column gap-1 flex-1">
              <label for="apf-note">{{ $t("apf.version_note") }}</label>
              <InputText id="apf-note" v-model="note" />
            </div>
            <Button :label="$t('apf.save_version')" icon="pi pi-check" :loading="saving" @click="save" />
          </div>
          <small class="text-color-secondary">{{ $t("apf.save_hint") }}</small>
        </template>
      </section>
    </div>

    <!-- Working hours -->
    <section class="apf-hours">
      <p class="font-bold text-lg m-0">{{ $t("apf.hours_title") }}</p>
      <small class="text-color-secondary block mb-2">{{ $t("apf.hours_hint") }}</small>
      <div class="flex flex-column gap-2">
        <div v-for="d in days" :key="d.day" class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-2 w-8rem"><Checkbox v-model="d.on" binary :disabled="!can('org working hours edit')" />{{ dayNames[d.day] }}</label>
          <template v-if="d.on">
            <InputText v-model="d.start" type="time" class="w-8rem" :disabled="!can('org working hours edit')" :aria-label="$t('apf.from_time')" />
            <span>→</span>
            <InputText v-model="d.end" type="time" class="w-8rem" :disabled="!can('org working hours edit')" :aria-label="$t('apf.to_time')" />
          </template>
          <small v-else class="text-color-secondary">{{ $t("apf.day_off") }}</small>
        </div>
      </div>
      <Button v-if="can('org working hours edit')" :label="$t('save')" icon="pi pi-check" class="mt-2" :loading="savingHours" @click="saveHours" />
    </section>
  </div>
</template>

<style scoped>
.apf-layout {
  display: grid;
  grid-template-columns: 14rem minmax(0, 1fr);
  gap: 1rem;
}
.apf-flows {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.apf-flow {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  text-align: start;
  border: 1px solid rgb(var(--bp-b6dde0));
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  background: #fff;
  cursor: pointer;
}
.apf-flow small {
  color: #64748b;
}
.apf-flow.active {
  background: rgb(var(--bp-135c65));
  color: #fff;
  border-color: rgb(var(--bp-135c65));
}
.apf-flow.active small {
  color: #e2e8f0;
}
.apf-flow:focus-visible {
  outline: 2px solid rgb(var(--bp-135c65));
  outline-offset: 2px;
}
.apf-stage {
  border: 1px solid rgb(var(--bp-b6dde0));
  background: rgb(var(--bp-f0f9fa));
  border-radius: 10px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.apf-grid {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.6rem;
}
.apf-grid .field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}
.apf-grid .field.wide {
  grid-column: 1 / -1;
}
.apf-grid .field.checks {
  justify-content: flex-end;
}
.apf-hours {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}
@media (max-width: 900px) {
  .apf-layout {
    grid-template-columns: 1fr;
  }
  /* The flows become one row that scrolls sideways, so the stages stay in view. */
  .apf-flows {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }
  .apf-flow {
    flex: 0 0 auto;
    white-space: nowrap;
  }
}
</style>
