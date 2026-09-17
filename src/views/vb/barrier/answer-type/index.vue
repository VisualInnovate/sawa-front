<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Barrier from '../../../../components/Barrier.vue'
// import ProductService from '@/service/ProductService';
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
const all_levels=ref([])
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/barrier-answer-type").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });


}
const alllevel=()=>{
    axios.get("/api/barrier-subtest").then((res)=>{
        all_levels.value=res.data.data

  });
}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()
alllevel()

})
const edit=(id)=>{
    axios.get(`/api/barrier-answer-type/${id}`).then((res)=>{
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
    .post(`/api/barrier-answer-type/${confir_id.value}`,levels.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      levels.value = {}
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    levels.value = {}
    error.value = ''
    createdialog.value=!(createdialog.value)
}


const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const createcrude=()=>{
    axios
    .post('/api/barrier-answer-type',levels.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
      levels.value = {}
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/barrier-answer-type/${confir_id.value}`)
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
        <Barrier></Barrier>
       

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
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('products')}`"
          responsive-layout="scroll"
          v-can="'barrier answer type list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <Button v-can="'barrier answer type create'" :label='$t("create_button")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>

              <h5 class="page-title">{{ $t("answer_type") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="name" :header='$t("name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
           </Column> 
           <Column field="index" :header='$t("question_number")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.index }}
            </template>
           </Column> 
          
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-can="'barrier answer type edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'barrier answer type delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
              </div>
            </template>
          </Column>



        </DataTable>
        <Dialog v-model:visible="deleteDialog" :style="{ width: '550px' }" :header='$t("submit")' :modal="true">
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
                  <label class="w-full text-start" for="username">{{ $t('title') }}</label>
                <InputText required class="text-center" v-model="levels.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
          
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('question_number') }}</label>
                  <InputNumber required v-model="levels.index" :placeholder='$t("question_number")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.index">{{ error.index[0] }}</div>
            </div>
           
           <div class="w-full text-center">
            <Button @click="createcrude" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '550px' }" :header='$t("submit")' :modal="true">
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('title') }}</label>
                <InputText required class="text-center" v-model="levels.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
          
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('question_number') }}</label>
                  <InputNumber required v-model="levels.index" :placeholder='$t("question_number")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.index">{{ error.index[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="editescrud" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>