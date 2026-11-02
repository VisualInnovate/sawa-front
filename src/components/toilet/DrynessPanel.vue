<script setup>
// 4.5 diaper dryness check: a check every half hour at the academy and at home (the parents' sheet is entered here
// the next day), 1–3 valid days. A day is cancelled (and repeated) when the child is sick, travels, guests come…
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { errorText, nowTime, today } from "@/utils/toilet";

const props = defineProps({
  program: { type: Object, required: true },
  meta: { type: Object, required: true },
  canEdit: Boolean,
});
const emit = defineEmits(["updated"]);
const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const editable = computed(() => props.canEdit && props.program.status === "dryness");
const logs = ref([]);
const loading = ref(false);
async function load() {
  loading.value = true;
  try {
    logs.value = (await axios.get(`api/toilet-programs/${props.program.id}/logs`, { params: { kind: "dryness" } })).data.data;
  } finally {
    loading.value = false;
  }
}
onMounted(load);
watch(() => props.program.id, load);

const byDay = computed(() => {
  const days = {};
  for (const log of [...logs.value].reverse()) (days[log.date] ??= []).push(log);
  return Object.entries(days).map(([date, items]) => ({ date, items }));
});
const valid = computed(() => props.program.dryness?.valid ?? []);
const cancelled = computed(() => props.program.dryness?.cancelled ?? []);

const blank = () => ({ date: today(), time: nowTime(), source: "academy", data: { dry: true, output: null, changed: false, note: "" } });
const form = ref(blank());
const saving = ref(false);
const yesNo = computed(() => [{ value: true, label: t("toilet.yes") }, { value: false, label: t("toilet.no") }]);
const outputs = computed(() => props.meta.outputs.map((value) => ({ value, label: t(`toilet.output_${value}`) })));
const sources = computed(() => ["academy", "home"].map((value) => ({ value, label: t(`toilet.source_${value}`) })));

async function save() {
  saving.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/logs`, { kind: "dryness", ...form.value });
    toast.add({ severity: "success", summary: t("toilet.saved"), life: 1500 });
    form.value = { ...blank(), date: form.value.date, source: form.value.source };
    emit("updated", data.program);
    await load();
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

const cancelDialog = ref(false);
const cancelForm = ref({});
function openCancel() {
  cancelForm.value = { date: today(), reason: "sick", note: "" };
  cancelDialog.value = true;
}
async function cancelDay() {
  saving.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/logs`, {
      kind: "dryness_day", date: cancelForm.value.date, data: { status: "cancelled", reason: cancelForm.value.reason, note: cancelForm.value.note },
    });
    cancelDialog.value = false;
    emit("updated", data.program);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    saving.value = false;
  }
}

function remove(log) {
  confirm.require({
    header: t("toilet.delete_record"),
    message: `${log.date} ${log.time ?? ""}`,
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

const finishing = ref(false);
async function finish() {
  finishing.value = true;
  try {
    const { data } = await axios.post(`api/toilet-programs/${props.program.id}/dryness-done`);
    emit("updated", data.data);
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(t, error), life: 4000 });
  } finally {
    finishing.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Message severity="info" icon="pi pi-info-circle">{{ $t("toilet.dryness_lead") }}</Message>
    <div class="p-3 rounded-lg border border-red-200 bg-red-50 flex flex-col gap-1">
      <b class="text-red-800">{{ $t("toilet.blockers_title") }}</b>
      <div class="flex flex-wrap gap-2">
        <Tag v-for="blocker in meta.dryness_blockers.filter((b) => b !== 'other')" :key="blocker" severity="danger" :value="$t(`toilet.blocker_${blocker}`)" />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <Tag :severity="valid.length ? 'success' : 'secondary'" :value="$t('toilet.valid_days', { n: valid.length })" class="text-base" />
      <span v-for="day in valid" :key="day" class="ltr text-slate-600">{{ day }}</span>
      <template v-if="cancelled.length">
        <span class="text-slate-500">{{ $t("toilet.cancelled_days") }}:</span>
        <Tag v-for="day in cancelled" :key="day.id" severity="danger" v-tooltip.top="day.note || ''">
          <span class="ltr">{{ day.date }}</span>&nbsp;· {{ $t(`toilet.blocker_${day.reason}`) }}
        </Tag>
      </template>
    </div>

    <div v-if="editable" class="p-3 rounded-lg border border-slate-200 bg-white flex flex-col gap-3">
      <b>{{ $t("toilet.add_check") }}</b>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="flex flex-col gap-1"><label for="dr-date">{{ $t("toilet.date") }}</label><InputText id="dr-date" v-model="form.date" type="date" class="ltr" /></div>
        <div class="flex flex-col gap-1"><label for="dr-time">{{ $t("toilet.time") }}</label><InputText id="dr-time" v-model="form.time" type="time" class="ltr" /></div>
        <div class="flex flex-col gap-1 col-span-2"><span>{{ $t("toilet.source") }}</span><SelectButton v-model="form.source" :options="sources" optionLabel="label" optionValue="value" :allowEmpty="false" /></div>
      </div>
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex flex-col gap-1"><span>{{ $t("toilet.dry") }}</span><SelectButton v-model="form.data.dry" :options="yesNo" optionLabel="label" optionValue="value" :allowEmpty="false" /></div>
        <div v-if="!form.data.dry" class="flex flex-col gap-1"><span>{{ $t("toilet.output") }}</span><SelectButton v-model="form.data.output" :options="outputs" optionLabel="label" optionValue="value" /></div>
        <div class="flex flex-col gap-1"><span>{{ $t("toilet.changed") }}</span><SelectButton v-model="form.data.changed" :options="yesNo" optionLabel="label" optionValue="value" :allowEmpty="false" /></div>
        <div class="flex flex-col gap-1 grow"><label for="dr-note">{{ $t("toilet.note") }}</label><InputText id="dr-note" v-model="form.data.note" maxlength="500" fluid /></div>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button icon="pi pi-plus" :label="$t('toilet.add_check')" :loading="saving" :disabled="!form.date || !form.time" @click="save" />
        <Button icon="pi pi-ban" severity="danger" variant="outlined" :label="$t('toilet.cancel_day')" @click="openCancel" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <b>{{ $t("toilet.records") }}</b>
      <p v-if="!loading && !logs.length" class="text-slate-500 m-0">{{ $t("toilet.no_records") }}</p>
      <div v-for="day in byDay" :key="day.date" class="overflow-x-auto">
        <p class="m-0 font-semibold ltr text-start">{{ day.date }}</p>
        <table class="w-full text-sm border-collapse min-w-[36rem]">
          <thead><tr class="text-slate-500 text-start">
            <th class="p-1 text-start">{{ $t("toilet.time") }}</th><th class="p-1 text-start">{{ $t("toilet.source") }}</th><th class="p-1 text-start">{{ $t("toilet.dry") }}</th>
            <th class="p-1 text-start">{{ $t("toilet.output") }}</th><th class="p-1 text-start">{{ $t("toilet.changed") }}</th><th class="p-1 text-start">{{ $t("toilet.note") }}</th><th />
          </tr></thead>
          <tbody>
            <tr v-for="log in day.items" :key="log.id" class="border-t border-slate-100">
              <td class="p-1 ltr text-start">{{ log.time }}</td>
              <td class="p-1">{{ $t(`toilet.source_${log.source}`) }}</td>
              <td class="p-1"><Tag :severity="log.data.dry ? 'success' : 'warn'" :value="log.data.dry ? $t('toilet.is_dry') : $t('toilet.is_wet')" /></td>
              <td class="p-1">{{ log.data.output ? $t(`toilet.output_${log.data.output}`) : "" }}</td>
              <td class="p-1">{{ log.data.changed ? $t("toilet.yes") : $t("toilet.no") }}</td>
              <td class="p-1">{{ log.data.note }}</td>
              <td class="p-1 w-10"><Button v-if="editable" size="small" variant="text" severity="danger" icon="pi pi-trash" :aria-label="$t('toilet.delete_record')" @click="remove(log)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="editable" class="p-3 rounded-lg border border-emerald-200 bg-emerald-50 flex flex-wrap items-center justify-between gap-2">
      <small class="text-emerald-900">{{ $t("toilet.dryness_done_hint") }}</small>
      <Button icon="pi pi-check" :label="$t('toilet.dryness_done')" :loading="finishing" :disabled="!valid.length" @click="finish" />
    </div>

    <Dialog v-model:visible="cancelDialog" modal :header="$t('toilet.cancel_day')" :style="{ width: '28rem' }">
      <div class="flex flex-col gap-3">
        <small class="text-slate-600">{{ $t("toilet.cancel_day_hint") }}</small>
        <div class="flex flex-col gap-1"><label for="cd-date">{{ $t("toilet.date") }}</label><InputText id="cd-date" v-model="cancelForm.date" type="date" class="ltr" /></div>
        <div class="flex flex-col gap-1">
          <span>{{ $t("toilet.reasons") }}</span>
          <label v-for="blocker in meta.dryness_blockers" :key="blocker" class="flex items-center gap-2">
            <RadioButton v-model="cancelForm.reason" :value="blocker" :inputId="`cd-${blocker}`" name="cd-reason" />{{ $t(`toilet.blocker_${blocker}`) }}
          </label>
        </div>
        <div class="flex flex-col gap-1"><label for="cd-note">{{ $t("toilet.note") }}</label><InputText id="cd-note" v-model="cancelForm.note" maxlength="500" fluid /></div>
      </div>
      <template #footer>
        <Button variant="outlined" :label="$t('close')" @click="cancelDialog = false" />
        <Button icon="pi pi-ban" severity="danger" :label="$t('toilet.cancel_day')" :loading="saving" @click="cancelDay" />
      </template>
    </Dialog>
  </div>
</template>
