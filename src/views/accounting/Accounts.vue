<script setup>
// «حسابات الأطفال»: what each child owes, paid, still owes and is late on, and their balance; each opens its statement.
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { FilterMatchMode } from "@primevue/core/api";
import { amount, loadCurrency } from "@/utils/accounting";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";

const router = useRouter();
const accounts = ref([]);
const loading = ref(true);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

onMounted(async () => {
  await loadCurrency();
  accounts.value = (await axios.get("api/accounting/accounts")).data.data.map((row) => ({ ...row, child_name: row.child?.name }));
  loading.value = false;
});

const open = (row) => router.push({ name: "accounting-statement", params: { child: row.child_id } });
</script>

<template>
  <div>
    <p class="text-xl p-4 text-bp-135c65 font-bold m-0">{{ $t("acc.accounts") }}</p>
    <AccountingTabs />
    <div class="sawa-card p-3">
      <div class="flex justify-end mb-3">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filters.global.value" :placeholder="$t('acc.search_child')" />
        </IconField>
      </div>
      <DataTable :value="accounts" :loading="loading" dataKey="child_id" v-model:filters="filters" :globalFilterFields="['child_name']"
        paginator :rows="15" stripedRows rowHover class="cursor-pointer" sortField="late" :sortOrder="-1" @row-click="(e) => open(e.data)">
        <Column field="child_name" :header="$t('acc.child')" sortable />
        <Column field="owed" :header="$t('acc.owed')" sortable>
          <template #body="{ data }">{{ amount(data.owed) }}</template>
        </Column>
        <Column field="paid" :header="$t('acc.paid')" sortable>
          <template #body="{ data }"><span class="text-green-700">{{ amount(data.paid) }}</span></template>
        </Column>
        <Column field="remaining" :header="$t('acc.remaining')" sortable>
          <template #body="{ data }">{{ amount(data.remaining) }}</template>
        </Column>
        <Column field="late" :header="$t('acc.late')" sortable>
          <template #body="{ data }"><span :class="{ 'text-red-600 font-semibold': data.late > 0 }">{{ amount(data.late) }}</span></template>
        </Column>
        <Column field="next_due" :header="$t('acc.next_due')" sortable />
        <Column field="balance" :header="$t('acc.balance')" sortable>
          <template #body="{ data }">{{ data.balance ? amount(data.balance) : "" }}</template>
        </Column>
        <Column header-style="width:4rem">
          <template #body="{ data }">
            <Button icon="pi pi-file" size="small" rounded variant="outlined" :aria-label="$t('acc.statement')" v-tooltip.top="$t('acc.statement')" @click.stop="open(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
