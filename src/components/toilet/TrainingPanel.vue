<script setup>
// Training: scheduled visits (and initiative) by the stage's interval — usually from stage 7; urinated on time → next
// stage, did not → back a stage; the first time the child asks alone the request phase starts. It ends when 7 of the
// last 10 requests succeed with at most one accident on the last day.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { errorText, minutesText, nowTime, today } from "@/utils/toilet";

const props = defineProps({
  program: { type: Object, required: true },
  meta: { type: Object, required: true },
  canEdit: Boolean,
});
const emit = defineEmits(["updated"]);
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const editable = computed(() => props.canEdit && props.program.status === "training");
const day = ref(today());
const logs = ref([]);
const loading = ref(false);
async function load() {
  loading.value = true;
  try {
    logs.value = (await axios.get(`api/toilet-programs/${props.program.id}/logs`, { params: { kind: "visit", from: day.value, to: day.value } })).data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(day, load);

const nextTime = computed(() => {
  const now = nowTime();
  return props.program.times.find((time) => time >= now) ?? null;
});

const blank = () => ({
  date: today(), time: nowTime(),
  data: { type: "scheduled", fluids: null, urinated_in: null, bm_in: null, wet: null, soiled: null, requested_alone: null, help: "", request_form: null, reinforcer: props.program.reinforcer ?? "", amount: null, note: "" },
});
const form = ref(blank());
watch(() => form.value.data.type, (type) => {
  if (type === "request") form.value.data.requested_alone ??= true;
});
const types = computed(() => props.meta.visit_types.map((value) => ({ value, label: t(`toilet.visit_${value}`) })));
const amounts = computed(() => props.meta.amounts.map((value) => ({ value, label: t(`toilet.amount_${value}`) })));
const forms = computed(() => props.meta.request_forms.map((value) => ({ value, label: t(`toilet.form_${value}`) })));
const flags = ["urinated_in", "bm_in", "wet", "soiled", "requested_alone"];

const saving = ref(false);
async function save() {
  saving.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/logs`, { kind: "visit", ...form.value });
    const messages = [];
    if (data.changes?.stage) messages.push(t(data.changes.stage.to > data.changes.stage.from ? "toilet.stage_up" : "toilet.stage_down", { n: data.changes.stage.to }));
    if (data.changes?.phase) messages.push(t("toilet.phase_up"));
    toast.add({ severity: messages.length ? "info" : "success", summary: t("toilet.saved"), detail: messages.join(" ") || undefined, life: messages.length ? 5000 : 1500 });
    form.value = { ...blank(), date: form.value.date };
    emit("updated", data.program);
    if (day.value === data.data.date) await load();
    else day.value = data.data.date;
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

function remove(log) {
  confirm.require({
    header: t("toilet.delete_record"),
    message: t("toilet.delete_record_hint"),
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        const { data } = await axios.delete(`api/toilet-programs/${props.program.id}/logs/${log.id}`);
        emit("updated", data.program);
        await load();
      } catch (error) {
        toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 3000 });
      }
    },
  });
}

const stageDialog = ref(false);
const stageForm = ref({});
const phases = computed(() => ["schedule", "request"].map((value) => ({ value, label: t(`toilet.phase_${value}`) })));
function openStage() {
  stageForm.value = { stage: props.program.stage, phase: props.program.phase };
  stageDialog.value = true;
}
async function saveStage() {
  try {
    const { data } = await axios.put(`api/toilet-programs/${props.program.id}/stage`, stageForm.value);
    stageDialog.value = false;
    emit("updated", data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  }
}

const progress = computed(() => props.program.request_progress ?? {});
function complete() {
  confirm.require({
    header: t("toilet.complete"),
    message: t("toilet.complete_confirm"),
    icon: "pi pi-star",
    accept: async () => {
      try {
        const { data } = await axios.post(`api/toilet-programs/${props.program.id}/complete`);
        toast.add({ severity: "success", summary: t("toilet.completed_msg"), life: 4000 });
        emit("updated", data.data);
      } catch (error) {
        toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
      }
    },
  });
}
const yes = (value) => (value === true ? t("toilet.yes") : value === false ? t("toilet.no") : "");
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid lg:grid-cols-3 gap-3">
      <!-- Now -->
      <div class="p-3 rounded-lg border border-emerald-200 bg-emerald-50 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <b class="text-lg">{{ $t("toilet.stage_n", { n: program.stage }) }}</b>
          <Tag :severity="program.phase === 'request' ? 'success' : 'info'" :value="$t(`toilet.phase_${program.phase}`)" />
        </div>
        <span>{{ $t("toilet.current_interval") }}: <b>{{ minutesText($t, program.interval) }}</b> · {{ $t("toilet.sit", { n: program.sit }) }}</span>
        <small class="text-slate-600">{{ $t("toilet.stage_rule") }}</small>
        <Button v-if="editable" size="small" variant="text" icon="pi pi-sliders-h" :label="$t('toilet.change_stage')" class="self-start p-0" @click="openStage" />
      </div>
      <!-- Today's times -->
      <div class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-2 lg:col-span-2">
        <b>{{ $t("toilet.schedule_title") }}</b>
        <div class="flex flex-wrap gap-1">
          <Tag v-for="time in program.times" :key="time" :severity="time === nextTime ? 'success' : 'secondary'" class="ltr num">{{ time }}</Tag>
        </div>
        <small class="text-slate-500">{{ $t("toilet.times_hint") }}</small>
      </div>
    </div>

    <!-- Request progress -->
    <div class="p-3 rounded-lg border bg-white flex flex-col gap-2" :class="progress.ready ? 'border-emerald-400' : 'border-slate-200'">
      <b>{{ $t("toilet.request_progress") }}</b>
      <span>{{ $t("toilet.request_successes", { s: progress.successes ?? 0, r: progress.requests ?? 0, need: meta.request_success, window: meta.request_window }) }}</span>
      <ProgressBar :value="Math.round(((progress.successes ?? 0) / meta.request_window) * 100)" :showValue="false" style="height: .5rem" />
      <span v-if="progress.last_date">{{ $t("toilet.accidents_last", { date: progress.last_date, n: progress.accidents }) }}</span>
      <Message v-if="progress.ready" severity="success" icon="pi pi-star">{{ $t("toilet.ready_complete") }}</Message>
      <Button v-if="editable" icon="pi pi-star" :severity="progress.ready ? 'success' : 'secondary'" :variant="progress.ready ? undefined : 'outlined'"
              :label="$t('toilet.complete')" class="self-start" @click="complete" />
    </div>

    <!-- New visit -->
    <div v-if="editable" class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-3">
      <b>{{ $t("toilet.add_visit") }}</b>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="flex flex-col gap-1"><label for="tv-date">{{ $t("toilet.date") }}</label><InputText id="tv-date" v-model="form.date" type="date" class="ltr" /></div>
        <div class="flex flex-col gap-1"><label for="tv-time">{{ $t("toilet.time") }}</label><InputText id="tv-time" v-model="form.time" type="time" class="ltr" /></div>
        <div class="flex flex-col gap-1 col-span-2"><span>{{ $t("toilet.visit_type") }}</span><SelectButton v-model="form.data.type" :options="types" optionLabel="label" optionValue="value" :allowEmpty="false" /><small class="text-slate-500">{{ $t("toilet.visit_hint") }}</small></div>
      </div>
      <div class="flex flex-wrap gap-4">
        <label v-for="flag in flags" :key="flag" class="flex items-center gap-2">
          <Checkbox v-model="form.data[flag]" binary :inputId="`tv-${flag}`" />{{ $t(`toilet.${flag}`) }}
        </label>
      </div>
      <div class="grid md:grid-cols-3 gap-3">
        <div class="flex flex-col gap-1"><span>{{ $t("toilet.fluids") }}</span><SelectButton v-model="form.data.fluids" :options="amounts" optionLabel="label" optionValue="value" /></div>
        <div class="flex flex-col gap-1"><span>{{ $t("toilet.amount") }}</span><SelectButton v-model="form.data.amount" :options="amounts" optionLabel="label" optionValue="value" /></div>
        <div class="flex flex-col gap-1"><label for="tv-form">{{ $t("toilet.request_form") }}</label><Select inputId="tv-form" v-model="form.data.request_form" :options="forms" optionLabel="label" optionValue="value" showClear fluid /></div>
      </div>
      <div class="grid md:grid-cols-3 gap-3">
        <div class="flex flex-col gap-1"><label for="tv-help">{{ $t("toilet.help") }}</label><InputText id="tv-help" v-model="form.data.help" maxlength="150" :disabled="form.data.requested_alone" fluid /></div>
        <div class="flex flex-col gap-1"><label for="tv-rein">{{ $t("toilet.reinforcer") }}</label><InputText id="tv-rein" v-model="form.data.reinforcer" maxlength="150" fluid /></div>
        <div class="flex flex-col gap-1"><label for="tv-note">{{ $t("toilet.note") }}</label><InputText id="tv-note" v-model="form.data.note" maxlength="500" fluid /></div>
      </div>
      <Button icon="pi pi-plus" :label="$t('toilet.add_visit')" :loading="saving" :disabled="!form.date || !form.time" class="self-start" @click="save" />
    </div>

    <!-- Records -->
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap items-center gap-3">
        <b>{{ $t("toilet.records") }}</b>
        <InputText v-model="day" type="date" class="ltr" :aria-label="$t('toilet.date')" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse min-w-[60rem] [&_th]:whitespace-nowrap">
          <thead><tr class="text-slate-500">
            <th class="p-1 text-start">{{ $t("toilet.time") }}</th><th class="p-1 text-start">{{ $t("toilet.stage") }}</th><th class="p-1 text-start">{{ $t("toilet.visit_type") }}</th>
            <th class="p-1 text-start">{{ $t("toilet.fluids") }}</th><th class="p-1 text-start">{{ $t("toilet.urinated_in") }}</th><th class="p-1 text-start">{{ $t("toilet.bm_in") }}</th>
            <th class="p-1 text-start">{{ $t("toilet.wet") }}</th><th class="p-1 text-start">{{ $t("toilet.soiled") }}</th><th class="p-1 text-start">{{ $t("toilet.requested_alone") }}</th>
            <th class="p-1 text-start">{{ $t("toilet.help") }}</th><th class="p-1 text-start">{{ $t("toilet.request_form") }}</th><th class="p-1 text-start">{{ $t("toilet.amount") }}</th><th />
          </tr></thead>
          <tbody>
            <tr v-if="!loading && !logs.length"><td colspan="13" class="p-3 text-center text-slate-500">{{ $t("toilet.no_records") }}</td></tr>
            <tr v-for="log in logs" :key="log.id" class="border-t border-slate-100">
              <td class="p-1 ltr text-start">{{ log.time }}</td>
              <td class="p-1 num">{{ log.stage }}</td>
              <td class="p-1">{{ $t(`toilet.visit_${log.data.type}`) }}</td>
              <td class="p-1">{{ log.data.fluids ? $t(`toilet.amount_${log.data.fluids}`) : "" }}</td>
              <td class="p-1" :class="{ 'text-emerald-700 font-semibold': log.data.urinated_in }">{{ yes(log.data.urinated_in) }}</td>
              <td class="p-1" :class="{ 'text-emerald-700 font-semibold': log.data.bm_in }">{{ yes(log.data.bm_in) }}</td>
              <td class="p-1" :class="{ 'text-red-700 font-semibold': log.data.wet }">{{ yes(log.data.wet) }}</td>
              <td class="p-1" :class="{ 'text-red-700 font-semibold': log.data.soiled }">{{ yes(log.data.soiled) }}</td>
              <td class="p-1">{{ yes(log.data.requested_alone) }}</td>
              <td class="p-1">{{ log.data.help }}</td>
              <td class="p-1">{{ log.data.request_form ? $t(`toilet.form_${log.data.request_form}`) : "" }}</td>
              <td class="p-1">{{ log.data.amount ? $t(`toilet.amount_${log.data.amount}`) : "" }}</td>
              <td class="p-1 w-10"><Button v-if="editable" size="small" variant="text" severity="danger" icon="pi pi-trash" :aria-label="$t('toilet.delete_record')" @click="remove(log)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stages table -->
    <details class="p-3 rounded-lg border border-slate-200 bg-white">
      <summary class="cursor-pointer font-semibold">{{ $t("toilet.stages_table") }}</summary>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
        <div v-for="stage in meta.stages" :key="stage.stage" class="p-2 rounded border text-sm"
             :class="stage.stage === program.stage ? 'border-emerald-500 bg-emerald-50 font-semibold' : 'border-slate-200'">
          {{ $t("toilet.stage_n", { n: stage.stage }) }}<br />{{ minutesText($t, stage.every) }} · {{ $t("toilet.sit", { n: stage.sit }) }}
        </div>
      </div>
    </details>

    <Dialog v-model:visible="stageDialog" modal :header="$t('toilet.change_stage')" :style="{ width: '26rem' }">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <label for="st-stage">{{ $t("toilet.stage") }}</label>
          <Select id="st-stage" v-model="stageForm.stage" :options="meta.stages" optionValue="stage" :optionLabel="(s) => `${$t('toilet.stage_n', { n: s.stage })} · ${minutesText($t, s.every)}`" fluid />
        </div>
        <div class="flex flex-col gap-1"><span>{{ $t("toilet.phase_request") }}</span><SelectButton v-model="stageForm.phase" :options="phases" optionLabel="label" optionValue="value" :allowEmpty="false" /></div>
      </div>
      <template #footer>
        <Button variant="outlined" :label="$t('close')" @click="stageDialog = false" />
        <Button icon="pi pi-check" :label="$t('toilet.save')" @click="saveStage" />
      </template>
    </Dialog>
  </div>
</template>
