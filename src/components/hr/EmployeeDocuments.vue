<script setup>
// An HR contract's signed documents, in order: the offer letter, then the work contract (once the offer is signed,
// when HR requires it) — signing it hires the candidate with the choices set here — then, for an active contract,
// amendments (new salary, title, end date). Each opens on its own page to fill, send for approval, sign and send.
import axios from "axios";
import moment from "moment";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { can } from "@/utils/permissions";
import { statusSeverity } from "@/components/contracts/contractStatus";
import { amendmentLines } from "@/components/hr/employeeContracts";

const props = defineProps({
  contract: { type: Object, default: null },
  options: { type: Object, required: true },
  // Opened from «عقد جديد» with a template chosen: { kind, template_id } — that document is issued at once.
  start: { type: Object, default: null },
});
const emit = defineEmits(["close"]);

const { t, te, locale } = useI18n();
const router = useRouter();
const toast = useToast();

const state = ref(null);
const loading = ref(false);
const busy = ref(false);

async function load() {
  if (!props.contract) return;
  loading.value = true;
  try {
    state.value = (await axios.get(`api/employee-contracts/hr/${props.contract.id}`)).data.data;
  } finally {
    loading.value = false;
  }
  autoStart();
}
// From «عقد جديد»: the offer letter needs nothing more, so its draft is made and opened; the work contract first asks
// the hiring choices (role, shift), with the chosen template already picked.
let started = null;
function autoStart() {
  const start = props.start;
  if (!start || !state.value || started === props.contract?.id || !state.value.can?.[start.kind]) return;
  started = props.contract.id;
  startIssue(start.kind);
  if (templatesOf(start.kind).some((x) => x.id === start.template_id)) form.value.template_id = start.template_id;
  if (start.kind === "offer") issue();
}
watch(() => props.contract?.id, (id) => {
  state.value = null;
  if (id) load();
}, { immediate: true });

const fail = (e) => {
  const first = Object.values(e.response?.data?.errors ?? {})[0]?.[0] ?? e.response?.data?.message;
  const code = typeof first === "string" && first.startsWith("hr.") ? first.slice(3) : null;
  const text = code && te(`ect.err.${code}`) ? t(`ect.err.${code}`) : code && te(`ctr.err.${code}`) ? t(`ctr.err.${code}`) : first;
  toast.add({ severity: "error", summary: t("error"), detail: text || t("mission_error"), life: 6000 });
};
const open = (doc) => router.push({ name: "employee-contract", params: { id: doc.id } });
const templatesOf = (kind) => (state.value?.templates ?? []).filter((x) => x.kind === kind);
const date = (iso) => (iso ? moment(iso).format("YYYY-MM-DD") : "");

// ---- Issuing ----
const issuing = ref(null); // offer | work | amendment
const form = ref({});
const errors = ref({});
const TYPES = computed(() => [
  { id: 2, name: t("doctor") }, { id: 6, name: t("أداري") }, { id: 5, name: t("Evaluator") }, { id: 1, name: t("driver") },
]);
function startIssue(kind) {
  const saved = state.value?.hire_choices ?? {};
  form.value = {
    template_id: templatesOf(kind)[0]?.id ?? null,
    hire: { role: saved.role ?? null, type: saved.type ?? 2, shift_id: saved.shift_id ?? props.options.shifts[0]?.id ?? null, position_id: saved.position_id ?? null },
    changes: { effective_date: null, basic_salary: null, job_title: "", end_date: null, details: "" },
  };
  errors.value = {};
  issuing.value = kind;
}
async function issue() {
  const kind = issuing.value;
  const e = {};
  if (kind === "work") {
    if (!form.value.hire.role) e.role = t("ctr.err.required");
    if (!form.value.hire.shift_id) e.shift_id = t("ctr.err.required");
  }
  const c = form.value.changes;
  if (kind === "amendment") {
    if (!c.effective_date) e.effective_date = t("ctr.err.required");
    if ((c.basic_salary === null || c.basic_salary === "") && !c.job_title.trim() && !c.end_date && !c.details.trim()) e.changes = t("ect.err.amendment_empty");
  }
  errors.value = e;
  if (Object.keys(e).length) return;

  busy.value = true;
  const body = { doc_type: kind, template_id: form.value.template_id || undefined };
  if (kind === "work") body.hire = form.value.hire;
  if (kind === "amendment") {
    body.changes = {
      effective_date: moment(c.effective_date).format("YYYY-MM-DD"),
      basic_salary: c.basic_salary ?? undefined,
      job_title: c.job_title.trim() || undefined,
      end_date: c.end_date ? moment(c.end_date).format("YYYY-MM-DD") : undefined,
      details: c.details.trim() || undefined,
    };
  }
  try {
    const { data } = await axios.post(`api/employee-contracts/hr/${props.contract.id}`, body);
    issuing.value = null;
    open(data.data);
  } catch (error) {
    fail(error);
  } finally {
    busy.value = false;
  }
}

const steps = computed(() => {
  const s = state.value;
  if (!s) return [];
  return [
    { kind: "offer", doc: s.offer, can: s.can.offer, hint: t("ect.offer_hint") },
    { kind: "work", doc: s.work, can: s.can.work, hint: s.offer_required && s.offer?.status !== "approved" ? t("ect.work_after_offer") : t("ect.work_hint") },
  ];
});
const visible = computed({ get: () => !!props.contract, set: (v) => !v && emit("close") });
</script>

<template>
  <Drawer v-model:visible="visible" :position="locale === 'ar' ? 'left' : 'right'" class="ed-drawer" :header="$t('ect.documents_of', { name: contract?.candidate?.name_ar || '' })">
    <div v-if="loading && !state" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <div v-else-if="state" class="flex flex-column gap-3">
      <Message v-if="state.gm_approval" severity="secondary" :closable="false">{{ $t("ect.flow_hint") }}</Message>
      <Message v-else severity="secondary" :closable="false">{{ $t("ect.flow_hint_direct") }}</Message>

      <section v-for="(step, i) in steps" :key="step.kind" class="ed-step" :class="{ done: step.doc?.status === 'approved' }">
        <div class="flex items-center gap-2">
          <span class="ed-n">{{ i + 1 }}</span>
          <strong class="flex-1">{{ $t("ect.doc_" + step.kind) }}</strong>
          <Tag v-if="step.doc" :severity="statusSeverity(step.doc.status)" :value="$t('ect.st_' + step.doc.status)" />
        </div>
        <p class="ed-hint">{{ step.hint }}</p>
        <div v-if="step.doc" class="ed-doc">
          <span dir="ltr" class="font-bold">{{ step.doc.number }}</span>
          <small class="text-color-secondary">{{ step.doc.template_name }} · {{ date(step.doc.created_at) }}</small>
          <Button icon="pi pi-folder-open" :label="$t('con.open')" size="small" text @click="open(step.doc)" />
        </div>
        <Button v-if="step.can && can('contracts create') && (step.kind !== 'work' || can('employees create'))" icon="pi pi-plus" :label="step.doc ? $t('ect.issue_again') : $t('ect.issue_' + step.kind)" size="small"
          :outlined="!!step.doc" class="self-start" @click="startIssue(step.kind)" />
      </section>

      <section class="ed-step">
        <div class="flex items-center gap-2">
          <span class="ed-n">3</span>
          <strong class="flex-1">{{ $t("ect.amendments") }}</strong>
          <Button v-if="state.can.amendment && can('contracts create')" icon="pi pi-plus" :label="$t('ect.issue_amendment')" size="small" @click="startIssue('amendment')" />
        </div>
        <p class="ed-hint">{{ contract?.status === "active" ? $t("ect.amendment_hint") : $t("ect.amendment_after_hire") }}</p>
        <div v-for="doc in state.amendments" :key="doc.id" class="ed-doc">
          <span dir="ltr" class="font-bold">{{ doc.number }}</span>
          <Tag :severity="statusSeverity(doc.status)" :value="$t('ect.st_' + doc.status)" />
          <small class="text-color-secondary">{{ date(doc.created_at) }}</small>
          <Button icon="pi pi-folder-open" :label="$t('con.open')" size="small" text @click="open(doc)" />
        </div>
      </section>
    </div>

    <Dialog :visible="!!issuing" modal :header="issuing ? $t('ect.issue_' + issuing) : ''" :style="{ width: '540px' }" :breakpoints="{ '640px': '95vw' }" @update:visible="issuing = null">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label for="ed-template">{{ $t("con.template") }}</label>
          <Select inputId="ed-template" v-model="form.template_id" :options="templatesOf(issuing)" optionLabel="name" optionValue="id" :placeholder="$t('con.pick_template')" />
        </div>
        <template v-if="issuing === 'work'">
          <p class="m-0 text-color-secondary">{{ $t("ect.hire_hint") }}</p>
          <div class="flex flex-column gap-1">
            <label for="ed-role">{{ $t("ctr.role") }} <span class="text-red-500">*</span></label>
            <Select inputId="ed-role" v-model="form.hire.role" :options="options.roles" optionLabel="name" optionValue="id" filter :invalid="!!errors.role" />
            <small v-if="errors.role" class="text-red-500">{{ errors.role }}</small>
          </div>
          <div class="grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))">
            <div class="flex flex-column gap-1">
              <label for="ed-type">{{ $t("ctr.user_type") }}</label>
              <Select inputId="ed-type" v-model="form.hire.type" :options="TYPES" optionLabel="name" optionValue="id" />
            </div>
            <div class="flex flex-column gap-1">
              <label for="ed-shift">{{ $t("ctr.shift") }} <span class="text-red-500">*</span></label>
              <Select inputId="ed-shift" v-model="form.hire.shift_id" :options="options.shifts" optionLabel="title" optionValue="id" :invalid="!!errors.shift_id" />
              <small v-if="errors.shift_id" class="text-red-500">{{ errors.shift_id }}</small>
            </div>
            <div class="flex flex-column gap-1">
              <label for="ed-position">{{ $t("ctr.position") }}</label>
              <Select inputId="ed-position" v-model="form.hire.position_id" :options="options.positions" optionLabel="title" optionValue="id" showClear />
            </div>
          </div>
        </template>
        <template v-if="issuing === 'amendment'">
          <div class="flex flex-column gap-1">
            <label for="ed-from">{{ $t("ect.effective_date") }} <span class="text-red-500">*</span></label>
            <DatePicker inputId="ed-from" v-model="form.changes.effective_date" dateFormat="yy-mm-dd" showIcon :invalid="!!errors.effective_date" />
            <small v-if="errors.effective_date" class="text-red-500">{{ errors.effective_date }}</small>
          </div>
          <div class="grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))">
            <div class="flex flex-column gap-1">
              <label for="ed-salary">{{ $t("ect.new_salary") }}</label>
              <InputNumber inputId="ed-salary" v-model="form.changes.basic_salary" :min="0" :maxFractionDigits="2" :placeholder="String(contract?.basic_salary ?? '')" />
            </div>
            <div class="flex flex-column gap-1">
              <label for="ed-end">{{ $t("ect.new_end") }}</label>
              <DatePicker inputId="ed-end" v-model="form.changes.end_date" dateFormat="yy-mm-dd" showIcon showButtonBar />
            </div>
          </div>
          <div class="flex flex-column gap-1">
            <label for="ed-title">{{ $t("ect.new_title") }}</label>
            <InputText id="ed-title" v-model="form.changes.job_title" maxlength="150" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="ed-details">{{ $t("ect.other_changes") }}</label>
            <Textarea id="ed-details" v-model="form.changes.details" rows="2" autoResize maxlength="2000" />
          </div>
          <small v-if="errors.changes" class="text-red-500">{{ errors.changes }}</small>
          <ul v-if="amendmentLines({ ...form.changes, effective_date: null }, $t).length" class="m-0 ps-4 text-sm text-color-secondary">
            <li v-for="(line, i) in amendmentLines({ ...form.changes, effective_date: null }, $t)" :key="i">{{ line }}</li>
          </ul>
        </template>
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="issuing = null" />
        <Button icon="pi pi-check" :label="$t('con.create_draft')" :loading="busy" @click="issue" />
      </template>
    </Dialog>
  </Drawer>
</template>

<style scoped>
.ed-step { border: 1px solid var(--p-content-border-color); border-radius: 14px; padding: 0.8rem; display: grid; gap: 0.45rem; }
.ed-step.done { border-color: #86efac; background: #f0fdf4; }
.ed-n { width: 1.6rem; height: 1.6rem; border-radius: 99px; display: grid; place-items: center; font-weight: 800; font-size: 0.85rem; background: var(--p-primary-color); color: var(--p-primary-contrast-color, #fff); }
.ed-hint { margin: 0; font-size: 0.82rem; color: var(--p-text-muted-color); line-height: 1.6; }
.ed-doc { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem 0.75rem; background: var(--p-content-background, #fff); border: 1px dashed var(--p-content-border-color); border-radius: 10px; padding: 0.35rem 0.6rem; }
</style>

<style>
.ed-drawer { width: min(520px, 100vw) !important; }
</style>
