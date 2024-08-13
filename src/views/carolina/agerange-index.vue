<template>
    <CarolianaTab></CarolianaTab>
    <v-card class="p-[1%]" >
        <Button  :label='$t("create_button")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button>

          <div class="grid grid-cols-1 lg:grid-cols-3 ">
             <div v-for="data,index in users" class="grid grid-cols-3 m-[1%] shadow-md p-[2%] bg-gray-200 rounded-md">
               <div class="col-span-2">
                <div class="flex">
                      <h3 class="text-base font-bold " >  {{ $t("index") }}</h3>
                      <p> : {{ index +1}}</p>
                   </div>
                   <div style="overflow: hidden !important;" class="flex max-w-full">
                      <h3 class="text-base font-bold " style="word-wrap: break-word;" >{{ $t("name") }}</h3>
                      <p >: {{ data.name }}</p>
                   </div>
                 
               </div>
               <div class="flex">
                <Button  icon="pi pi-pencil" class="p-button-rounded p-button-success m-auto" @click="edit(data.id)"/>
                <Button   icon="pi pi-trash" class="p-button-rounded delete p-button-success m-auto" @click="confirmDelete(data.id)"/>
               </div>
             </div>

             <!-- delete and create -->
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
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('sympol') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.symbol" :placeholder='$t("sympol")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.symbol">{{ error.symbol[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="createcrude" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('sympol') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.symbol" :placeholder='$t("sympol")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.symbol">{{ error.symbol[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="editescrud" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>

             <div>

             </div>
            
          </div>
    </v-card>
  </template>

<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import CarolianaTab from '../../components/CarolianaTab.vue'
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()

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
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/carolina-age-range").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  router.push({name:'agerange-update' , params:{'id':id}})
}


///// update

const editescrud=()=>{
    axios
    .put(`/api/able-category/${confir_id.value}`,levels.value)
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
    router.push({name:'agerange-create'})
}


const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const createcrude=()=>{
    axios
    .post('/api/able-category',levels.value)
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
    .delete(`/api/carolina-age-range/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
    })
    .catch(() => {})

}




const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

  
  <style scoped>
  /* Additional styling if needed */
  </style>
  