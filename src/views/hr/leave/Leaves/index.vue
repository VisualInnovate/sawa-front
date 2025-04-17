<script setup>
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount } from 'vue'
import LeavesNave from '../../../../components/LeavesNave.vue'
import { useToast } from 'primevue/usetoast'
import axios from "axios"
import { useRouter } from "vue-router"

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
const updatedialog = ref(false)
const leave = ref({})
const exportLoading = ref(false)
const printLoading = ref(false)

onBeforeMount(() => {
  initFilters()
})

const getallusers = () => {
  axios.post("/api/users").then((res) => {  
    allusers.value = res.data.users.data
  })
}

const fetchData = () => {
  loading.value = true
  axios.get("/api/leaves").then((res) => {
    loading.value = false
    users.value = res.data.data
  })
}

onMounted(() => {
  fetchData()
  getallusers()
})

const reject = (id) => {
  confir_id.value = id
  updatedialog.value = !(updatedialog.value)
}

const go = () => {
  router.push({ name: 'leave-setup' })
}

const got = () => {
  router.push({ name: 'leave-balance' })
}

const confirm_reject = () => {
  axios
    .post(`/api/leaves/reject-request/${confir_id.value}`, leave.value)
    .then((res) => {
      fetchData()
      updatedialog.value = !(updatedialog.value)
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000 })
      leave.value = ref({})
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const confirmDelete = (id) => {
  deleteDialog.value = true
  confir_id.value = id
}

const accept = (id) => {
  loading.value = true
  axios
    .get(`/api/leaves/accept-request/${id}`)
    .then((res) => {
      loading.value = false
      fetchData()
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000 })
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
  
  // Remove action buttons from print
  const actionButtons = printContents.querySelectorAll('.p-button')
  actionButtons.forEach(button => button.remove())
  
  // Create print window
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Leaves Report</title>
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
        <h1>Leaves Report</h1>
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
       

        <LeavesNave></LeavesNave>
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
            v-can="'leaves list'"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <h3 class="m-0">{{ $t("Leaves List") }}</h3>
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
                v-can="'leaves list'" 
                :label='$t("export")' 
                icon="pi pi-download" 
                class="p-button-info no-print" 
                :loading="exportLoading"
                @click="exportCSV"
              />
              <Button 
                :label='$t("print")' 
                icon="pi pi-print" 
                class="p-button-help no-print" 
                :loading="printLoading"
                @click="printTable"
              />
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
            
            <Column field="employee.name" :header='$t("Employee Name")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.employee.name }}
              </template>
            </Column>
            
            <Column field="reason" :header='$t("Request Reason")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.reason }}
              </template>
            </Column>
            
            <Column field="leave_setup.title" :header='$t("Leave Type")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.leave_setup.title }}
              </template>
            </Column>
            
            <Column field="status" :header='$t("Status")' :sortable="true">
              <template #body="slotProps">
                <Tag 
                  :value="slotProps.data.status == 0 ? 'Pending' : slotProps.data.status == 1 ? 'Accepted' : 'Rejected'"
                  :severity="slotProps.data.status == 0 ? 'warning' : slotProps.data.status == 1 ? 'success' : 'danger'"
                />
              </template>
            </Column>
            
            <Column :exportable="false" header-style="width: 10rem" body-class="text-center">
              <template #body="slotProps">
                <div class="flex gap-1 justify-content-center">
                  <Button 
                    v-if="slotProps.data.status == 0"
                    v-can="'leaves edit'"
                    icon="pi pi-times" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="reject(slotProps.data.id)"
                    v-tooltip.top="'Reject'"
                  />
                  <Button 
                    v-if="slotProps.data.status == 0"
                    v-can="'leaves delete'"
                    icon="pi pi-check" 
                    class="p-button-rounded p-button-text p-button-success" 
                    @click="accept(slotProps.data.id)"
                    v-tooltip.top="'Accept'"
                  />
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

        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("confirm")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
            <span>
              {{ $t('Are you sure you want to delete this leave request?') }}
            </span>
          </div>
          <template #footer>
            <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("Reject Leave")' :modal="true">
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right" for="rejectReason">{{ $t('Rejection Reason') }}</label>
            <InputText 
              required 
              class="bg-[#f7f5f5] text-center"  
              v-model="leave.rejected_reason" 
              :placeholder='$t("Enter rejection reason")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.rejected_reason">{{ error.rejected_reason[0] }}</div>
          </div>
          <div class="w-full text-center">
            <Button 
              @click="confirm_reject" 
              class="p-button-danger m-auto w-[50%] my-4" 
              :label='$t("Submit Rejection")'
            ></Button> 
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
  
  :deep(.p-button) {
    display: none !important;
  }
}
</style>