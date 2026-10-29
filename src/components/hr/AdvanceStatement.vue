<script setup>
// An advance's statement: its months (paid once the month's payroll is approved), what is paid and left. A month not
// in a payroll yet can take a different installment or be stopped (0); the months after carry the rest.
import axios from "axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { errorText } from "@/utils/accounting";
import { can } from "@/utils/permissions";

const props = defineProps({ advanceId: { type: Number, default: null } });
const emit = defineEmits(["close"]);
const { t } = useI18n();
const toast = useToast();

const data = ref(null);
const editing = ref(null); // { month, amount }
const money = (v) => Number(v ?? 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function load() {
  data.value = (await axios.get(`api/financial-advance/${props.advanceId}/statement`)).data.data;
}
watch(() => props.advanceId, (id) => id && load(), { immediate: true });

async function setMonth() {
  try {
    data.value = { ...data.value, ...(await axios.put(`api/financial-advance/${props.advanceId}/installments/${editing.value.month}`, { amount: editing.value.amount ?? 0 })).data.data };
    editing.value = null;
  } catch (error) {
    const code = error.response?.data?.message;
    toast.add({ severity: "error", summary: t("error"), detail: code === "hr.installment_in_payroll" ? t("advs.in_payroll") : errorText(error), life: 5000 });
  }
}
async function resetMonth(month) {
  data.value = { ...data.value, ...(await axios.delete(`api/financial-advance/${props.advanceId}/installments/${month}`)).data.data };
}
const editable = (r) => !r.in_payroll && can("financial advance edit") && Number(data.value?.advance?.status) === 1;
</script>

<template>
  <Dialog :visible="!!advanceId" modal :header="$t('advs.title', { name: data?.advance?.employee?.name ?? '' })" :style="{ width: '620px' }" :breakpoints="{ '680px': '96vw' }"
    @update:visible="emit('close')">
    <template v-if="data">
      <div class="advs-kpis mb-3">
        <div><span>{{ $t("advance_mount") }}</span><b>{{ money(data.advance.amount) }}</b></div>
        <div><span>{{ $t("advs.monthly") }}</span><b>{{ money(data.monthly) }}</b></div>
        <div><span>{{ $t("advs.paid") }}</span><b class="text-green-600">{{ money(data.paid) }}</b></div>
        <div><span>{{ $t("advs.remaining") }}</span><b>{{ money(data.remaining) }}</b></div>
      </div>
      <DataTable :value="data.rows" dataKey="id" size="small" stripedRows>
        <template #empty>{{ $t("advs.empty") }}</template>
        <Column :header="$t('advs.month')"><template #body="{ data: r }"><bdi dir="ltr" class="font-medium">{{ r.month }}</bdi></template></Column>
        <Column :header="$t('advs.installment')">
          <template #body="{ data: r }">
            <span :class="{ 'text-color-secondary': !r.amount }">{{ r.amount ? money(r.amount) : $t("advs.stopped") }}</span>
            <Tag v-if="r.fixed" :value="$t('advs.by_hand')" severity="secondary" class="text-xs ms-1" />
          </template>
        </Column>
        <Column :header="$t('status')">
          <template #body="{ data: r }">
            <Tag :severity="r.paid ? 'success' : r.in_payroll ? 'info' : 'secondary'" :value="$t(r.paid ? 'advs.s_paid' : r.in_payroll ? 'advs.s_in_payroll' : 'advs.s_planned')" />
          </template>
        </Column>
        <Column class="text-end">
          <template #body="{ data: r }">
            <template v-if="editable(r)">
              <Button icon="pi pi-pencil" text rounded size="small" v-tooltip.top="$t('advs.change')" :aria-label="$t('advs.change')" @click="editing = { month: r.month, amount: r.amount }" />
              <Button v-if="r.amount" icon="pi pi-pause" text rounded size="small" severity="secondary" v-tooltip.top="$t('advs.stop')" :aria-label="$t('advs.stop')"
                @click="editing = { month: r.month, amount: 0 }; setMonth()" />
              <Button v-if="r.fixed" icon="pi pi-undo" text rounded size="small" severity="secondary" v-tooltip.top="$t('advs.reset')" :aria-label="$t('advs.reset')" @click="resetMonth(r.month)" />
            </template>
          </template>
        </Column>
      </DataTable>
      <small class="block mt-2 text-color-secondary">{{ $t("advs.hint") }}</small>
    </template>
    <ProgressSpinner v-else class="w-3rem h-3rem" />

    <Dialog :visible="!!editing" modal :header="$t('advs.change')" :style="{ width: '360px' }" @update:visible="editing = null">
      <div v-if="editing" class="flex flex-column gap-1">
        <label for="advs-amount">{{ $t("advs.installment_of", { month: editing.month }) }}</label>
        <InputNumber v-model="editing.amount" inputId="advs-amount" :min="0" :maxFractionDigits="2" fluid />
      </div>
      <template #footer>
        <Button :label="$t('cancel')" text severity="secondary" @click="editing = null" />
        <Button icon="pi pi-check" :label="$t('save')" @click="setMonth" />
      </template>
    </Dialog>
  </Dialog>
</template>

<style scoped>
.advs-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.6rem; }
.advs-kpis > div { display: grid; gap: 0.15rem; padding: 0.6rem 0.8rem; border-radius: 12px; border: 1px solid var(--p-content-border-color); }
.advs-kpis span { font-size: 0.8rem; color: var(--p-text-muted-color); }
</style>
