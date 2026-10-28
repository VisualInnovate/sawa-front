<script setup>
// The employee's money (profile tab): payrolls, advances, bonuses, deductions and overtime — each part only for
// whoever may see its own page (the server leaves the others out).
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { printPayslip } from "@/components/hr/payslip";

const props = defineProps({ userId: { type: Number, required: true } });
const { t, locale } = useI18n();

const data = ref(null);
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    data.value = (await axios.get(`api/employee-profile/${props.userId}/money`)).data.data;
  } finally {
    loading.value = false;
  }
});

const currency = computed(() => (data.value?.currency === "SAR" ? t("vac.sar") : t("vac.jod")));
const money = (v) => Number(v ?? 0).toLocaleString("en", { maximumFractionDigits: 2 });
const STATUS = { 1: ["success", "Accept"], 0: ["warn", "Pending"], "-1": ["danger", "Cancell"] };
const items = computed(() => ["advances", "bonuses", "deductions", "overtimes"].filter((k) => Array.isArray(data.value?.[k])));
</script>

<template>
  <div class="flex flex-column gap-4">
    <ProgressSpinner v-if="loading" class="w-3rem h-3rem" />
    <template v-else-if="data">
      <section v-if="data.payrolls">
        <p class="font-bold m-0 mb-2">{{ $t("prof.payrolls") }}</p>
        <DataTable :value="data.payrolls" dataKey="id" size="small" stripedRows responsiveLayout="scroll">
          <template #empty>{{ $t("prof.none") }}</template>
          <Column :header="$t('prof.month')"><template #body="{ data: r }"><bdi dir="ltr">{{ r.month || r.date }}</bdi></template></Column>
          <Column :header="$t('prof.base')"><template #body="{ data: r }">{{ money(r.base_salary) }}</template></Column>
          <Column :header="$t('prof.plus')"><template #body="{ data: r }"><span class="text-green-700">+{{ money(Number(r.overtime) + Number(r.bonus)) }}</span></template></Column>
          <Column :header="$t('prof.minus')"><template #body="{ data: r }"><span class="text-red-600">−{{ money(Number(r.deduction) + Number(r.financial_advance) + Number(r.insurance ?? 0)) }}</span></template></Column>
          <Column :header="$t('prof.net')"><template #body="{ data: r }"><b>{{ money(r.total_salary) }} {{ currency }}</b></template></Column>
          <Column header-style="width:3.5rem">
            <template #body="{ data: r }">
              <Button icon="pi pi-file" rounded variant="outlined" severity="secondary" size="small" v-tooltip.top="$t('slip.print')" :aria-label="$t('slip.print')" @click="printPayslip(t, r.id, locale)" />
            </template>
          </Column>
        </DataTable>
      </section>
      <section v-for="key in items" :key="key">
        <p class="font-bold m-0 mb-2">{{ $t(`prof.${key}`) }}</p>
        <DataTable :value="data[key]" dataKey="id" size="small" stripedRows responsiveLayout="scroll" paginator :rows="5">
          <template #empty>{{ $t("prof.none") }}</template>
          <Column :header="$t('prof.date')"><template #body="{ data: r }"><bdi dir="ltr">{{ r.date }}</bdi></template></Column>
          <Column :header="$t('prof.amount')"><template #body="{ data: r }">{{ money(r.amount) }} {{ currency }}</template></Column>
          <Column :header="$t('prof.reason')"><template #body="{ data: r }"><small>{{ r.reason || r.notes || "—" }}</small></template></Column>
          <Column :header="$t('prof.status')">
            <template #body="{ data: r }">
              <Tag v-if="r.payroll_id" severity="info" :value="$t('hrpay.paid')" />
              <Tag v-else :severity="(STATUS[r.status] ?? STATUS[0])[0]" :value="$t((STATUS[r.status] ?? STATUS[0])[1])" />
            </template>
          </Column>
        </DataTable>
      </section>
      <p v-if="!data.payrolls && !items.length" class="text-color-secondary m-0">{{ $t("prof.no_money_access") }}</p>
    </template>
  </div>
</template>
