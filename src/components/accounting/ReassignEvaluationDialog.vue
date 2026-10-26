<script setup>
// A cancelled (unpaid) evaluation given a new evaluator and time; without a time it waits on the evaluator's list today.
import axios from "axios";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { getEvaluationTypeLabel } from "@/utils/evaluationTypes";
import { errorText, isoDate } from "@/utils/accounting";

const props = defineProps({ request: { type: Object, default: null } });
const visible = defineModel("visible", { type: Boolean, default: false });
const emit = defineEmits(["saved"]);
const { t } = useI18n();
const toast = useToast();

const specialists = ref([]);
const form = ref({});
const saving = ref(false);

const timed = computed(() => !!props.request?.start_time);
const ready = computed(() => form.value.employee_id && (!timed.value || (form.value.date && form.value.start && form.value.end && form.value.end > form.value.start)));

watch(visible, async (open) => {
  if (!open || !props.request) return;
  form.value = { employee_id: props.request.employee_id ?? null, date: null, start: props.request.start_time?.slice(0, 5) ?? "09:00", end: props.request.end_time?.slice(0, 5) ?? "10:00" };
  const { data } = await axios.get(`api/employees/get/with/${props.request.evaluation_type}`).catch(() => ({ data: {} }));
  const list = data.data?.employees;
  specialists.value = (Array.isArray(list) ? list : Object.values(list ?? {})).map((row) => ({ id: Number(row.id), name: row.name }));
});

async function save() {
  saving.value = true;
  try {
    await axios.post(`api/evaluation-request/${props.request.id}/reassign`, timed.value
      ? { employee_id: form.value.employee_id, date: isoDate(form.value.date), start_time: `${form.value.start}:00`, end_time: `${form.value.end}:00` }
      : { employee_id: form.value.employee_id });
    toast.add({ severity: "success", summary: t("success_message"), detail: t("acc.saved"), life: 2500 });
    visible.value = false;
    emit("saved");
  } catch (error) {
    toast.add({ severity: "error", summary: t("error"), detail: errorText(error), life: 5000 });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="$t('acc.reassign_evaluation_title')" :style="{ width: '30rem' }" :breakpoints="{ '640px': '95vw' }">
    <div v-if="request" class="flex flex-column gap-3">
      <span class="font-semibold">{{ getEvaluationTypeLabel(request.evaluation_type, t, request.title || "-") }}</span>
      <div class="flex flex-column gap-1">
        <label for="re-specialist">{{ $t("acc.specialist") }}</label>
        <Select v-model="form.employee_id" inputId="re-specialist" :options="specialists" optionLabel="name" optionValue="id" filter />
      </div>
      <template v-if="timed">
        <div class="flex flex-column gap-1">
          <label for="re-date">{{ $t("acc.date") }}</label>
          <DatePicker v-model="form.date" inputId="re-date" dateFormat="yy-mm-dd" showIcon :minDate="new Date()" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-column gap-1">
            <label for="re-start">{{ $t("acc.new_time") }}</label>
            <InputText v-model="form.start" id="re-start" type="time" />
          </div>
          <div class="flex flex-column gap-1">
            <label for="re-end">&nbsp;</label>
            <InputText v-model="form.end" id="re-end" type="time" :aria-label="$t('acc.new_time')" />
          </div>
        </div>
      </template>
      <small v-else class="text-color-secondary">{{ $t("acc.without_appointment") }}</small>
    </div>
    <template #footer>
      <Button :label="$t('acc.cancel')" severity="secondary" variant="outlined" @click="visible = false" />
      <Button icon="pi pi-refresh" :label="$t('acc.reassign_evaluation')" :loading="saving" :disabled="!ready" @click="save" />
    </template>
  </Dialog>
</template>
