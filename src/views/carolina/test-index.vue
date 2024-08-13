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
                      <h3 class="text-base font-bold " style="word-wrap: break-word;" >{{ $t("parent_category") }}</h3>
                      <p >: {{ data.category.title }}</p>
                   </div>
                   <div style="overflow: hidden !important;" class="flex max-w-full">
                      <h3 class="text-base font-bold " style="word-wrap: break-word;" >{{ $t("skills") }}</h3>
                      <p >: {{ data.skill }}</p>
                   </div>
                   <div style="overflow: hidden !important;" class="flex max-w-full">
                      <h3 class="text-base font-bold " style="word-wrap: break-word;" >{{ $t("sympol") }}</h3>
                      <p >: {{ data.symbol }}</p>
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
                    <label class="text-right" for="username">{{ $t('parent_category') }}</label>
                    <Dropdown @update:model-value="getage_range"  required id="pv_id_1" style="direction: ltr !important;" v-model="levels.category_id"  option-value="id" :options="allcat" optionLabel="title" :placeholder='$t("parent_category")' class="w-full text-center bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.category_id">{{ error.category_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label class="text-right" for="username">{{ $t('age_range') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="levels.age_group_id"  option-value="id" :options="age_range" optionLabel="name" :placeholder='$t("age_range")' class="w-full text-center bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.age_group_id">{{ error.age_group_id[0] }}</div>
                </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('skills') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.skill" :placeholder='$t("skills")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.skill">{{ error.skill[0] }}</div>
            </div>

            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('sympol') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.symbol" :placeholder='$t("sympol")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.symbol">{{ error.symbol[0] }}</div>
            </div>
            <div class="flex">
                <div class="flex flex-column gap-2 ">
                  <label  class="invisible w-full text-right" for="username">{{ $t('goal') }}</label>
                  <Button   @click="addarry"  class="create my-auto  mx-2" icon="pi pi-plus" ></Button>
                </div>

                <div class="flex flex-column gap-2 w-[89%]">
                    <label class="w-full text-right" for="username">{{ $t('goal') }}</label>
                    <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.goal" :placeholder='$t("goal")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.skill">{{ error.skill[0] }}</div>
                </div>
            </div>
            
            <div class="flex flex-col col-span-2 gap-2 my-5">
                    <div class="flex relative bg-slate-200 rounded-md p-4 h-14" v-for=" mou,index in levels.goals">
                        <span class="my-auto ">{{ index+1 }} - </span>
                        <span>{{ $t("from") }}</span>
                        <p class="px-1 text-green-500 text-xl  w-full" style="text-align: center;">{{ index+1 }} - {{ mou.body }}</p>
                        <Button   @click="deletearray(index)"  class="delete m-auto absolute top-1 ltr:right-2 rtl:left-2  " icon="pi pi-minus" ></Button>
                    </div>
            </div>
           <div class="w-full text-center">
            <Button @click="createcrude" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
           
            <div class="flex flex-column gap-2">
                    <label class="text-right" for="username">{{ $t('parent_category') }}</label>
                    <Dropdown @update:model-value="getage_range"  required id="pv_id_1" style="direction: ltr !important;" v-model="levels.category_id"  option-value="id" :options="allcat" optionLabel="title" :placeholder='$t("parent_category")' class="w-full text-center bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.category_id">{{ error.category_id[0] }}</div>
                </div>
                <div class="flex flex-column gap-2">
                    <label class="text-right" for="username">{{ $t('age_range') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="levels.age_group_id"  option-value="id" :options="age_range" optionLabel="name" :placeholder='$t("age_range")' class="w-full text-center bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.age_group_id">{{ error.age_group_id[0] }}</div>
                </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('skills') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.skill" :placeholder='$t("skills")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.skill">{{ error.skill[0] }}</div>
            </div>

            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('sympol') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.symbol" :placeholder='$t("sympol")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.symbol">{{ error.symbol[0] }}</div>
            </div>
            <div class="flex">
                <div class="flex flex-column gap-2 ">
                  <label  class="invisible w-full text-right" for="username">{{ $t('goal') }}</label>
                  <Button   @click="addarry"  class="create my-auto  mx-2" icon="pi pi-plus" ></Button>
                </div>

                <div class="flex flex-column gap-2 w-[89%]">
                    <label class="w-full text-right" for="username">{{ $t('goal') }}</label>
                    <InputText required class="bg-[#f7f5f5] text-center" v-model="levels.goal" :placeholder='$t("goal")' />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.skill">{{ error.skill[0] }}</div>
                </div>
            </div>
            
            <div class="flex flex-col col-span-2 gap-2 my-5">
                    <div class="flex relative bg-slate-200 rounded-md p-4 h-14" v-for=" mou,index in levels.goals">
                        <span class="my-auto ">{{ index+1 }} - </span>
                        <span>{{ $t("from") }}</span>
                        <p class="px-1 text-green-500 text-xl  w-full" style="text-align: center;">{{ index+1 }} - {{ mou.body }}</p>
                        <Button   @click="deletearray(index)"  class="delete m-auto absolute top-1 ltr:right-2 rtl:left-2  " icon="pi pi-minus" ></Button>
                    </div>
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
const allcat=ref({})
const loading = ref(true)
const user = ref({})
const error = ref('')
const users = ref(null)
const age_range=ref({})
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const levels=ref({
    goals:[]
})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/carolina-test").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });

}
const getallcatogray=()=>{
    axios.get("/api/carolina-category/list/sub").then((res)=>{
    loading.value= false
    allcat.value= res.data.data
    console.log(users.value)

  }); 
}

const getage_range=(id)=>{
  axios.post(`/api/carolina-category/get-age-groups/${id}`).then((res)=>{
    age_range.value=res.data.data
    
  });
}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

getallcatogray()

})
const edit=(id)=>{
    axios.get(`/api/carolina-test/${id}`).then((res)=>{
        
        levels.value.category_id=res.data.data.category_id
   

        
   
 

  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}
const addarry=()=>{
    
    levels.value.goals.push({ body: `${levels.value.goal}`})
}
const deletearray=(index)=>{
    levels.value.goals.splice(index,1)
}



///// update

const editescrud=()=>{
    axios
    .put(`/api/carolina-test/${confir_id.value}`,levels.value)
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
    axios.post('/api/carolina-test',levels.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/carolina-test/${confir_id.value}`)
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
  