<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import moment from "moment";
import {ref, computed, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { useI18n } from 'vue-i18n';
import { employeeTypeName, employeeTypes, fetchEmployeeFormOptions } from "@/utils/employeeForm";
const toast = useToast()
const router = useRouter()
const { t } = useI18n();

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
const createdialog=ref(false)
const position=ref({})
const updatedialog=ref(false)
// Where the position sits in the approvals: the department head first, then HR (the general manager may do either).
const levels = ['general_manager', 'hr_manager', 'department_head', 'staff']
const levelOptions = computed(() => levels.map((value) => ({ value, label: t(`lflow.level_${value}`) })))
// What the position fixes for whoever holds it (org structure): role, employee type, department. Empty = left to the employee form.
const lookups = ref({ roles: [], departments: [] })
const typeOptions = computed(() => employeeTypes(t))
const nameOf = (list, id, key = 'name') => list.find((item) => Number(item.id) === Number(id))?.[key] ?? ''
const loadLookups = () => fetchEmployeeFormOptions().then((data) => {
  lookups.value = { roles: (data.roles ?? []).filter((role) => !role.is_locked && !role.is_extra), departments: data.departments ?? [] }
}).catch(() => {})

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/position").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()
loadLookups()

})
const edit=(id)=>{
    axios.get(`/api/position/${id}`).then((res)=>{

    const item = res.data.data ?? {}
    position.value = { parent_id: item.parent_id, org_level: item.org_level ?? 'staff', title: item.title, description: item.description,
      role_id: item.role_id ?? null, employee_type: item.employee_type ?? null, department_id: item.department_id ?? null }
    

  });
  confir_id.value=id
  updatedialog.value=!(updatedialog.value)
}


///// update

const updateitem=()=>{
    axios
    .put(`/api/position/${confir_id.value}`,position.value)
    .then((res) => {
      fetchData()
      updatedialog.value=!(updatedialog.value)
      // Everyone holding the position got its new role / type / department.
      const synced = res.data?.data?.synced_employees ?? 0
      toast.add({severity: 'success', summary: t('success_message'), detail: synced ? t('stc.position_synced', { n: synced }) : t('successful'), life: 4000})
      position.value = {}
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    position.value={ org_level: 'staff' }
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const create=()=>{
    axios
    .post('/api/position',position.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      position.value = {}
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/position/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
    })
    .catch((e) => {
      deleteDialog.value=false
      const held = e.response?.data?.data?.employees
      toast.add({severity: 'error', summary: t('error'), detail: held ? t('stc.position_held', { n: held }) : t('request_failed_retry'), life: 5000})
    })

}


const exportCSV = () => {
  dt.value.exportCSV()
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
      <div class="page">
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button v-can="'positions create'" :label='$t("posttion_add")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
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
            <Button v-can="'positions list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          </template>
        </Toolbar>

        <Toast/>


      <div>
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
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'positions list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("posttion") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="title" :header='$t("title")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
           </Column>
           <Column field="parent.title" :header='$t("title")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data?.parent?.title }}
            </template>
           </Column>

      
          


        
           <Column :header="$t('roles')" header-style="min-width:9rem;">
            <template #body="slotProps">
              <span v-if="slotProps.data.role_id">{{ nameOf(lookups.roles, slotProps.data.role_id) || '—' }}</span>
              <Tag v-else :value="$t('stc.no_role')" severity="warn" />
            </template>
           </Column>
           <Column :header="$t('type')" header-style="min-width:7rem;">
            <template #body="slotProps">{{ slotProps.data.employee_type ? employeeTypeName(t, slotProps.data.employee_type) : '—' }}</template>
           </Column>
           <Column :header="$t('department')" header-style="min-width:8rem;">
            <template #body="slotProps">{{ slotProps.data.department_id ? nameOf(lookups.departments, slotProps.data.department_id, 'title') : '—' }}</template>
           </Column>
           <Column field="org_level" :header="$t('lflow.org_level')" :sortable="true" header-style="min-width:10rem;">
            <template #body="slotProps">
              <Tag :value="$t(`lflow.level_${slotProps.data.org_level ?? 'staff'}`)" :severity="(slotProps.data.org_level ?? 'staff') === 'staff' ? 'secondary' : 'info'" />
            </template>
           </Column>

          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-can="'positions edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'positions delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
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
        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('posttion_dgree') }}</label>
                  <Select  v-model="position.parent_id"  required  option-value="id" filter :options="users" optionLabel="title" :placeholder='$t("posttion_dgree")' class="w-full" />          
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.parent_id">{{ error.parent_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('title') }}</label>
                <InputText required class="text-center" v-model="position.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-level-new">{{ $t('lflow.org_level') }}</label>
                  <Select inputId="position-level-new" v-model="position.org_level" :options="levelOptions" optionLabel="label" optionValue="value" class="w-full" />
                  <small class="text-muted-color mb-3">{{ $t('lflow.org_level_hint') }}</small>
            </div>
            <!-- What the position fixes for whoever holds it (org structure). -->
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-role-new">{{ $t('roles') }}</label>
                  <Select inputId="position-role-new" v-model="position.role_id" :options="lookups.roles" optionLabel="name" optionValue="id" filter showClear class="w-full" :placeholder="$t('stc.role_open')" />
                  <small class="text-muted-color">{{ $t('stc.position_role_hint') }}</small>
                  <div class="text-red-500" v-if="error?.role_id">{{ error.role_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-type-new">{{ $t('type') }}</label>
                  <Select inputId="position-type-new" v-model="position.employee_type" :options="typeOptions" optionLabel="name" optionValue="id" showClear class="w-full" :placeholder="$t('stc.type_open')" />
            </div>
            <div class="flex flex-column gap-2 mb-3">
                  <label class="w-full text-start" for="position-department-new">{{ $t('department') }}</label>
                  <Select inputId="position-department-new" v-model="position.department_id" :options="lookups.departments" optionLabel="title" optionValue="id" filter showClear class="w-full" :placeholder="$t('stc.department_open')" />
                  <small class="text-muted-color">{{ $t('stc.position_department_hint') }}</small>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('posttion_description') }}</label>
                  <Textarea rows="3" v-model="position.description" autoResize fluid /> 
                <div class="mt-1 mb-5 text-red-500" v-if="error?.description">{{ error.description[0] }}</div>
            </div>
          
           <div class="w-full text-center">
            <Button @click="create" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-parent">{{ $t('posttion_dgree') }}</label>
                  <Select inputId="position-parent" v-model="position.parent_id" option-value="id" filter :options="users" optionLabel="title" :placeholder='$t("posttion_dgree")' class="w-full" />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.parent_id">{{ error.parent_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-title">{{ $t('title') }}</label>
                <InputText id="position-title" required v-model="position.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-level">{{ $t('lflow.org_level') }}</label>
                  <Select inputId="position-level" v-model="position.org_level" :options="levelOptions" optionLabel="label" optionValue="value" class="w-full" />
                  <small class="text-muted-color mb-3">{{ $t('lflow.org_level_hint') }}</small>
            </div>
            <!-- What the position fixes for whoever holds it (org structure). -->
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-role">{{ $t('roles') }}</label>
                  <Select inputId="position-role" v-model="position.role_id" :options="lookups.roles" optionLabel="name" optionValue="id" filter showClear class="w-full" :placeholder="$t('stc.role_open')" />
                  <small class="text-muted-color">{{ $t('stc.position_role_hint') }}</small>
                  <div class="text-red-500" v-if="error?.role_id">{{ error.role_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-type">{{ $t('type') }}</label>
                  <Select inputId="position-type" v-model="position.employee_type" :options="typeOptions" optionLabel="name" optionValue="id" showClear class="w-full" :placeholder="$t('stc.type_open')" />
            </div>
            <div class="flex flex-column gap-2 mb-3">
                  <label class="w-full text-start" for="position-department">{{ $t('department') }}</label>
                  <Select inputId="position-department" v-model="position.department_id" :options="lookups.departments" optionLabel="title" optionValue="id" filter showClear class="w-full" :placeholder="$t('stc.department_open')" />
                  <small class="text-muted-color">{{ $t('stc.position_department_hint') }}</small>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="position-description">{{ $t('posttion_description') }}</label>
                  <Textarea id="position-description" rows="3" v-model="position.description" autoResize fluid />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.description">{{ error.description[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="updateitem" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>