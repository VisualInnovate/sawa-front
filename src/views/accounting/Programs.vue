<script setup>
// «تثبيت البرامج»: the programs with their accounting state, charge and installments; each opens its account.
import axios from "axios";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { FilterMatchMode } from "@primevue/core/api";
import { programName } from "@/utils/studentPrograms";
import { amount, formatDateTime, installmentSeverity, loadCurrency, programStatusSeverity } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";
import ProgramAccountDialog from "@/components/accounting/ProgramAccountDialog.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const programs = ref([]);
const loading = ref(true);
const status = ref(route.query.status ?? "tentative");
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const opened = ref(null);
const showing = ref(false);

const statuses = ["tentative", "late", "price_change", "confirmed", "unconfirmed", "stopped", "all"];
const rows = computed(() => programs.value.map((program) => ({
  ...program, student_name: program.student?.name, program_name: programName(t, program),
})));

async function load() {
  loading.value = true;
  await loadCurrency();
  const { data } = await axios.get("api/accounting/programs", { params: status.value !== "all" ? { status: status.value } : {} });
  programs.value = data.data;
  loading.value = false;
}

watch(status, (value) => {
  router.replace({ query: { status: value } });
  load();
});

function open(program) {
  opened.value = program.id;
  showing.value = true;
}

const formatAt = formatDateTime;
onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-[#135C65] font-bold m-0">{{ $t("acc.programs") }}</p>
    <AccountingTabs />
    <div class="sawa-card p-3">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <SelectButton v-model="status" :options="statuses" :optionLabel="(s) => (s !== 'all' ? $t(`acc.filter.${s}`) : $t('acc.all'))" :allowEmpty="false" />
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.global.value" :placeholder="$t('acc.search_child')" />
        </IconField>
      </div>
      <DataTable :value="rows" :loading="loading" dataKey="id" v-model:filters="filters" :globalFilterFields="['student_name', 'program_name']"
        paginator :rows="15" stripedRows rowHover class="cursor-pointer" @row-click="(e) => open(e.data)">
        <Column field="student_name" :header="$t('acc.child')" sortable />
        <Column field="program_name" :header="$t('acc.program')">
          <template #body="{ data }"><Tag :value="data.program_name" severity="secondary" /></template>
        </Column>
        <Column :header="$t('acc.period')">
          <template #body="{ data }"><span class="whitespace-nowrap">{{ data.start_date }} → {{ data.end_date }}</span></template>
        </Column>
        <Column :header="$t('acc.status')">
          <template #body="{ data }">
            <div class="flex flex-column gap-1 align-items-start">
              <Tag :severity="programStatusSeverity[data.accounting_status]" :value="$t(`acc.program_status.${data.accounting_status}`)" />
              <small v-if="data.accounting_status === 'tentative' && data.tentative_until" class="text-color-secondary whitespace-nowrap">
                {{ $t("acc.tentative_until", { at: formatAt(data.tentative_until) }) }}
              </small>
              <Tag v-if="data.sessions_suspended_at" severity="danger" icon="pi pi-pause" :value="$t('acc.suspended')" />
              <Tag v-if="data.charge?.pending_gross" severity="warn" icon="pi pi-exclamation-triangle" :value="$t('acc.filter.price_change')" />
            </div>
          </template>
        </Column>
        <Column :header="$t('acc.owed')">
          <template #body="{ data }">
            {{ amount(data.charge?.amount) }}
            <small v-if="(data.charge?.installments?.filter((row) => row.status !== 'cancelled').length ?? 0) > 1" class="block text-color-secondary">
              {{ $t("acc.installments_count", { n: data.charge.installments.filter((row) => row.status !== "cancelled").length }) }}
            </small>
          </template>
        </Column>
        <Column :header="$t('acc.paid')">
          <template #body="{ data }"><span class="text-green-700">{{ amount(data.charge?.paid) }}</span></template>
        </Column>
        <Column :header="$t('acc.next_due')">
          <template #body="{ data }">
            <Tag v-if="data.charge?.next_installment" :severity="installmentSeverity[data.charge.next_installment.state]"
              :value="`${data.charge.next_installment.due_date} · ${amount(data.charge.next_installment.amount)}`" />
          </template>
        </Column>
        <Column header-style="width:4rem">
          <template #body="{ data }">
            <Button icon="pi pi-folder-open" size="small" rounded variant="outlined" :aria-label="$t('acc.details')" v-tooltip.top="$t('acc.details')" @click.stop="open(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
    <ProgramAccountDialog v-model:visible="showing" :programId="opened" @changed="load" />
    <Toast />
  </div>
</template>
