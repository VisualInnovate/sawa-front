<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Evaluation from '../../../components/Evaluation.vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const alllevels=ref({})
const loading = ref(true)
const user = ref({})
const error = ref('')
const value=ref('')
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
const questions =ref([])
const Subtests=ref([])
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/milestone-question").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });


}


const getdatafilter=(id)=>{
  loading.value= true
  axios.get(`/api/milestone-subtest/filter/${id}`).then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });
}
const getSubtests=()=>{
  axios.get("/api/milestone-subtest").then((res)=>{
    
    Subtests.value= res.data.data
  

  });
}
const getquestions=()=>{
  axios.get("/api/mileston-question-type").then((res)=>{
  
    questions.value= res.data.data
    

  });
}
const filterlevel=()=>{
  axios.get("/api/mileston-levels").then((res)=>{
   
    alllevels.value= res.data.data
    

  });
}


onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()
filterlevel()
getquestions()
getSubtests()
})
const edit=(id)=>{
    axios.get(`/api/milestone-question/${id}`).then((res)=>{
    loading.value= false
    levels.value= res.data.data
    console.log(users.value)

  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const editescrud=()=>{
    axios
    .put(`/api/milestone-question/${confir_id.value}`,levels.value)
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
    .post('/api/milestone-question',levels.value)
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
    .delete(`/api/milestone-question/${confir_id.value}`)
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
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Evaluation></Evaluation>
       
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
              <h5 class="m-0 my-auto">{{ $t("questions") }}</h5>
              <Dropdown  @update:model-value="getdatafilter" required id="pv_id_1" v-model="value" style="direction: ltr !important;"  option-value="id" :options="alllevels" optionLabel="title" :placeholder='$t("level_id")' class=" bg-[#f7f5f5] [&>div>div>span]:bg-black my-auto md:w-14rem h-12" />

             <div>
              
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
          
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="name" :header='$t("name")' :sortable="true" header-style="width:26%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
           </Column> 
           <Column field="name" :header='$t("question_type_name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data?.subtest?.level.title }}
            </template>
           </Column> 
           <Column field="name" :header='$t("level_id")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data?.question_type.title }}
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
        <!-- 
        نقاط القوة (في حال الاجابة ب صفر)
        نقاط الضعف (في حال الاجابة ب صفر)

        -->
        <Dialog v-model:visible="createdialog" :style="{ width: '550px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.title" ></v-textarea>
              
                <div class="mt-1 mb-5 text-red-500" v-if="error?.sympol">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('strength_title') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.strength_title" ></v-textarea>

                <div class="mt-1 mb-5 text-red-500" v-if="error?.strength_title">{{ error.strength_title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('weakness_title') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.weakness_title" ></v-textarea>
                <div class="mt-1 mb-5 text-red-500" v-if="error?.weakness_title">{{ error.weakness_title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('strength_title_0') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.strength_0_title" ></v-textarea>

                <div class="mt-1 mb-5 text-red-500" v-if="error?.strength_title">{{ error.strength_title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('weakness_title_0') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.weakness_0_title" ></v-textarea>
                <div class="mt-1 mb-5 text-red-500" v-if="error?.weakness_title">{{ error.weakness_title[0] }}</div>
            </div>
          <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('question_type_name') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="levels.question_type_id"  option-value="id" filter :options="questions" optionLabel="title" :placeholder='$t("question_type_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.question_type_id">{{ error.question_type_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('Subtest_id') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="levels.subtest_id"  option-value="id" filter :options="Subtests" optionLabel="title" :placeholder='$t("Subtest_id")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.subtest_id">{{ error.subtest_id[0] }}</div>
            </div>
           
           <div class="w-full text-center">
            <Button @click="createcrude" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '550px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                  <v-textarea  bg-color="#EAE8E9" v-model="levels.title" ></v-textarea>
                 
              
                <div class="mt-1 mb-5 text-red-500" v-if="error?.sympol">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('strength_title') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.strength_title" ></v-textarea>

                <div class="mt-1 mb-5 text-red-500" v-if="error?.strength_title">{{ error.strength_title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('weakness_title') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="levels.weakness_title" ></v-textarea>
                <div class="mt-1 mb-5 text-red-500" v-if="error?.weakness_title">{{ error.weakness_title[0] }}</div>
            </div>
          <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('question_type_name') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="levels.question_type_id"  option-value="id" filter :options="questions" optionLabel="title" :placeholder='$t("question_type_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.question_type_id">{{ error.question_type_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('Subtest_id') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="levels.subtest_id"  option-value="id" filter :options="Subtests" optionLabel="title" :placeholder='$t("Subtest_id")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.subtest_id">{{ error.subtest_id[0] }}</div>
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