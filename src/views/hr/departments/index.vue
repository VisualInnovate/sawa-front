<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const allemployee=ref({})
const loading = ref(true)
const user = ref({})
const error = ref('')
const users = ref(null)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const department=ref({})
const updatedialog=ref(false)
const exportLoading = ref(false)
const printLoading = ref(false)

onBeforeMount(() => {
  initFilters()
})

const fetchData= ()=>{
  loading.value = true
  axios.get("/api/department").then((res)=>{
    loading.value= false
    users.value= res.data.data
  }).catch(() => {
    loading.value = false
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load departments', life: 3000 })
  });
  
  axios.get("/api/employees").then((res)=>{
    allemployee.value= res.data.data
  });
}

onMounted(() => {
  fetchData()
})

const edit=(id)=>{
  axios.get(`/api/department/${id}`).then((res)=>{
    department.value= res.data.data
  });
  confir_id.value=id
  updatedialog.value=!(updatedialog.value)
}

const update=()=>{
  axios
    .put(`/api/department/${confir_id.value}`,department.value)
    .then((res) => {
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Department updated successfully', life: 3000})
      department.value = {}
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
  createdialog.value=!(createdialog.value)
  department.value={}
}

const confirmDelete = (id) => {
  deleteDialog.value = true
  confir_id.value=id
}

const create=()=>{
  axios
    .post('/api/department',department.value)
    .then((res) => {
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Department created successfully', life: 3000})
      department.value = {}
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const deleteAction = () => {
  axios
    .delete(`/api/department/${confir_id.value}`)
    .then((res) => {
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'Department deleted successfully', life: 3000})
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
        <title>Departments Report</title>
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
        <h1>Departments Report</h1>
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
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <h2 class="text-2xl font-bold">{{ $t("Departments") }}</h2>
          </template>

          <template #end>
            <div class="flex gap-2">
              <Button :label='$t("print")' icon="pi pi-print" class="p-button-help no-print" :loading="printLoading"
                @click="printTable" />
              <Button v-can="'department list'" :label='$t("export")' icon="pi pi-download"
                class="p-button-info no-print" :loading="exportLoading" @click="exportCSV" />
              <Button v-can="'department create'" :label='$t("department_add")' icon="pi pi-plus" 
                class="p-button-success" @click="openNew" />
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
            responsive-layout="scroll" scrollable scroll-height="flex" v-can="'department list'" stripedRows
            showGridlines class="p-datatable-sm">
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
                <div class="flex gap-2">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" :placeholder='$t("search")' class="w-full" />
                  </span>
                  <Button icon="pi pi-refresh" class="p-button-text" @click="fetchData"
                    v-tooltip.top="'Refresh data'" />
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>

            <Column field="title" :header='$t("title")' :sortable="true">
              <template #body="slotProps">
                <span class="font-medium">{{ slotProps.data.title }}</span>
              </template>
            </Column>

            <Column field="description" :header='$t("description")' :sortable="true">
              <template #body="slotProps">
                <div class="line-clamp-2" style="max-width: 300px;">
                  {{ slotProps.data.description || '--' }}
                </div>
              </template>
            </Column>

            <Column header-style="min-width:10rem;">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button
                    v-can="'department edit'"
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-success"
                    @click="edit(slotProps.data.id)"
                  />
                  <Button
                    v-can="'department delete'"
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger"
                    @click="confirmDelete(slotProps.data.id)"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <i class="pi pi-exclamation-circle text-2xl mb-2" />
                <p class="text-xl">No departments found</p>
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
              {{ $t('remove_item') }} <b>this department</b>?
            </span>
          </div>
          <template #footer>
            <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
            <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteAction" />
          </template>
        </Dialog>

        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("Add Department")'
          :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-right" for="title">{{ $t('title') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="department.title" :placeholder='$t("title")' />
            <div class="mt-1 mb-3 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 mt-3">
            <label class="w-full text-right" for="description">{{ $t('description') }}</label>
            <Textarea v-model="department.description" :autoResize="true" rows="5" cols="30" 
              class="w-full bg-[#f7f5f5]" :placeholder='$t("description")' />
            <div class="mt-1 mb-3 text-red-500" v-if="error?.description">{{ error.description[0] }}</div>
          </div>
          
          <div class="w-full text-center mt-4">
            <Button @click="create" class="p-button-success m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
          </div>
        </Dialog>

        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("Update Department")'
          :modal="true">
          <div class="flex flex-column gap-2">
            <label class="w-full text-right" for="title">{{ $t('title') }}</label>
            <InputText required class="bg-[#f7f5f5] text-center" v-model="department.title" :placeholder='$t("title")' />
            <div class="mt-1 mb-3 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
          </div>
          
          <div class="flex flex-column gap-2 mt-3">
            <label class="w-full text-right" for="description">{{ $t('description') }}</label>
            <Textarea v-model="department.description" :autoResize="true" rows="5" cols="30" 
              class="w-full bg-[#f7f5f5]" :placeholder='$t("description")' />
            <div class="mt-1 mb-3 text-red-500" v-if="error?.description">{{ error.description[0] }}</div>
          </div>
          
          <div class="w-full text-center mt-4">
            <Button @click="update" class="p-button-success m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>