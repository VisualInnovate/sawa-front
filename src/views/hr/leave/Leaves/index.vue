<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import LeavesNave from '../../../../components/LeavesNave.vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const allusers=ref([])
const loading = ref(true)
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
const leave=ref({})
const employee=ref({})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})
  const getallusers=()=>{
    axios.post("/api/users").then((res)=>{  
    allusers.value= res.data.users.data
    
  });
  }
 const fetchData= ()=>{


  axios.get("/api/leaves").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });
 


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()
getallusers()

})
const reject=(id)=>{
   
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


const go=()=>{
    router.push({name:'leave-setup' })
}


const got=()=>{
    router.push({name:'leave-balance' })
}
///// update

const confirm_reject=()=>{
    axios
    .post(`/api/leaves/reject-request/${confir_id.value}`,leave.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      levels.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const createcrude=()=>{
    axios
    .post('/api/leave-setup',employee.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      skill.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const accept = (id) => {
  loading.value=true
  axios
    .get(`/api/leaves/accept-request/${id}`)
    .then((res) => {
      
      loading.value=false
      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
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
  <div class="grid" style="overflow-x: scroll;">
    <div class="col-12">
      <va-card class="card">

           
            <LeavesNave></LeavesNave>
    

        <Toast/>


      <div style="" class="shadow-xl ">
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
          v-can="'skills list'"
        >
          <template #header>
            
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("leaves") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="employee.name" :header='$t("employee_name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column> 
           <Column field="reason" :header='$t("request_reason")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.reason }}
            </template>
           </Column> 
           <Column field="leave_setup.title" :header='$t("days")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.leave_setup.title }}
            </template>
           </Column> 
           <Column field="status" :header='$t("status")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <P v-if=" slotProps.data.status ==0 " class="bg-yellow-300 text-white w-24 text-center py-1 rounded-sm">pending</P>
               <P v-if=" slotProps.data.status ==1 " class="bg-[green] text-white w-24 text-center py-1 rounded-sm">accepted</P>
               <P v-if=" slotProps.data.status == -1 " class="bg-[red] text-white w-24 text-center py-1 rounded-sm">rejected</P>
          
            </template>
           </Column> 
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-if=" slotProps.data.status ==0 "
                v-can="'skills edit'"
                icon="pi pi-times"
                class="p-button-danger"
                @click="reject(slotProps.data.id)"
              />
                <Button
                v-if=" slotProps.data.status ==0 "
                v-can="'skills delete'"
                icon="pi pi-check"
                class="p-button-success"
                @click="accept(slotProps.data.id)"
              />
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
            <Button  :label='$t("no")' icon="pi pi-times" class=" p-button-text" @click="deleteDialog = false"/>
            <Button  :label='$t("yes")' icon="pi pi-check" class="p-button-text" @click="deleteAction"/>
          </template>
        </Dialog>
      
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center"  v-model="leave.rejected_reason" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.name[0] }}</div>
            </div>
           
           <div class="w-full text-center">
            <Button @click="confirm_reject" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>