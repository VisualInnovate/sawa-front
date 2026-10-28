<script setup>
// «الساعات الإضافية»: the requests employees send from the app, and the overtime amounts the payroll pays.
// Accepting a request prices it at the hourly salary and approves the amount; amounts computed from
// attendance arrive pending. Approved, unpaid amounts go into the next payroll.
import { ref, computed, onMounted } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";
import axios from "axios";
import PayrollItemStatus from "@/components/hr/PayrollItemStatus.vue";
import { can } from "@/utils/permissions";

const toast = useToast();
const { t } = useI18n();

const tab = ref("requests");
const requests = ref([]);
const amounts = ref([]);
const loading = ref(false);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

const amountDialog = ref(false);
const editing = ref({});
const saving = ref(false);

const failed = (e) =>
  toast.add({ severity: "error", summary: t("error"), detail: e.response?.data?.message || t("mission_error"), life: 4000 });
const done = () => toast.add({ severity: "success", summary: t("success_message"), detail: t("successful"), life: 2500 });

const fetchData = () => {
  loading.value = true;
  Promise.all([axios.get("/api/overtime-request"), axios.get("/api/overtime")])
    .then(([req, amt]) => {
      requests.value = req.data.data ?? [];
      amounts.value = amt.data.data ?? [];
    })
    .catch(failed)
    .finally(() => (loading.value = false));
};
onMounted(fetchData);

const hoursOf = (r) => {
  if (!r.start_time || !r.end_time) return "";
  const [h1, m1] = r.start_time.split(":").map(Number);
  const [h2, m2] = r.end_time.split(":").map(Number);
  return (Math.round(((h2 * 60 + m2 - (h1 * 60 + m1)) / 60) * 100) / 100).toString();
};
const requestStatus = (s) =>
  s == 1 ? { value: t("Accept"), severity: "success" } : s == -1 ? { value: t("Cancell"), severity: "danger" } : { value: t("Pending"), severity: "warn" };

const decide = (row, status) =>
  axios
    .get(`/api/overtime-request/change-status/${row.id}`, { params: { status } })
    .then(() => { done(); fetchData(); })
    .catch(failed);

const removeRequest = (row) => axios.delete(`/api/overtime-request/${row.id}`).then(() => { done(); fetchData(); }).catch(failed);

const setAmountStatus = (row, status) =>
  axios
    .get(`/api/overtime/change-status/${row.id}`, { params: { status } })
    .then(fetchData)
    .catch((e) => { failed(e); fetchData(); });

const openAmount = (row) => {
  editing.value = { id: row.id, employee_id: row.employee_id, name: row.employee?.name, amount: row.amount, notes: row.notes };
  amountDialog.value = true;
};
const saveAmount = () => {
  saving.value = true;
  axios
    .put(`/api/overtime/${editing.value.id}`, editing.value)
    .then(() => { amountDialog.value = false; done(); fetchData(); })
    .catch(failed)
    .finally(() => (saving.value = false));
};
const removeAmount = (row) => axios.delete(`/api/overtime/${row.id}`).then(() => { done(); fetchData(); }).catch(failed);

const pendingRequests = computed(() => requests.value.filter((r) => r.status == 0).length);
const pendingAmounts = computed(() => amounts.value.filter((r) => r.status == 0 && !r.payroll_id).length);
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ t("hrpay.overtime") }}</h2>
          </template>
          <template #end>
            <Button icon="pi pi-refresh" variant="text" :loading="loading" v-tooltip.top="t('refresh_data')" @click="fetchData" />
          </template>
        </Toolbar>
        <Toast />

        <Tabs v-model:value="tab">
          <TabList>
            <Tab value="requests">
              {{ t("hrpay.requests") }}
              <Badge v-if="pendingRequests" :value="pendingRequests" severity="warn" class="ms-2" />
            </Tab>
            <Tab value="amounts">
              {{ t("hrpay.amounts") }}
              <Badge v-if="pendingAmounts" :value="pendingAmounts" severity="warn" class="ms-2" />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="requests">
              <p class="text-muted-color mb-3">{{ t("hrpay.requests_hint") }}</p>
              <DataTable :value="requests" :loading="loading" data-key="id" paginator :rows="10" :filters="filters"
                :global-filter-fields="['employee.name', 'date', 'description']" striped-rows show-gridlines
                class="p-datatable-sm" responsive-layout="scroll">
                <template #header>
                  <IconField class="table-search">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="filters.global.value" :placeholder="t('search')" />
                  </IconField>
                </template>
                <template #empty>{{ t("no_data_found") }}</template>
                <Column field="employee.name" :header="t('Employees')" sortable>
                  <template #body="{ data }"><span class="font-medium">{{ data.employee?.name }}</span></template>
                </Column>
                <Column field="date" :header="t('Date')" sortable />
                <Column :header="t('hrpay.from')"><template #body="{ data }">{{ data.start_time?.slice(0, 5) }}</template></Column>
                <Column :header="t('hrpay.to')"><template #body="{ data }">{{ data.end_time?.slice(0, 5) }}</template></Column>
                <Column :header="t('hrpay.hours')"><template #body="{ data }">{{ hoursOf(data) }}</template></Column>
                <Column field="description" :header="t('hrpay.description')">
                  <template #body="{ data }">{{ data.description || "--" }}</template>
                </Column>
                <Column field="status" :header="t('status')" sortable>
                  <template #body="{ data }"><Tag v-bind="requestStatus(data.status)" /></template>
                </Column>
                <Column header-style="min-width:12rem;">
                  <template #body="{ data }">
                    <div class="table-actions">
                      <template v-if="data.status == 0 && can('overtime edit')">
                        <Button icon="pi pi-check" rounded variant="outlined" severity="success" v-tooltip.top="t('hrpay.approve')" :aria-label="t('hrpay.approve')" @click="decide(data, 1)" />
                        <Button icon="pi pi-times" rounded variant="outlined" severity="warn" v-tooltip.top="t('hrpay.reject')" :aria-label="t('hrpay.reject')" @click="decide(data, -1)" />
                      </template>
                      <Button v-if="can('overtime delete')" icon="pi pi-trash" rounded variant="outlined" severity="danger"
                        v-tooltip.top="t('delete')" :aria-label="t('delete')" @click="removeRequest(data)" />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>

            <TabPanel value="amounts">
              <p class="text-muted-color mb-3">{{ t("hrpay.amounts_hint") }}</p>
              <DataTable :value="amounts" :loading="loading" data-key="id" paginator :rows="10" :filters="filters"
                :global-filter-fields="['employee.name', 'date', 'notes']" striped-rows show-gridlines
                class="p-datatable-sm" responsive-layout="scroll">
                <template #header>
                  <IconField class="table-search">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="filters.global.value" :placeholder="t('search')" />
                  </IconField>
                </template>
                <template #empty>{{ t("no_data_found") }}</template>
                <Column field="employee.name" :header="t('Employees')" sortable>
                  <template #body="{ data }"><span class="font-medium">{{ data.employee?.name }}</span></template>
                </Column>
                <Column field="date" :header="t('Date')" sortable />
                <Column field="amount" :header="t('hrpay.amount')" sortable>
                  <template #body="{ data }">{{ data.amount ?? "--" }}</template>
                </Column>
                <Column field="notes" :header="t('hrpay.notes')">
                  <template #body="{ data }">{{ data.notes || "--" }}</template>
                </Column>
                <Column field="status" :header="t('status')" sortable header-style="min-width:10rem;">
                  <template #body="{ data }">
                    <PayrollItemStatus :item="data" :can-edit="can('overtime edit')" @change="setAmountStatus(data, $event)" />
                  </template>
                </Column>
                <Column header-style="min-width:8rem;">
                  <template #body="{ data }">
                    <div v-if="!data.payroll_id" class="table-actions">
                      <Button v-if="can('overtime edit')" icon="pi pi-pencil" rounded variant="outlined" severity="info"
                        v-tooltip.top="t('hrpay.edit_amount')" :aria-label="t('hrpay.edit_amount')" @click="openAmount(data)" />
                      <Button v-if="can('overtime delete')" icon="pi pi-trash" rounded variant="outlined" severity="danger"
                        v-tooltip.top="t('delete')" :aria-label="t('delete')" @click="removeAmount(data)" />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Dialog v-model:visible="amountDialog" :header="t('hrpay.edit_amount')" modal :style="{ width: '420px' }">
          <div class="flex flex-column gap-3">
            <div class="font-medium">{{ editing.name }}</div>
            <label for="ot-amount">{{ t("hrpay.amount") }}</label>
            <InputNumber input-id="ot-amount" v-model="editing.amount" :min="0" :max-fraction-digits="2" class="w-full" />
            <label for="ot-notes">{{ t("hrpay.notes") }}</label>
            <InputText id="ot-notes" v-model="editing.notes" class="w-full" />
          </div>
          <template #footer>
            <Button :label="t('cancel')" variant="text" severity="secondary" @click="amountDialog = false" />
            <Button :label="t('save')" icon="pi pi-check" :loading="saving" :disabled="editing.amount == null" @click="saveAmount" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
