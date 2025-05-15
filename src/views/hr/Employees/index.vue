<script setup>
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted, onBeforeMount } from "vue";
// import ProductService from '@/service/ProductService';
import { useToast } from "primevue/usetoast";
import axios from "axios";
import { useRouter } from "vue-router";
import t from "vue3-print-nb";
const toast = useToast();
const router = useRouter();
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
const fetchData = () => {
  loading.value = true;
  axios.get("/api/employees").then((res) => {
    loading.value = false;
    users.value = res.data.data;
    console.log(users.value);
  });
};

onMounted(() => {
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
        summary: "Successful",
        detail: "Successful rest the employees",
        life: 3000,
      });
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: "warn",
        summary: "Error",
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
              summary: "Successful",
              detail: "Successful login employees",
              life: 3000,
            });
            fetchData();
          })
          .catch((err) => {
            console.log("cann't clock in", err);
            toast.add({
              severity: "warn",
              summary: "Error",
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
              summary: "Successful",
              detail: "Successful logout employees",
              life: 3000,
            });
            fetchData();
          })
          .catch((err) => {
            console.log("cann't clock out", err);
            toast.add({
              severity: "warn",
              summary: "Error",
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
        summary: "Successful",
        detail: "Successful",
        life: 3000,
      });
      skill.value = ref({});
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
        summary: "Successful",
        detail: "Successful",
        life: 3000,
      });
    })
    .catch(() => { });
};

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
                class="p-button-success mr-2 no-print" @click="openNew" />
              <Button v-can="'employees list'" :label="$t('export')" icon="pi pi-download"
                class="p-button-info no-print" @click="exportCSV" />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable ref="dt" v-model:selection="selectedProducts" :value="users" :loading="loading" data-key="id"
            :paginator="true" :rows="10" :filters="filters"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 25, 50, 100]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} records"
            responsive-layout="scroll" scrollable scroll-height="flex" v-can="'employees list'" stripedRows
            showGridlines class="p-datatable-sm">
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" :placeholder="$t('search')" class="w-full" />
                  </span>
                  <Button icon="pi pi-refresh" class="p-button-text" @click="fetchData"
                    v-tooltip.top="'Refresh data'" />
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="name" :header="$t('name')" :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.name }}</span>
              </template>
            </Column>

            <Column field="email" :header="$t('email')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.email }}
              </template>
            </Column>

            <Column field="basic_salary" :header="$t('basic_salary')" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.basic_salary }}
              </template>
            </Column>

            <Column field="shift.title" :header="$t('shift_title')" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.shift?.title || 'N/A'" severity="info" />
              </template>
            </Column>

            <Column header-style="min-width:10rem;" class="no-print">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button v-can="'employees edit'" icon="pi pi-pencil" class="p-button-rounded p-button-success"
                    @click="edit(slotProps.data.user.id)" v-tooltip.top="$t('edit')" />
                  <Button v-can="'employees delete'" icon="pi pi-trash" class="p-button-rounded p-button-danger"
                    @click="confirmDelete(slotProps.data.id)" v-tooltip.top="$t('delete')" />
                  <Button icon="pi pi-wrench" class="p-button-rounded p-button-help" @click="
                    restdialog = true;
                  id = slotProps.data.id;
                  " v-tooltip.top="$t('Rest')" />
                  <Button v-can="'employees edit'" class="p-button-rounded" :class="slotProps.data.is_clocked_in
                      ? 'p-button-info'
                      : 'p-button-secondary'
                    " :icon="slotProps.data.is_clocked_in
                        ? 'pi pi-sign-in'
                        : 'pi pi-sign-out'
                      " @click="
                      clockeddialog = true;
                    id = slotProps.data.id;
                    clocked_s = slotProps.data.is_clocked_in;
                    " v-tooltip.top="slotProps.data.is_clocked_in
                        ? $t('clockIn')
                        : $t('clockOut')
                      " id="stu" />
                </div>
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">No records found</p>
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
            <span v-if="user">
              {{ $t("remove_item") }} <b>{{ user.first_name }}</b>?
            </span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label="$t('yes')" icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>

        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header="$t('create_employee')"
          :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{
              $t("users")
            }}</label>
            <MultiSelect v-model="employee.users_ids" required id="pv_id_1" style="direction: ltr !important"
              option-value="id" filter :options="allusers" optionLabel="name" :placeholder="$t('users')"
              class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.name">
              {{ error.name[0] }}
            </div>
          </div>
          <div class="w-full text-center">
            <Button @click="createcrude" class="p-button-success m-auto w-[50%] my-4" :label="$t('submit')"></Button>
          </div>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header="$t('update_employee')"
          :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{
              $t("title")
            }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.title" :placeholder="$t('title')" />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.title">
              {{ error.name[0] }}
            </div>
          </div>
          <div class="w-full text-center">
            <Button @click="editescrud" class="p-button-success m-auto w-[50%] my-4" :label="$t('submit')"></Button>
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
            <Button :label="$t('no')" icon="pi pi-times" class="p-button-text" @click="clockeddialog = false" />
            <Button :label="$t('yes')" icon="pi pi-check" class="p-button-text p-button-danger" @click="
              clockeddialog = false;
            status($event, id);
            " />
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
            <Button :label="$t('no')" icon="pi pi-times" class="p-button-text" @click="restdialog = false" />
            <Button :label="$t('yes')" icon="pi pi-check" class="p-button-text p-button-danger" @click="
              restdialog = false;
            restData($event, id);
            " />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
