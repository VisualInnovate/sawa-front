<script setup>
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount } from 'vue'
import LeavesNave from '../../../../components/LeavesNave.vue'
import { useToast } from 'primevue/usetoast'
import axios from "axios"
import { useRouter } from "vue-router"

const toast = useToast()
const router = useRouter()

const loading = ref(true)
const users = ref(null)
const deleteDialog = ref(false)
const confir_id = ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog = ref(false)
const updatedialog = ref(false)
const leave = ref({
  type: null,
  title: '',
  days: null,
  hours: null
})
const exportLoading = ref(false)
const printLoading = ref(false)

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/leave-setup").then((res) => {
    loading.value = false
    users.value = res.data.data
  })
}

const arr = () => {
  return [
    { name: 'Daily', value: 'daily' },
    { name: 'Hourly', value: 'hourly' }
  ]
}

const defult_type = () => {
  leave.value.days = null
  leave.value.hours = null
}

onMounted(() => {
  fetchData()
})

const edit = (id) => {
  axios.get(`/api/leave-setup/${id}`).then((res) => {
    loading.value = false
    leave.value = res.data.data
  })
  confir_id.value = id
  updatedialog.value = true
}

const editescrud = () => {
  axios
    .put(`/api/leave-setup/${confir_id.value}`, leave.value)
    .then((res) => {
      fetchData()
      updatedialog.value = false
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000 })
      leave.value = {
        type: null,
        title: '',
        days: null,
        hours: null
      }
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const openNew = () => {
  createdialog.value = true
  leave.value = {
    type: null,
    title: '',
    days: null,
    hours: null
  }
}

const confirmDelete = (id) => {
  deleteDialog.value = true
  confir_id.value = id
}

const createcrude = () => {
  axios
    .post('/api/leave-setup', leave.value)
    .then((res) => {
      fetchData()
      createdialog.value = false
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000 })
      leave.value = {
        type: null,
        title: '',
        days: null,
        hours: null
      }
    })
    .catch((el) => {
      error.value = el.response.data.errors
    })
}

const deleteAction = () => {
  axios
    .delete(`/api/leave-setup/${confir_id.value}`)
    .then((res) => {
      deleteDialog.value = false
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
        <title>Leave Setup Report</title>
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
        <h1>Leave Setup Report</h1>
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
      
        <LeavesNave />
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
            v-can="'leave setup list'"
            stripedRows
            showGridlines
            class="p-datatable-sm"
          >
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <h3 class="m-0">{{ $t("Leave Setup List") }}</h3>
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
                :label='$t("print")' 
                icon="pi pi-print" 
                class="p-button-help no-print" 
                :loading="printLoading"
                @click="printTable"
              />
              <Button 
                v-can="'leave setup list'" 
                :label='$t("export")' 
                icon="pi pi-download" 
                class="p-button-info no-print" 
                :loading="exportLoading"
                @click="exportCSV"
              />
              <Button 
                v-can="'leave setup create'"
                :label='$t("Add New")' 
                icon="pi pi-plus" 
                class="p-button-success no-print" 
                @click="openNew"
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
            
            <Column field="type" :header='$t("Type")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.type }}
              </template>
            </Column>
            
            <Column field="title" :header='$t("Title")' :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.title }}
              </template>
            </Column>
            
            <Column field="days" :header='$t("Days")' :sortable="true">
              <template #body="slotProps">
                <span v-if="slotProps.data.days !== null">{{ slotProps.data.days }}</span>
                <span v-else class="text-gray-400">-</span>
              </template>
            </Column>
            
            <Column field="hours" :header='$t("Hours")' :sortable="true">
              <template #body="slotProps">
                <span v-if="slotProps.data.hours !== null">{{ slotProps.data.hours }}</span>
                <span v-else class="text-gray-400">-</span>
              </template>
            </Column>
            
            <Column :exportable="false" header-style="width: 10rem" body-class="text-center">
              <template #body="slotProps">
                <div class="flex gap-1 justify-content-center">
                  <Button 
                    v-can="'leave setup edit'"
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text p-button-success" 
                    @click="edit(slotProps.data.id)"
                    v-tooltip.top="'Edit'"
                  />
                  <Button 
                    v-can="'leave setup delete'"
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger" 
                    @click="confirmDelete(slotProps.data.id)"
                    v-tooltip.top="'Delete'"
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
              {{ $t('Are you sure you want to delete this leave setup?') }}
            </span>
          </div>
          <template #footer>
            <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>

        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("Create Leave Setup")' :modal="true">
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Type') }}</label>
            <Dropdown 
              v-model="leave.type" 
              required 
              option-value="value"  
              :options="arr()" 
              optionLabel="name" 
              :placeholder='$t("Select type")' 
              class="w-full" 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
          </div>
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Title') }}</label>
            <InputText 
              required 
              class="w-full" 
              v-model="leave.title" 
              :placeholder='$t("Enter title")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
          </div>
          <div v-show="leave.type === 'daily'" class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Days') }}</label>
            <InputNumber  
              required 
              class="w-full" 
              v-model="leave.days" 
              :placeholder='$t("Enter days")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.days">{{ error.days[0] }}</div>
          </div>
          <div v-show="leave.type === 'hourly'" class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Hours') }}</label>
            <InputNumber  
              required 
              class="w-full" 
              v-model="leave.hours" 
              :placeholder='$t("Enter hours")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.hours">{{ error.hours[0] }}</div>
          </div>
          <div class="w-full text-center">
            <Button 
              @click="createcrude" 
              class="p-button-success m-auto w-[50%] my-4" 
              :label='$t("submit")'
            ></Button> 
          </div>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("Update Leave Setup")' :modal="true">
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Type') }}</label>
            <Dropdown 
              v-model="leave.type" 
              @update:model-value="defult_type"
              required 
              option-value="value"  
              :options="arr()" 
              optionLabel="name" 
              :placeholder='$t("Select type")' 
              class="w-full" 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
          </div>
          <div class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Title') }}</label>
            <InputText 
              required 
              class="w-full" 
              v-model="leave.title" 
              :placeholder='$t("Enter title")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
          </div>
          <div v-if="leave.type === 'daily'" class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Days') }}</label>
            <InputNumber  
              required 
              class="w-full" 
              v-model="leave.days" 
              :placeholder='$t("Enter days")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.days">{{ error.days[0] }}</div>
          </div>
          <div v-if="leave.type === 'hourly'" class="flex flex-column gap-2 py-1">
            <label class="w-full text-right">{{ $t('Hours') }}</label>
            <InputNumber  
              required 
              class="w-full" 
              v-model="leave.hours" 
              :placeholder='$t("Enter hours")' 
            />
            <div class="mt-1 mb-5 text-red-500" v-if="error?.hours">{{ error.hours[0] }}</div>
          </div>
          <div class="w-full text-center">
            <Button 
              @click="editescrud" 
              class="p-button-success m-auto w-[50%] my-4" 
              :label='$t("submit")'
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