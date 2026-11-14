<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { FilterMatchMode } from '@primevue/core/api';
import { ref, computed, onMounted, onBeforeMount } from "vue";
// import ProductService from '@/service/ProductService';
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import printPlugin from "vue3-print-nb";
import { workTypeLabel, WORK_TYPES } from "@/utils/employeeWorkTypes";
import { formatAgeRange } from "@/utils/ageRange";
import { can } from "@/utils/permissions";
const toast = useToast();
const router = useRouter();
const route = useRoute();
const allusers = ref([]);
const loading = ref(true);
const user = ref({});
const error = ref("");
const users = ref(null);
const deleteDialog = ref(false);
const confir_id = ref("");
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const createdialog = ref(false);
const levels = ref({});
const employee = ref({});
const updatedialog = ref(false);
const clockeddialog = ref(false);
const restdialog = ref(false);
// The employees' documents that expired or expire soon (HR settings: alert days), above the list.
const docAlerts = ref(null);
const docAlertsOpen = ref(false);
const openProfile = (row) => router.push({ name: "employee-profile", params: { id: row.user?.id ?? row.user_id } });
const loadDocAlerts = async () => {
  if (!can("employee documents list")) return;
  try {
    docAlerts.value = (await axios.get("api/employee-documents/alerts")).data;
  } catch {
    docAlerts.value = null;
  }
};
onMounted(loadDocAlerts);
const clocked_s = ref();
const id = ref("");
onBeforeMount(() => {
  initFilters();
});
const getallusers = () => {
  axios.post("/api/users").then((res) => {
    allusers.value = res.data.users.data;
  });
};
// Archived employees (deleted ones are archived) are listed apart, to restore one.
const showArchived = ref(false);
const fetchData = () => {
  loading.value = true;
  axios.get("/api/employees", { params: { archived: showArchived.value ? 1 : undefined } }).then((res) => {
    loading.value = false;
    users.value = res.data.data;
  });
};
const restore = (row) => {
  axios.post(`/api/employees/${row.id}/restore`).then(() => {
    toast.add({ severity: "success", summary: t('success_message'), detail: t('hremp.restored', { name: row.name }), life: 3000 });
    fetchData();
  }).catch((e) => {
    toast.add({ severity: "error", summary: t('error'), detail: e.response?.data?.message || t('mission_error'), life: 4000 });
  });
};

onMounted(() => {
  // Back from editing an employee: say it was saved, then drop the flag so a refresh does not repeat it.
  if (route.query.saved) {
    toast.add({ severity: "success", summary: t("success_message"), detail: t("emp.saved"), life: 3000 });
    router.replace({ query: { ...route.query, saved: undefined } });
  }
  // productService.getProducts().then((data) => (products.value = data));
  fetchData();
  getallusers();
});
const edit = (id) => {
  router.push({ name: "Employee-update", params: { id: id } });
};

const restData = (id) => {
  axios
    .get(`/api/employees/rest/${id}`, { action: "delete" })
    .then((res) => {
      console.log("Done", res.data);
      toast.add({
        severity: "success",
        summary: t('success_message'),
        detail: t("employees_reset_done"),
        life: 3000,
      });
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: "warn",
        summary: t("error"),
        detail: "can't rest the employees",
        life: 3000,
      });
    });
};

const status = (event, id) => {
  axios
    .get(`/api/employees`)
    .then((res) => {
      console.log("Done get api");

      let userIndex;
      let employee = res.data.data;
      employee.forEach((e, i) => {
        if (e.id == id) {
          userIndex = i;
          return;
        }
      });
      let clocked_in = res.data.data[userIndex].is_clocked_in;

      let btn;
      if (event.target.id == "stu") btn = event.target;
      if (event.target.id != "stu") btn = event.target.parentElement;

      if (!clocked_in) {  
        axios
          .post(`/api/attendance/dashboard/clock-in/${id}`)
          .then((res) => {
            btn.classList.remove("p-button-secondary");
            btn.classList.add("p-button-info");
            btn.children[0].classList.remove("pi-sign-out");
            btn.children[0].classList.add("pi-sign-in");
            toast.add({
              severity: "success",
              summary: t('success_message'),
              detail: t("employees_clocked_in"),
              life: 3000,
            });
            fetchData();
          })
          .catch((err) => {
            console.log("cann't clock in", err);
            toast.add({
              severity: "warn",
              summary: t("error"),
              detail: "can't login employees",
              life: 3000,
            });
          });
      }

      if (clocked_in) {
        axios
          .post(`/api/attendance/dashboard/clock-out/${id}`)
          .then((res) => {
            btn.classList.remove("p-button-info");
            btn.classList.add("p-button-secondary");
            btn.children[0].classList.remove("pi-sign-in");
            btn.children[0].classList.add("pi-sign-out");
            console.log("Done clock out");
            toast.add({
              severity: "success",
              summary: t('success_message'),
              detail: t("employees_clocked_out"),
              life: 3000,
            });
            fetchData();
          })
          .catch((err) => {
            console.log("cann't clock out", err);
            toast.add({
              severity: "warn",
              summary: t("error"),
              detail: "can't logout employees",
              life: 3000,
            });
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const openNew = () => {
  router.push({ name: "Employees-create" });
};

const confirmDelete = (id) => {
  console.log(id);
  deleteDialog.value = true;
  confir_id.value = id;
};

const createcrude = () => {
  axios
    .post("/api/employees/import/users", employee.value)
    .then((res) => {
      console.log(res.data);
      fetchData();
      createdialog.value = !createdialog.value;
      toast.add({
        severity: "success",
        summary: t('success_message'),
        detail: t('successful'),
        life: 3000,
      });
    })
    .catch((el) => {
      error.value = el.response.data.errors;
    });
};
const deleteAction = () => {
  axios
    .delete(`/api/employees/${confir_id.value}`)
    .then((res) => {
      console.log(res.data);
      deleteDialog.value = false;
      fetchData();
      toast.add({
        severity: "success",
        summary: t('success_message'),
        detail: t('hremp.archived'),
        life: 3000,
      });
    })
    .catch((e) => {
      toast.add({ severity: "error", summary: t('error'), detail: e.response?.data?.message || t('mission_error'), life: 4000 });
    });
};

// The role and age-range columns are searched, sorted and exported by their text.
const roleNames = (row) => (row.user?.roles ?? []).map((role) => role.name).join("، ");
const ageRange = (row) => (Number(row.user?.type) === 2 ? formatAgeRange(t, row.user?.age_from_months, row.user?.age_to_months) : "—");

// The filters above the table: built from the loaded employees, so each list holds only what is there.
// A department matches the main one or a linked one; "none" picks the employees with no value.
const NONE = "none";
const emptyPick = () => ({ department: null, position: null, role: null, workType: null, treatment: null, skill: null, shift: null, type: null, age: null });
const pick = ref(emptyPick());
const departmentsOf = (row) => {
  const list = [row.department, ...(row.user?.departments ?? [])].filter(Boolean);
  return [...new Map(list.map((d) => [d.id, d])).values()];
};
const distinct = (rows, get) => {
  const map = new Map();
  rows.forEach((row) => get(row).forEach((item) => item && map.set(item.id, item.title ?? item.name)));
  return [...map].map(([value, label]) => ({ value, label })).sort((a, b) => String(a.label).localeCompare(String(b.label), "ar"));
};
const withNone = (options) => [{ value: NONE, label: t("hremp.none") }, ...options];
const filterOptions = computed(() => {
  const rows = users.value ?? [];
  return {
    department: withNone(distinct(rows, departmentsOf)),
    position: withNone(distinct(rows, (r) => [r.position])),
    role: withNone(distinct(rows, (r) => r.user?.roles ?? [])),
    workType: withNone(WORK_TYPES.map((type) => ({ value: type, label: workTypeLabel(t, type) }))),
    treatment: withNone(distinct(rows, (r) => r.user?.treatments ?? [])),
    skill: withNone(distinct(rows, (r) => r.user?.skills ?? [])),
    shift: withNone(distinct(rows, (r) => [r.shift])),
    type: [{ value: "therapist", label: t("hremp.type_therapist") }, { value: "staff", label: t("hremp.type_staff") }],
  };
});
// Whether the row's ids match the picked value ("none": it has none).
const matches = (picked, ids) => picked === null || (picked === NONE ? ids.length === 0 : ids.includes(picked));
const coversAge = (row, years) => {
  if (Number(row.user?.type) !== 2) return false;
  const months = years * 12;
  const from = row.user?.age_from_months, to = row.user?.age_to_months;
  return (from == null || months >= from) && (to == null || months <= to);
};
const filteredUsers = computed(() => {
  const p = pick.value;
  return (users.value ?? []).filter((row) =>
    matches(p.department, departmentsOf(row).map((d) => d.id))
    && matches(p.position, row.position ? [row.position.id] : [])
    && matches(p.role, (row.user?.roles ?? []).map((r) => r.id))
    && matches(p.workType, row.work_types ?? [])
    && matches(p.treatment, (row.user?.treatments ?? []).map((r) => r.id))
    && matches(p.skill, (row.user?.skills ?? []).map((r) => r.id))
    && matches(p.shift, row.shift ? [row.shift.id] : [])
    && (p.type === null || (p.type === "therapist") === (Number(row.user?.type) === 2))
    && (p.age === null || coversAge(row, p.age)));
});
const activeFilters = computed(() => Object.values(pick.value).filter((v) => v !== null).length);
const clearFilters = () => {
  pick.value = emptyPick();
};
const departmentNames = (row) => departmentsOf(row).map((d) => d.title).join("، ");

const exportCSV = () => {
  dt.value.exportCSV();
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ $t("Employees") }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button v-can="'employees create'" :label="$t('create_button')" icon="pi pi-plus"
                class="mr-2 no-print" @click="openNew" />
              <Button v-can="'employees list'" :label="$t('export')" icon="pi pi-download"
                class="no-print" @click="exportCSV" severity="info" />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <Message v-if="docAlerts && (docAlerts.counts.expired || docAlerts.counts.expiring)" severity="warn" :closable="false" class="mb-3 no-print">
          <div class="flex flex-wrap items-center justify-between gap-2 w-full">
            <span class="flex flex-wrap items-center gap-2">
              {{ $t("prof.doc_alerts") }}
              <Tag v-if="docAlerts.counts.expired" severity="danger" :value="$t('prof.docs_expired', { n: docAlerts.counts.expired })" />
              <Tag v-if="docAlerts.counts.expiring" severity="warn" :value="$t('prof.docs_expiring', { n: docAlerts.counts.expiring })" />
            </span>
            <Button :label="$t('prof.show')" size="small" text @click="docAlertsOpen = true" />
          </div>
        </Message>
        <Dialog v-model:visible="docAlertsOpen" modal :header="$t('prof.doc_alerts_title')" :style="{ width: '620px' }" :breakpoints="{ '660px': '95vw' }">
          <DataTable :value="docAlerts?.data ?? []" size="small" stripedRows>
            <Column :header="$t('prof.employee')">
              <template #body="{ data }">
                <Button :label="data.employee?.name" link class="p-0" @click="router.push({ name: 'employee-profile', params: { id: data.employee.user_id }, query: { tab: 'documents' } })" />
              </template>
            </Column>
            <Column field="title" :header="$t('edoc.document')" />
            <Column :header="$t('edoc.expiry_date')">
              <template #body="{ data }">
                <bdi dir="ltr">{{ data.expiry_date }}</bdi>
                <Tag class="ms-2" :severity="data.alert === 'expired' ? 'danger' : 'warn'" :value="$t(data.alert === 'expired' ? 'edoc.expired' : 'edoc.expiring')" />
              </template>
            </Column>
          </DataTable>
        </Dialog>

        <div class="card shadow-1 surface-0">
          <DataTable ref="dt" v-model:selection="selectedProducts" :value="filteredUsers" :loading="loading" data-key="id"
            :paginator="true" :rows="10" :filters="filters"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 25, 50, 100]"
            :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
            responsive-layout="scroll" scrollable scroll-height="flex" v-can="'employees list'" stripedRows
            showGridlines class="p-datatable-sm">
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <div class="flex gap-2">
                  <IconField class="table-search">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder="$t('search')" class="w-full" />
              </IconField>
                  <Button icon="pi pi-refresh" @click="fetchData"
                    v-tooltip.top="$t('refresh')" :aria-label="$t('refresh')" variant="text" />
                  <div v-if="$can('employees delete')" class="flex items-center gap-2">
                    <ToggleSwitch v-model="showArchived" inputId="emp-archived" @update:modelValue="fetchData" />
                    <label for="emp-archived">{{ $t('hremp.show_archived') }}</label>
                  </div>
                </div>
              </div>
              <div class="emp-filters no-print">
                <Select v-for="key in ['department', 'position', 'role', 'workType', 'treatment', 'skill', 'shift', 'type']" :key="key"
                  v-model="pick[key]" :options="filterOptions[key]" optionLabel="label" optionValue="value"
                  :placeholder="$t(`hremp.f_${key === 'workType' ? 'work_type' : key}`)" showClear
                  :filter="filterOptions[key].length > 8" size="small" class="emp-filter" />
                <InputNumber v-model="pick.age" :min="0" :max="18" :maxFractionDigits="1" :placeholder="$t('hremp.f_age')"
                  showButtons size="small" class="emp-filter" inputClass="w-full" />
                <Button v-if="activeFilters" :label="$t('hremp.clear')" icon="pi pi-filter-slash" size="small" text @click="clearFilters" />
                <span class="text-sm text-color-secondary ms-auto">{{ $t('hremp.count', { n: filteredUsers.length, total: users?.length ?? 0 }) }}</span>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="name" :header="$t('name')" :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.name }}</span>
                <!-- An archived employee whose service ended is a former employee. -->
                <Tag v-if="slotProps.data.deleted_at" :severity="slotProps.data.service_end ? 'warn' : 'secondary'" class="ms-2"
                  :icon="slotProps.data.service_end ? 'pi pi-sign-out' : 'pi pi-box'"
                  :value="slotProps.data.service_end ? $t('hremp.former', { date: slotProps.data.service_end.last_day }) : $t('prof.archived')" />
              </template>
            </Column>

            <Column field="email" :header="$t('email')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.email }}
              </template>
            </Column>


            <Column :field="departmentNames" :header="$t('hremp.f_department')" :sortable="true">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-1">
                  <Tag v-for="d in departmentsOf(data)" :key="d.id" :value="d.title" :severity="d.id === data.department?.id ? 'success' : 'secondary'" class="whitespace-nowrap" />
                  <span v-if="!departmentsOf(data).length" class="text-color-secondary">—</span>
                </div>
              </template>
            </Column>

            <Column field="position.title" :header="$t('hremp.f_position')" :sortable="true">
              <template #body="{ data }">{{ data.position?.title || "—" }}</template>
            </Column>

            <Column field="shift.title" :header="$t('shift_title')" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.shift?.title || 'N/A'" severity="info" />
              </template>
            </Column>

            <Column field="work_types" :header="$t('employee_treatment_kind')">
              <template #body="slotProps">
                <div class="flex flex-wrap gap-1">
                  <Tag v-for="type in slotProps.data.work_types ?? []" :key="type" :value="workTypeLabel(t, type)" severity="secondary" class="whitespace-nowrap" />
                  <span v-if="!slotProps.data.work_types?.length" class="text-color-secondary">—</span>
                </div>
              </template>
            </Column>

            <Column :field="roleNames" :header="$t('employee_role')" :sortable="true">
              <template #body="slotProps">
                <div class="flex flex-wrap gap-1">
                  <Tag v-for="role in slotProps.data.user?.roles ?? []" :key="role.id" :value="role.name" severity="info" class="whitespace-nowrap" />
                  <span v-if="!slotProps.data.user?.roles?.length" class="text-color-secondary">—</span>
                </div>
              </template>
            </Column>

            <!-- The age range a therapist works with (only therapists have one). -->
            <Column :field="ageRange" :header="$t('age_ranges.label')">
              <template #body="slotProps">
                <span class="whitespace-nowrap">{{ ageRange(slotProps.data) }}</span>
              </template>
            </Column>

            <Column header-style="min-width:10rem;" class="no-print">
              <template #body="slotProps">
                <div v-if="slotProps.data.deleted_at" class="table-actions">
                  <Button icon="pi pi-id-card" @click="openProfile(slotProps.data)" v-tooltip.top="$t('prof.title')" :aria-label="$t('prof.title')" rounded severity="secondary" variant="outlined" />
                  <Button v-can="'employees delete'" icon="pi pi-replay" :label="$t('hremp.restore')" size="small"
                    @click="restore(slotProps.data)" severity="success" variant="outlined" />
                </div>
                <div v-else class="table-actions">
                  <Button icon="pi pi-id-card" @click="openProfile(slotProps.data)" v-tooltip.top="$t('prof.title')" :aria-label="$t('prof.title')" rounded severity="secondary" variant="outlined" />
                  <Button v-can="['employees edit', 'employee specialty edit']" icon="pi pi-pencil"
                    @click="edit(slotProps.data.user.id)" v-tooltip.top="$t('edit')" rounded severity="info" variant="outlined" />
                  <Button v-can="'employees delete'" icon="pi pi-trash"
                    @click="confirmDelete(slotProps.data.id)" v-tooltip.top="$t('delete')" rounded severity="danger" variant="outlined" />
                  <Button v-can="'employees edit'" icon="pi pi-wrench" @click="
                    restdialog = true;
                  id = slotProps.data.id;
                  " v-tooltip.top="$t('Rest')" rounded severity="help" variant="outlined" />
                  <Button v-can="'attendance edit'" :class="slotProps.data.is_clocked_in
                      ? 'p-button-secondary'
                      : 'p-button-info'
                    " :icon="slotProps.data.is_clocked_in
                        ? 'pi pi-sign-out'
                        : 'pi pi-sign-in'
                      " @click="
                      clockeddialog = true;
                    id = slotProps.data.id;
                    clocked_s = slotProps.data.is_clocked_in;
                    " v-tooltip.top="slotProps.data.is_clocked_in
                        ? $t('clockOut')
                        : $t('clockIn')
                      " id="stu" rounded />
                </div>
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">{{ $t("no_data_found") }}</p>
              </div>
            </template>

            <template #loading>
              <div class="flex justify-content-center align-items-center py-4">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
              </div>
            </template>
          </DataTable>
        </div>

        <!-- Dialogs remain the same as in your original code -->
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="$t('confirm')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>{{ $t("hremp.archive_confirm") }}</span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" @click="deleteDialog = false" variant="text" severity="secondary" />
            <Button :label="$t('yes')" icon="pi pi-check" @click="deleteAction" severity="danger" />
          </template>
        </Dialog>

        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header="$t('create_employee')"
          :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-start" for="username">{{
              $t("users")
            }}</label>
            <MultiSelect v-model="employee.users_ids" required
              option-value="id" filter :options="allusers" optionLabel="name" :placeholder="$t('users')"
              class="w-full" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.name">
              {{ error.name[0] }}
            </div>
          </div>
          <div class="w-full text-center">
            <Button @click="createcrude" class="m-auto w-[50%] my-4" :label="$t('submit')" severity="success"></Button>
          </div>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header="$t('update_employee')"
          :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-start" for="username">{{
              $t("title")
            }}</label>
            <InputText required class="text-center" v-model="levels.title" :placeholder="$t('title')" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.title">
              {{ error.name[0] }}
            </div>
          </div>
          <div class="w-full text-center">
            <Button @click="editescrud" class="m-auto w-[50%] my-4" :label="$t('submit')" severity="success"></Button>
          </div>
        </Dialog>
        <!-- clockin & clockout Dialog -->
        <Dialog v-model:visible="clockeddialog" :style="{ width: '450px' }" :header="$t('confirm')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span v-if="user">
              {{ clocked_s ? $t("clocked_out") : $t("clocked_in") }}
              <b>{{ user.first_name }}</b>?
            </span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" @click="clockeddialog = false" variant="text" severity="secondary" />
            <Button :label="$t('yes')" icon="pi pi-check" @click="
              clockeddialog = false;
            status($event, id);
            " severity="danger" />
          </template>
        </Dialog>
        <!-- Rest Dialog -->
        <Dialog v-model:visible="restdialog" :style="{ width: '450px' }" :header="$t('confirm')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span v-if="user">
              {{ $t("sure") }}
            </span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" @click="restdialog = false" variant="text" severity="secondary" />
            <Button :label="$t('yes')" icon="pi pi-check" @click="
              restdialog = false;
            restData($event, id);
            " severity="danger" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emp-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.emp-filter {
  width: 11rem;
  max-width: 100%;
}

/* Custom styles for better table display */
:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0px;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f0f4f8 !important;
}

/* Responsive adjustments */
@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}

/* Print-specific styles */
@media print {
  .no-print {
    display: none !important;
  }

  :deep(.p-datatable) {
    font-size: 2pt;
    width: 100%;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0px 0px;
  }
}

/* Button spacing in action column */
:deep(.p-button) {
  margin: 0rem;
}
</style>
