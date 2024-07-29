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
const levels=ref({})
const leave=ref({})
const updatedialog=ref(false)
const leave_setup_type=ref()
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/leave-setup").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });
 


}
 const defult_type=()=>{
  leave.value.days=null
  leave.value.hours=null
 }
 const arr= ()=>{
      return leave_setup_type.value =[
            
                { name:'daily' , value:'daily' },
                { name:'hourly' , value:'hourly'},

               
               
            ]
    }


onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/leave-setup/${id}`).then((res)=>{
    loading.value= false
    leave.value= res.data.data
    console.log(users.value)

  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const editescrud=()=>{
  const body = new FormData();
    axios
    .put(`/api/leave-setup/${confir_id.value}`,leave.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      leave.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    leave.value=ref({})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const createcrude=()=>{
    axios
    .post('/api/leave-setup',leave.value)
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
const deleteAction = () => {
  axios
    .delete(`/api/leave-setup/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
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
      <va-card class="card" >
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
              <Button v-can="'skills create'" :label='$t("create_button")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button>
              <h5 class="m-0 my-auto">{{ $t("leave setup") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="type" :header='$t("leave_setup_type")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.type }}
            </template>
           </Column> 
           <Column field="title" :header='$t("title")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
           </Column> 
           <Column field="days" :header='$t("days")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.days }}
              <p class="text-3xl" v-if="slotProps.data.days == null "> - </p>
            </template>
           </Column> 
           <Column field="hours" :header='$t("hours")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.hours }}
              <p class="text-3xl" v-if="slotProps.data.hours == null "> - </p>
            </template>
           </Column> 
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-can="'skills edit'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
                <Button
                v-can="'skills delete'"
                icon="pi pi-trash"
                class="delete mt-2"
                @click="confirmDelete(slotProps.data.id)"
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
        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('leave_setup_type') }}</label>
                  <Dropdown v-model="leave.type"  required id="pv_id_1" style="direction: ltr !important;"  option-value="value"  :options="arr()" optionLabel="name" :placeholder='$t("leave_setup_type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
              
                <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="leave.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div v-show="leave.type == 'daily'" class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('days') }}</label>
                  <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.days" :placeholder='$t("days")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.days">{{ error.days[0] }}</div>
            </div>
            <div v-show="leave.type == 'hourly'"  class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('hours') }}</label>
                  <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.hours" :placeholder='$t("hours")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.hours">{{ error.hours[0] }}</div>
            </div>
           
           <div class="w-full text-center">
            <Button @click="createcrude" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('leave_setup_type') }}</label>
                  <Dropdown v-model="leave.type" @update:model-value="defult_type" required id="pv_id_1" style="direction: ltr !important;"  option-value="value"  :options="arr()" optionLabel="name" :placeholder='$t("leave_setup_type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
              
                <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="leave.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div v-if="leave.type == 'daily'" class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('days') }}</label>
                  <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.days" :placeholder='$t("days")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.days">{{ error.days[0] }}</div>
            </div>
            <div v-if="leave.type == 'hourly'"  class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('hours') }}</label>
                  <InputNumber  required class="bg-[#f7f5f5]" v-model="leave.hours" :placeholder='$t("hours")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.hours">{{ error.hours[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="editescrud" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>