<script setup>
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useStorage } from "@vueuse/core"
import axios from "axios"
import { useRouter } from "vue-router"

const toast = useToast()
const router = useRouter()

const loading = ref(true)
const user = ref({})
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id = ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const child_id = useStorage("child_id", Number)

onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  axios.get("/api/child").then((res) => {
    loading.value = false
    users.value = res.data.children
  })
}

onMounted(() => {
  fetchData()
})

const edit = (id) => {
  router.push({ name: 'EditChildren', params: { 'id': id } })
}

const showItem = (id) => {
  router.push({ name: 'ShowChildren', params: { 'id': id } })
}

const openNew = () => {
  router.push({ name: 'CreateChildren' })
}

const detail = (id) => {
  child_id.value = id
  router.push({ name: 'children-detailes' })
}

const confirmDelete = (id) => {
  deleteDialog.value = true
  confir_id.value = id
}

const deleteAction = () => {
  axios.delete(`/api/child/${confir_id.value}/delete`).then((res) => {
    deleteDialog.value = false
    fetchData()
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000 })
  })
}

const exportCSV = () => {
  dt.value.exportCSV()
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}

// New method to handle adding evaluation
const addEvaluation = (id) => {
  router.push({ name: 'Calender', params: { 'id': id } })
};
</script>

<template>
  <div class="grid" style="max-height: 90vh !important; overflow-y: scroll;">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4 shadow-md">
          <template #start>
            <div class="my-2">
              <Button v-can="'child create'" :label='$t("create_button")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button>
            </div>
          </template>
          <template #end>
            <Button v-can="'child list'" :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)" />
          </template>
        </Toolbar>

        <Toast />

        <div class="shadow-xl">
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
            :rows-per-page-options="[5, 10, 25]"
            current-page-report-template="Showing {first} to {last} of {totalRecords} products"
            responsive-layout="scroll"
            v-can="'child list'"
          >
            <template #header>
              <div class="flex w-full justify-between align-items-center">
                <h5 class="m-0 my-auto">{{ $t("children") }}</h5>
                <div>
                  <span class="block mt-2 md:mt-0 p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" :placeholder='$t("search")' />
                  </span>
                </div>
              </div>
            </template>

            <Column selection-mode="multiple" header-style="width: 3rem"></Column>
            <Column field="id" :header='$t("index")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.id }}
              </template>
            </Column>
            <Column field="name" :header='$t("child_name")' :sortable="true" header-style="width:17%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.name }}
              </template>
            </Column>
            <Column field="birth_date" :header='$t("birth_date")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
              <template #body="slotProps">
                {{ slotProps.data.birth_date }}
              </template>
            </Column>
            <Column header-style="min-width:10rem;">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button v-can="'child edit'" icon="pi pi-pencil" class="p-button-rounded p-button-success" @click="edit(slotProps.data.id)" />
                  <Button v-can="'child delete'" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDelete(slotProps.data.id)" />
                  <Button icon="pi pi-user" class="p-button-rounded p-button-warning" @click="detail(slotProps.data.id)" />
                  <!-- New button for adding evaluation -->
                  <Button  icon="pi pi-plus" class="p-button-rounded p-button-help" @click="addEvaluation(slotProps.data.id)" />
                </div>
              </template>
            </Column>
          </DataTable>
          <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex align-items-center justify-content-center">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="user">{{ $t('remove_item') }} <b>{{ user.first_name }}</b>?</span>
            </div>
            <template #footer>
              <Button :label='$t("no")' icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
              <Button :label='$t("yes")' icon="pi pi-check" class="p-button-text" @click="deleteAction" />
            </template>
          </Dialog>
        </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.p-toolbar {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.p-datatable {
  .p-datatable-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }

  .p-datatable-thead > tr > th {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }

  .p-datatable-tbody > tr {
    &:hover {
      background-color: #f8f9fa;
    }
  }
}

.p-button {
  &.p-button-success {
    background-color: #28a745;
    border-color: #28a745;
  }

  &.p-button-info {
    background-color: #17a2b8;
    border-color: #17a2b8;
  }

  &.p-button-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }

  &.p-button-warning {
    background-color: #ffc107;
    border-color: #ffc107;
  }

  &.p-button-help {
    background-color: #6610f2;
    border-color: #6610f2;
  }
}

.p-dialog {
  .p-dialog-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    border-top: 1px solid #dee2e6;
    padding: 1rem 1.5rem;
  }
}
</style>