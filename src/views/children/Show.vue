<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const search = ref('')
const sideProfile = ref([])
const alertText = ref(null)
const loading = ref(true)
const childName = ref('')
const dt = ref(null)

const headers = [
  { field: 'evaluation_title', header: 'Evaluation Title' },
  { field: 'actions', header: 'Operation', exportable: false }
]

const goBack = () => {
  router.go(-1)
}

const getSideProfile = () => {
  loading.value = true
  axios.get(`api/child/${route.params.id}/show-side-profiles`).then(res => {
    sideProfile.value = res.data.sideProfile
    loading.value = false
  })
}

const getChildrenName = () => {
  axios.get(`api/child/${route.params.id}`).then(res => {
    childName.value = res.data.child.name
  })
}

const showSide = (id) => {
  router.push({ 
    name: 'resulte', 
    params: { child_id: route.params.id, sideProfile_id: id }
  })
}

const editItem = (id) => {
  router.push({ name: 'EditSideProfiles', params: { id } })
}

const deleteItem = (id) => {
  axios.delete(`/api/side-profiles/${id}/delete`).then(res => {
    if (res.data.status === 200) {
      alertText.value = 'Side profile deleted successfully'
      sideProfile.value = res.data.sideProfile
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Side profile deleted successfully', 
        life: 3000 
      })
    }
  })
}

const showItem = (evaluation_id, side_profile_id) => {
  router.push({
    name: 'showChildResult',
    params: {
      child_id: route.params.id,
      sideProfile_id: side_profile_id,
      evaluation_id: evaluation_id
    }
  })
}

onMounted(() => {
  getSideProfile()
  getChildrenName()
})
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-4 shadow-2 border-round">
        <Toolbar class="mb-4">
          <template #start>
            <Button 
              :label="$t('Back')"
              icon="pi pi-arrow-left"
              class="p-button-secondary mr-2"
              @click="goBack"
            />
            <h2 class="text-2xl font-bold">{{ childName }}</h2>
          </template>
          <template #end>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText 
                v-model="search" 
                :placeholder="$t('Search')" 
                class="w-full"
              />
            </span>
          </template>
        </Toolbar>

        <Toast />

        <DataTable
          ref="dt"
          :value="sideProfile"
          :loading="loading"
          data-key="id"
          :globalFilter="search"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[5, 10, 25, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
          responsiveLayout="scroll"
          scrollable
          scrollHeight="flex"
          stripedRows
          showGridlines
          class="p-datatable-sm"
          rowGroupMode="subheader"
          groupRowsBy="side_profile_title"
        >
          <template #groupheader="{ data }">
            <div class="flex align-items-center gap-2">
              <span class="font-bold">{{ data.side_profile_title }}</span>
              <Button
                icon="pi pi-eye"
                class="p-button-rounded p-button-text p-button-primary"
                @click="showSide(data.side_profile_id)"
                v-tooltip.top="'View Side Profile'"
              />
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-primary"
                @click="editItem(data.side_profile_id)"
                v-tooltip.top="'Edit Side Profile'"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-danger"
                @click="deleteItem(data.side_profile_id)"
                v-tooltip.top="'Delete Side Profile'"
              />
            </div>
          </template>

          <Column v-for="col in headers" :key="col.field" :field="col.field" :header="$t(col.header)">
            <template #body="{ data }" v-if="col.field === 'actions'">
              <div class="flex gap-1 justify-content-center">
                <Button 
                  icon="pi pi-eye" 
                  class="p-button-rounded p-button-text p-button-primary" 
                  @click="showItem(data.evaluations_id, data.side_profile_id)"
                  v-tooltip.top="'View Evaluation'"
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
    </div>
  </div>
</template>

<style scoped>
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

:deep(.p-datatable .p-datatable-tbody > tr.p-rowgroup-header) {
  background-color: #f6f6f6;
  font-weight: 600;
}

@media screen and (max-width: 960px) {
  :deep(.p-datatable) {
    overflow-x: auto;
    display: block;
  }
}
</style>