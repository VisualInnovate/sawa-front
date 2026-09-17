<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'

import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { useI18n } from 'vue-i18n';
const toast = useToast()
const router = useRouter()
const { t } = useI18n();
const allemployee=ref([])
const loading = ref(true)
const fetchFilter=ref({
  base_salary:''
})
const user = ref({})
const error = ref('')
const users = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const payroll=ref({})
const updatedialog=ref(false)
const selectedMonths=ref('')
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get(`/api/payroll?base_salary=${fetchFilter.value?.base_salary}`).then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });
  axios.get("/api/employees").then((res)=>{
   
    allemployee.value= res.data.data
    

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/payroll/${id}`).then((res)=>{
    loading.value= false
    payroll.value= res.data.data


  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const update=()=>{
    axios
    .post(`/api/payroll/${confir_id.value}`,payroll.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      payroll.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    payroll.value={}
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const create=()=>{
    axios
    .post('/api/payroll',payroll.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      payroll.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/payroll/${confir_id.value}`)
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


const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

<template>
  <div class="grid overflow-x-scroll">
    <div class="col-12">
      <div class="page">
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button v-can="'payroll create'" :label='$t("payroll")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
           
            </div>
          </template>

          <template #end>
      
            <Button v-can="'payroll list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          </template>
        </Toolbar>

        <Toast/>
        <Toolbar class="mb-4 shadow-md overflow-x-scroll">
          <template #start>
          <DatePicker  v-model="fetchFilter.start_date"   :placeholder='$t("from")'  />   
          <DatePicker  v-model="fetchFilter.end_date"   :placeholder='$t("to")' class="mx-2"  />   
          <InputNumber  required v-model="fetchFilter.base_salary" :placeholder='$t("basic_salary")' />
        </template>
        <template #end>
      
          <Button v-can="'payroll list'"  icon="pi pi-search" @click="fetchData" />
        </template>
          </Toolbar>

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
          v-can="'payroll list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("payroll") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="employee.name " :header='$t("employee_payroll")' :sortable="true" header-style="width:20%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column>

           <Column field="base_salary" :header='$t("basic_salary")' :sortable="true" header-style="width:20%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.base_salary }}
            </template>
           </Column>
           <Column field="deduction" :header='$t("deduction_mount")' :sortable="true" header-style="width:20%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.deduction }}
            </template>
           </Column>
           <Column field="bonus" :header='$t("bonus")' :sortable="true" header-style="width:20%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.bonus }}
            </template>
           </Column>
           


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-if="false"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'payroll delete'"
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
                  <label class="w-full text-start" for="username">{{ $t('employee_payroll') }}</label>
                  <MultiSelect v-model="payroll.employees_ids"  required  option-value="id" filter :options="allemployee" optionLabel="name" :placeholder='$t("employee_payroll")' class="w-full" />          
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.employees_ids">{{ error.employees_ids[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="create" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('employee_payroll') }}</label>
                  <MultiSelect v-model="payroll.employees_ids"  required  option-value="id" filter :options="allemployee" optionLabel="name" :placeholder='$t("employee_payroll")' class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.employees_ids">{{ error.employees_ids[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="update" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>