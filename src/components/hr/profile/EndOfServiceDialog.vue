<script setup>
// «إنهاء الخدمة»: the type, the last working day and the leave type whose unused days are paid; the settlement is
// worked out by the server as these change (by the labour system), HR adds an adjustment and notes. The employee is
// archived after the last day and can no longer sign in.
import axios from "axios";
import moment from "moment";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { errorText } from "@/utils/accounting";
import { eosLineLabel } from "./endOfService";

const props = defineProps({ employee: { type: Object, required: true } });
const emit = defineEmits(["close", "saved"]);
const { t, te } = useI18n();

const TYPES = ["resignation", "termination", "contract_end", "other"];
const form = ref({ type: "resignation", last_day: new Date(), leave_setup_id: null, adjustment: 0, notes: "" });
const preview = ref(null);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const confirm = ref(false);

const body = () => ({ employee_id: props.employee.id, type: form.value.type, last_day: moment(form.value.last_day).format("YYYY-MM-DD"), leave_setup_id: form.value.leave_setup_id });
const msg = (e) => {
  const code = e.response?.data?.message;
  return typeof code === "string" && code.startsWith("hr.") && te(`eos.err.${code.slice(3)}`) ? t(`eos.err.${code.slice(3)}`) : errorText(e);
};

let timer = null;
async function calculate() {
  if (!form.value.last_day) return;
  loading.value = true;
  error.value = "";
  try {
    const { data } = await axios.post("api/end-of-service/preview", body());
    preview.value = data.data;
    // The annual leave picked once, then HR's choice.
    if (form.value.leave_setup_id === null && data.data.suggested_leave_setup_id) {
      form.value.leave_setup_id = data.data.suggested_leave_setup_id;
    }
  } catch (e) {
    error.value = msg(e);
  } finally {
    loading.value = false;
  }
}
watch(() => [form.value.type, form.value.last_day, form.value.leave_setup_id], () => {
  clearTimeout(timer);
  timer = setTimeout(calculate, 250);
}, { immediate: true });

const currency = computed(() => (preview.value?.currency === "SAR" ? t("vac.sar") : t("vac.jod")));
const money = (v) => `${Number(v ?? 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const total = computed(() => (preview.value ? preview.value.total + Number(form.value.adjustment || 0) : 0));
const past = computed(() => form.value.last_day && moment(form.value.last_day).isBefore(moment(), "day"));

async function save() {
  saving.value = true;
  error.value = "";
  try {
    const { data } = await axios.post("api/end-of-service", { ...body(), adjustment: form.value.adjustment || 0, notes: form.value.notes?.trim() || null });
    emit("saved", data.data);
  } catch (e) {
    error.value = msg(e);
    confirm.value = false;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Dialog visible modal :header="$t('eos.title_for', { name: employee.name })" :style="{ width: '680px' }" :breakpoints="{ '720px': '96vw' }" @update:visible="emit('close')">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="flex flex-column gap-1">
        <label for="eos-type">{{ $t("eos.type") }}</label>
        <Select inputId="eos-type" v-model="form.type" :options="TYPES" :optionLabel="(x) => $t(`eos.type_${x}`)" />
      </div>
      <div class="flex flex-column gap-1">
        <label for="eos-day">{{ $t("eos.last_day") }}</label>
        <DatePicker inputId="eos-day" v-model="form.last_day" dateFormat="yy-mm-dd" showIcon />
      </div>
      <div class="flex flex-column gap-1">
        <label for="eos-leave">{{ $t("eos.leave_type") }}</label>
        <Select inputId="eos-leave" v-model="form.leave_setup_id" :options="preview?.leave_setups ?? []" optionLabel="title" optionValue="id" showClear :placeholder="$t('eos.no_leave')" />
        <small class="text-color-secondary">{{ $t("eos.leave_hint") }}</small>
      </div>
      <div class="flex flex-column gap-1">
        <label for="eos-adj">{{ $t("eos.adjustment") }}</label>
        <InputNumber inputId="eos-adj" v-model="form.adjustment" :minFractionDigits="0" :maxFractionDigits="2" :suffix="` ${currency}`" />
        <small class="text-color-secondary">{{ $t("eos.adjustment_hint") }}</small>
      </div>
    </div>

    <!-- The settlement -->
    <div class="eos-sheet mt-3">
      <div class="flex flex-wrap justify-between gap-2 text-sm text-color-secondary mb-2">
        <span v-if="preview">{{ $t("eos.service", { years: preview.years, days: preview.service_days }) }}</span>
        <span v-if="preview?.start">{{ $t("eos.since") }} <bdi dir="ltr">{{ preview.start }}</bdi></span>
        <span v-if="preview">{{ $t("eos.wage") }}: {{ money(preview.wage) }} {{ currency }}</span>
      </div>
      <ProgressBar v-if="loading" mode="indeterminate" style="height: 3px" />
      <table v-if="preview" class="w-full text-sm">
        <tbody>
          <tr v-for="line in preview.lines" :key="line.key">
            <td class="py-1">{{ eosLineLabel(t, line) }}</td>
            <td class="py-1 text-end whitespace-nowrap" :class="line.amount < 0 ? 'text-red-600' : ''"><bdi dir="ltr">{{ money(line.amount) }}</bdi></td>
          </tr>
          <tr v-if="!preview.lines.length"><td colspan="2" class="py-1 text-color-secondary">{{ $t("eos.no_lines") }}</td></tr>
          <tr v-if="Number(form.adjustment)">
            <td class="py-1">{{ $t("eos.adjustment") }}</td>
            <td class="py-1 text-end"><bdi dir="ltr">{{ money(form.adjustment) }}</bdi></td>
          </tr>
          <tr class="eos-total">
            <td class="pt-2 font-bold">{{ $t("eos.total") }}</td>
            <td class="pt-2 text-end font-bold whitespace-nowrap"><bdi dir="ltr">{{ money(total) }}</bdi> {{ currency }}</td>
          </tr>
        </tbody>
      </table>
      <small class="block mt-2 text-color-secondary">{{ $t("eos.rules_hint") }}</small>
    </div>

    <div class="flex flex-column gap-1 mt-3">
      <label for="eos-notes">{{ $t("eos.notes") }}</label>
      <Textarea id="eos-notes" v-model="form.notes" rows="2" autoResize maxlength="2000" />
    </div>
    <Message severity="warn" :closable="false" class="mt-3">{{ past ? $t("eos.warning_now") : $t("eos.warning_later") }}</Message>
    <Message v-if="error" severity="error" :closable="false" class="mt-2">{{ error }}</Message>

    <template #footer>
      <Button :label="$t('cancel')" text severity="secondary" @click="emit('close')" />
      <Button v-if="!confirm" icon="pi pi-sign-out" severity="danger" :label="$t('eos.record')" :disabled="!preview || loading" @click="confirm = true" />
      <Button v-else icon="pi pi-check" severity="danger" :label="$t('eos.confirm')" :loading="saving" @click="save" />
    </template>
  </Dialog>
</template>

<style scoped>
.eos-sheet { border: 1px solid var(--p-content-border-color); border-radius: 12px; padding: 0.9rem 1rem; background: var(--p-surface-50, #f8fafc); }
.eos-total td { border-top: 1px solid var(--p-content-border-color); }
</style>
