<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const loading = ref(true)
const user = ref({})
const error = ref('')
const users = ref([])
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})

const  status=ref([
        { name: t("Pending"), code: -1 },
        { name: t("Accept"), code: 1 },
        { name: t("Cancell"), code: 0 },
      
      ])


onBeforeMount(() => {
  initFilters()
})

const fetchData = () => {
  loading.value = true
  axios.get("/api/student-program").then((res) => {
    users.value = res.data.data || []
  }).catch(() => {
    toast.add({severity: 'error', summary: t('error'), detail: t('request_failed_retry'), life: 4000})
  }).finally(() => {
    loading.value = false
  })
}


const updateStatus=(id,status)=>{
  
  loading.value=true
 
  axios.get(`api/student-program/change-status/${id}?status=${status}`).then((res)=>{
      loading.value=false
      fetchData()
      });

}
const session =(id,program_id)=>{
  router.push({name:'sessions-update',params:{'id':id,'program_id':program_id} })
}


onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  router.push({name:'update-studentprograme',params:{'id':id} })
}


const openNew = () => {
  router.push({name:'create-studentprograme'})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const deleteAction = () => {
  axios
    .delete(`/api/student-program/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
    })
    .catch(() => {})

}


const exportCSV = () => {
  dt.value.exportCSV()
}

const statusClass = (value) => ({
  1: 'status-accepted',
  0: 'status-cancelled',
  '-1': 'status-pending',
}[value] || 'status-pending')

const statusLabel = (value) => status.value.find((item) => item.code === value)?.name || '—'

const formatPrice = (value) => new Intl.NumberFormat(
  localStorage.appLang === 'en' ? 'en-US' : 'ar-JO',
  { maximumFractionDigits: 2 }
).format(Number(value || 0))


const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="page">
        <Toolbar class="student-program-toolbar">
          <template #start>
            <div class="my-2">
            <Button  v-can="'student program create'" :label='$t("add_sp")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
<!--              <Button-->
<!--                label="Delete"-->
<!--                icon="pi pi-trash"-->
<!--                class="p-button-danger"-->
<!--                :disabled="!selectedProducts || !selectedProducts.length"-->
<!--                @click="confirmDeleteSelected"-->
<!--              />-->
            </div>
          </template>

          <template #end>
<!--            <FileUpload-->
<!--              mode="basic"-->
<!--              accept="image/*"-->
<!--              :max-file-size="1000000"-->
<!--              label="Import"-->
<!--              choose-label="Import"-->
<!--              class="mr-2 inline-block"-->
<!--            />-->
            <Button :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          </template>
        </Toolbar>

        <Toast/>


      <div class="student-program-table-wrap">
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
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('products')}`"
          responsive-layout="scroll"
          stripedRows
          rowHover
          class="student-program-table"
          v-can="'student program list'"
        >
          <template #header>
            <div class="table-heading">
              <div>
                <h5 class="page-title">{{ $t("student_programe") }}</h5>
                <p class="table-subtitle">{{ users.length }} {{ $t("student_programe") }}</p>
              </div>
             <div class="search-wrap">
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

           <Column field="student.name" :header='$t("child_name")' :sortable="true" header-style="min-width:13rem;">
            <template #body="slotProps">
              <div class="student-cell">
                <span class="student-avatar"><i class="pi pi-user" /></span>
                <strong>{{ slotProps.data.student?.name || '—' }}</strong>
              </div>
            </template>
           </Column>
           <Column field="program.name" :header='$t("ProgramName")' :sortable="true" header-style="min-width:13rem;">
            <template #body="slotProps">
              <span class="program-name">{{ slotProps.data.program?.name || '—' }}</span>
            </template>
           </Column>
         
           <Column :header="$t('milestone_plan_goals')" header-style="min-width:18rem">
             <template #body="{ data }">
               <div v-if="data.milestone_plan_goals?.length" class="goals-list">
                 <span v-for="goal in data.milestone_plan_goals" :key="goal.id" class="goal-chip">{{ goal.body }}</span>
               </div>
               <span v-else class="empty-value">—</span>
             </template>
           </Column>
           <Column field="program.price" :header='$t("price")' :sortable="true" header-style="min-width:8rem;">
            <template #body="slotProps">
              <strong class="price-value">{{ formatPrice(slotProps.data.program?.price) }}</strong>
            </template>
           </Column>
          
           <Column field="status" :header='$t("status")' :sortable="true" header-style="width:9rem; min-width:9rem;">
            <template #body="slotProps">
              <Select
                :disabled="!$can('student program edit')"
                @update:model-value="updateStatus(slotProps.data.id, $event)"
                v-model="slotProps.data.status"
                option-value="code"
                :options="status"
                optionLabel="name"
                :class="['status-select', statusClass(slotProps.data.status)]"
              >
                <template #value>
                  <span class="status-value">
                    <span class="status-dot" />
                    {{ statusLabel(slotProps.data.status) }}
                  </span>
                </template>
              </Select>

            </template>
           </Column>
         


        
          <Column :header="$t('actions')" header-style="width:14rem; min-width:14rem;">
            <template #body="slotProps">
              <div class="student-program-actions">
                <Button
                v-can="'student program edit'"            
                :label='$t("sumi_start")'
                class="start-session-button"
                icon="pi pi-play"
                size="small"
                @click="session(slotProps.data.student_id,slotProps.data.id)" />
                <Button
                v-can="'student program edit'"  
                icon="pi pi-pencil"
                class="row-action-button edit-action"
                @click="edit(slotProps.data.id)" rounded variant="text" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'student program delete'"
                icon="pi pi-trash"
                class="row-action-button delete-action"
                @click="confirmDelete(slotProps.data.id)" rounded variant="text" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
            
              </div>
            </template>
          </Column>



        </DataTable>
        <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="user"
            >{{ $t('remove_item') }} <b>{{ user.first_name }}</b
            >?</span
            >
          </div>
          <template #footer>
            <Button  :label='$t("no")' icon="pi pi-times" @click="deleteDialog = false" variant="text" severity="secondary" />
            <Button  :label='$t("yes")' icon="pi pi-check" @click="deleteAction" severity="danger" />
          </template>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.student-program-toolbar {
  margin-bottom: 1rem;
  border: 1px solid #dce8e8;
  border-radius: 14px;
  background: #fff;
}

.student-program-table-wrap {
  overflow: hidden;
  border: 1px solid #dce8e8;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 92, 101, 0.06);
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.table-subtitle {
  margin: .25rem 0 0;
  color: #718096;
  font-size: .82rem;
}

.student-cell {
  display: flex;
  align-items: center;
  gap: .7rem;
}

.student-avatar {
  display: grid;
  width: 2.35rem;
  height: 2.35rem;
  flex: 0 0 2.35rem;
  place-items: center;
  border-radius: 12px;
  background: #e8f5f4;
  color: #126b73;
}

.program-name,
.price-value { color: #22334d; }

.goals-list {
  display: flex;
  max-width: 28rem;
  flex-wrap: wrap;
  gap: .4rem;
}

.goal-chip {
  display: inline-block;
  max-width: 100%;
  padding: .35rem .65rem;
  overflow: hidden;
  border: 1px solid #dbe8e8;
  border-radius: 999px;
  background: #f4f9f9;
  color: #425466;
  font-size: .8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-value { color: #94a3b8; }

:deep(.student-program-table .p-datatable-thead > tr > th) {
  padding-block: 1rem;
  border-color: #e5eeee;
  background: #f5f9f9;
  color: #31545a;
}

:deep(.student-program-table .p-datatable-tbody > tr > td) {
  padding-block: 1rem;
  border-color: #edf2f2;
}

:deep(.status-select) {
  width: 8.25rem;
  min-width: 8.25rem;
  min-height: 2.4rem;
  border: 0;
  border-radius: 999px;
  box-shadow: none;
  font-weight: 700;
}

:deep(.status-select .p-select-label) {
  display: flex;
  align-items: center;
  padding: .5rem .75rem;
  color: inherit;
}

:deep(.status-select .p-select-dropdown) {
  width: 2rem;
  color: inherit;
}

.status-value {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  white-space: nowrap;
}

.status-dot {
  width: .48rem;
  height: .48rem;
  flex: 0 0 .48rem;
  border-radius: 50%;
  background: currentColor;
}

:deep(.status-accepted) { background: #dcfce7; color: #167443; }
:deep(.status-pending) { background: #fff3cd; color: #946200; }
:deep(.status-cancelled) { background: #fee2e2; color: #b42318; }

.student-program-actions {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  min-width: max-content;
  padding: .25rem;
  border: 1px solid #e1ebeb;
  border-radius: 12px;
  background: #f8fbfb;
  white-space: nowrap;
}

.start-session-button {
  height: 2.4rem;
  margin: 0;
  border-color: #126b73;
  border-radius: 9px;
  background: #126b73;
  white-space: nowrap;
}

.row-action-button {
  width: 2.4rem;
  height: 2.4rem;
  margin: 0;
}

.edit-action { color: #087f8c; }
.edit-action:hover { background: #dff5f5; }
.delete-action { color: #dc3545; }
.delete-action:hover { background: #feecec; }

@media (max-width: 700px) {
  .table-heading { align-items: stretch; flex-direction: column; }
  .search-wrap, .table-search { width: 100%; }
}
</style>
