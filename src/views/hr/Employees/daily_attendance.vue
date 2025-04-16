<script setup>
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from "axios";
import { useRouter } from "vue-router";

const toast = useToast()
const router = useRouter()
const allusers = ref([])
const loading = ref(true)
const user = ref({})
const error = ref('')
const users = ref(null)
const deleteDialog = ref(false)
const confir_id = ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog = ref(false)
const levels = ref({})
const employee = ref({})
const updatedialog = ref(false)
const exportLoading = ref(false)
const printLoading = ref(false)

onBeforeMount(() => {
  initFilters()
})

const getallusers = () => {
  axios.post("/api/users").then((res) => {  
    allusers.value = res.data.users.data
  });
}

const fetchData = () => {
  loading.value = true
  axios.get(`/api/employees/get/today/clockIn`).then((res) => {
    loading.value = false
    users.value = res.data.data
    console.log(users.value)
  }).catch(() => {
    loading.value = false
    toast.add({severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000})
  });
}

onMounted(() => {
  fetchData()
  getallusers()
})

const edit = (id) => {
  router.push({name: 'Employee-update', params: {'id': id} })
}

const openNew = () => {
  router.push({name: 'Employees-create'})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value = id
}

const createcrude = () => {
  axios
    .post('/api/employees/import/users', employee.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value = !(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      skill.value = ref({})
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const deleteAction = () => {
  axios
    .delete(`/api/employees/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value = false
      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
    })
    .catch(() => {})
}

const exportCSV = () => {
  exportLoading.value = true
  dt.value.exportCSV()
  setTimeout(() => {
    exportLoading.value = false
  }, 1000)
}

const printTable = () => {
  printLoading.value = true
  const printContents = document.querySelector('.p-datatable-wrapper').cloneNode(true)
  const originalContents = document.body.innerHTML
  
  // Remove action buttons from print
  const actionButtons = printContents.querySelectorAll('.p-button')
  actionButtons.forEach(button => button.remove())
  
  // Create print window
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Employee Clock-In Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f5; text-align: left; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          @page { size: auto; margin: 5mm; }
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <h1>Employee Clock-In Report</h1>
        ${printContents.innerHTML}
        <div style="text-align: center; margin-top: 20px; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
    printLoading.value = false
  }, 500)
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ $t("تقرير الحضور اليومي ") }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button 
                :label='$t("print")' 
                icon="pi pi-print" 
                class="p-button-help no-print" 
                :loading="printLoading"
                @click="printTable"
              />
              <Button 
                v-can="'employees list'" 
                :label='$t("export")' 
                icon="pi pi-download" 
                class="p-button-info no-print" 
                :loading="exportLoading"
                @click="exportCSV"
              />
            </div>
          </template>
        </Toolbar>

        <Toast />

        <div class="card shadow-1 surface-0">
          <DataTable
            ref="dt"
            v-model:selection="selectedProducts"
            :value="users"
            :loading="loading"
            data-key="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rows-per-page-options="[5, 10, 25, 50, 100]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} records"
            responsive-layout="scroll"
            scrollable
            scroll-height="flex"
            v-can="'employees list'"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText 
                      v-model="filters['global'].value" 
                      :placeholder='$t("search")' 
                      class="w-full"
                    />
                  </span>
                  <Button 
                    icon="pi pi-refresh" 
                    class="p-button-text" 
                    @click="fetchData" 
                    v-tooltip.top="'Refresh data'"
                  />
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>
            
            <Column field="employee.name" :header='$t("Employee")' :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.employee?.name || 'N/A' }}</span>
              </template>
            </Column>
            
            <Column field="date" :header='$t("Date")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.date }}
              </template>
            </Column>
            
            <Column field="clock_in" :header='$t("Clock In")' :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.clock_in" :severity="slotProps.data.late > 0 ? 'danger' : 'success'" />
              </template>
            </Column>
            
            <Column field="clock_out" :header='$t("Clock Out")' :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.clock_out || '--:--:--'" 
                     :severity="slotProps.data.clock_out ? (slotProps.data.early_leave > 0 ? 'warning' : 'info') : 'danger'" />
              </template>
            </Column>
            
            <Column field="status" :header='$t("Status")' :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.status" 
                     :severity="{
                       'clocked_in': 'info',
                       'attend': 'success',
                       'absent': 'danger'
                     }[slotProps.data.status] || 'warning'" />
              </template>
            </Column>
            
            <Column field="working_hours" :header='$t("Hours")' :sortable="true">
              <template #body="slotProps">
                <span v-if="slotProps.data.working_hours !== null">
                  {{ slotProps.data.working_hours.toFixed(2) }}h
                </span>
                <span v-else>--</span>
              </template>
            </Column>
            
            <Column field="late" :header='$t("Late (h)")' :sortable="true">
              <template #body="slotProps">
                <span v-if="slotProps.data.late > 0" class="text-red-500 font-medium">
                  {{ slotProps.data.late.toFixed(2) }}
                </span>
                <span v-else>0</span>
              </template>
            </Column>
            
            <Column field="early_leave" :header='$t("Early Leave (h)")' :sortable="true">
              <template #body="slotProps">
                <span v-if="slotProps.data.early_leave > 0" class="text-orange-500 font-medium">
                  {{ slotProps.data.early_leave.toFixed(2) }}
                </span>
                <span v-else-if="slotProps.data.early_leave === null">--</span>
                <span v-else>0</span>
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

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("confirm")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span v-if="user">
              {{ $t('remove_item') }} <b>{{ user.first_name }}</b>?
            </span>
          </div>
          <template #footer>
            <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>

        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("create_employee")' :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{ $t('users') }}</label>
            <MultiSelect 
              v-model="employee.users_ids"  
              required 
              id="pv_id_1" 
              style="direction: ltr !important;"  
              option-value="id" 
              filter 
              :options="allusers" 
              optionLabel="name" 
              :placeholder='$t("users")' 
              class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem" 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
          </div>
          <div class="w-full text-center">
            <Button @click="createcrude" class="p-button-success m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
          </div>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("update_employee")' :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-right" for="username">{{ $t('title') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.title" :placeholder='$t("title")' />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.name[0] }}</div>
          </div>
          <div class="w-full text-center">
            <Button @click="editescrud" class="p-button-success m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
          </div>
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
  letter-spacing: 0.5px;
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
    font-size: 10pt;
    width: 100%;
  }
  
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 4px 6px;
  }
}
</style>