<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Deduction from '../../../components/hr/Deduction.vue'
import moment from "moment";
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { useI18n } from 'vue-i18n'
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const deduction_types=ref([])
const loading = ref(true)
const user = ref({})
const error = ref('')
const employees=ref([])
const deductions = ref(null)
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const deduction=ref({})
const updatedialog=ref(false)
const  status=ref([
        { name: t("Pending"), code: 0 },
        { name: t("Accept"), code: 1 },
        { name: t("Cancell"), code: -1 },
      
      ])
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/deduction-types").then((res)=>{
    loading.value= false
    deduction_types.value= res.data.data
   

  });
  
  axios.get("/api/deductions").then((res)=>{
    loading.value= false
    deductions.value= res.data.data
   

  });
  
  axios.get("/api/employees").then((res)=>{
    
    employees.value= res.data.data
   

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/deductions/${id}`).then((res)=>{
    loading.value= false
    deduction.value= res.data.data


  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const edite=()=>{
    axios
    .put(`/api/deductions/${confir_id.value}`,deduction.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      deduction.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    deduction.value={}
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}
const updateStatus=(id,status)=>{
  
  loading.value=true
 
  axios.get(`/api/deductions/change-status/${id}?status=${status}`).then((res)=>{
      loading.value=false
      fetchData()
      });

}
const createskill=()=>{
  deduction.value.date = moment(deduction.value.dat).format("YYYY-MM-DD" );
    axios
    .post('/api/deductions',deduction.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      deduction.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/deduction-types/${confir_id.value}`)
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
  <div class="grid">
    <div class="col-12">
      <div class="page">
        <div class="relative">
          <Deduction ></Deduction>
          <Button  v-can="'deduction create'" :label='$t("deduction_add")' icon="pi pi-plus" class="mr-2 absolute top-3" @click="openNew"></Button>
          <Button v-can="'deduction list'" :label='$t("export")' icon="pi pi-upload" class="absolute top-3 ltr:left-[15%] rtl:right-[15%]" @click="exportCSV($event)" severity="secondary" variant="outlined" />

        </div>
        
        
     

        <Toast/>


      <div>
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="deductions"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'deduction list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("deductions") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="employee.name" :header='$t("employee_name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column>
           <Column field="deduction_type.title" :header='$t("deduction_type")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.deduction_type.title }}
            </template>
           </Column>
           <Column field="amount" :header='$t("deduction_mount")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.amount }}
            </template>
           </Column>
          
           <Column field="status" :header='$t("status")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
                <Select  :disabled="!$can('deduction edit')" @update:model-value="updateStatus(slotProps.data.id,$event)"  :style="{ backgroundColor: slotProps.data.status == 1 ? '#10B981' : slotProps.data.status == -1 ? '#EF4444' : slotProps.data.status == 0 ? '#F59E0B' : 'transparent' }" v-model="slotProps.data.status"  option-value="code"  :options="status" optionLabel="name"   />

               
            </template>
           </Column>

        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-can="'deduction edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'deduction delete'"
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
                  <label  style="text-align: right !important;" for="username">{{ $t('employee_name') }}</label>
                  <Select required  v-model="deduction.employee_id"  option-value="id" filter :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.employee_id">{{ error.employee_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                  <label style="text-align: right !important;" for="username">{{ $t('deduction_type') }}</label>
                  <Select required  v-model="deduction.deduction_type_id"  option-value="id" filter :options="deduction_types" optionLabel="title" :placeholder='$t("deduction_type")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.deduction_type_id">{{ error.deduction_type_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_mount') }}</label>
                <InputNumber required class="text-center" v-model="deduction.value" :placeholder='$t("deduction_mount")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.value">{{ error.value[0] }}</div>
              </div>
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" for="username">{{ $t('deduction_date') }}</label>
                   <DatePicker  style="width: 100%" showButtonBar v-model.number="deduction.date" showIcon  :placeholder='$t("deduction_date")'   />   
                   <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
               </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_reason') }}</label>
                <InputText required class="text-center" v-model="deduction.reason" :placeholder='$t("deduction_reason")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.reason">{{ error.reason[0] }}</div>
              </div>
           <div class="w-full text-center">
            <Button @click="createskill" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label  style="text-align: right !important;" for="username">{{ $t('employee_name') }}</label>
                  <Select required  v-model="deduction.employee_id"  option-value="id" filter :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.employee_id">{{ error.employee_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                  <label style="text-align: right !important;" for="username">{{ $t('deduction_type') }}</label>
                  <Select required  v-model="deduction.deduction_type_id"  option-value="id" filter :options="deduction_types" optionLabel="title" :placeholder='$t("deduction_type")' class="w-full" />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.deduction_type_id">{{ error.deduction_type_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_mount') }}</label>
                <InputNumber required class="text-center" v-model="deduction.value" :placeholder='$t("deduction_mount")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.value">{{ error.value[0] }}</div>
              </div>
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" for="username">{{ $t('deduction_date') }}</label>
                   <DatePicker  style="width: 100%" showButtonBar v-model.number="deduction.date" showIcon  :placeholder='$t("deduction_date")'   />   
                   <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
               </div> 
              <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" class="w-full " for="username">{{ $t('deduction_reason') }}</label>
                <InputText required class="text-center" v-model="deduction.reason" :placeholder='$t("deduction_reason")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.reason">{{ error.reason[0] }}</div>
              </div>
           <div class="w-full text-center">
            <Button @click="edite" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>