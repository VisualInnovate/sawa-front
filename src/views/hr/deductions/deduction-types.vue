<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Deduction from '../../../components/hr/Deduction.vue'
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const submitted=ref(false)
const loading = ref(true)
const user = ref({})
const error = ref('')
const deductions = ref(null)
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const deduction=ref({})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/deduction-types").then((res)=>{
    loading.value= false
    deductions.value= res.data.data
   

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const show=(id)=>{
    axios.get(`/api/deduction-types/${id}`).then((res)=>{
    loading.value= false
    deduction.value= res.data.data


  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const edit=()=>{
    axios
    .put(`/api/deduction-types/${confir_id.value}`,deduction.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_update_success")}`, life: 3000 });
      deduction.value = ref({})
    })
    .catch((el)=>{
      toast.add({ severity: 'error', summary: t("error"), detail: `${t("mission_error")}`, life: 3000 });

    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    deduction.value={}
    submitted.value=false
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const create=()=>{
    axios
    .post('/api/deduction-types',deduction.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_add_success")}`, life: 3000 });

      deduction.value = ref({})
    })
    .catch((el)=>{
      toast.add({ severity: 'error', summary: t("error"), detail: `${t("mission_error")}`, life: 3000 });

    })
}
const deleteAction = () => {
  axios
    .delete(`/api/deduction-types/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_delet_success")}`, life: 3000 });
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: t("error"), detail: `${t("mission_error")}`, life: 3000 });
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
      <va-card class="card">
        <div class="relative">
          <Deduction ></Deduction>
          <Button  v-can="'skills create'" :label='$t("deduction_add")' icon="pi pi-plus" class="p-button-success mr-2 absolute top-3" @click="openNew"></Button>
          <Button v-can="'skills list'" :label='$t("export")' icon="pi pi-upload" class="export absolute top-3 ltr:left-[15%] rtl:right-[15%] " @click="exportCSV($event)"/>

        </div>
        
        
     

        <Toast/>


      <div style="" class="shadow-xl ">
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
          current-page-report-template="Showing {first} to {last} of {totalRecords} products"
          responsive-layout="scroll"
          v-can="'skills list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("deductions") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="title" :header='$t("title")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
           </Column>

      
          


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-if="slotProps.data.id != '1'"
                v-can="'skills edit'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="show(slotProps.data.id)"
              />
                <Button
                v-if="slotProps.data.id != '1'"
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
           <form @submit.prevent="create" >

            
            <div class="flex flex-column gap-2">
                  <p class="w-full text-right" for="username">{{ $t('deduction_title') }}</p>
                <InputText  class="bg-[#f7f5f5] " v-model="deduction.title" :class="{ 'p-invalid': submitted && !deduction.title }" />
                <small v-if="submitted && !deduction.title" class="p-invalid text-red-600 w-full text-center" > {{$t("deduction_title") + ' ' + $t("required") }}.</small>  

            </div>
           <div class="w-full text-center">
            <Button @click="submitted=true" type="submit" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div> 
           </form>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <form @submit.prevent="edit" >

            
            <div class="flex flex-column gap-2">
                  <p class="w-full text-right" for="username">{{ $t('deduction_title') }}</p>
                <InputText  class="bg-[#f7f5f5] " v-model="deduction.title" :class="{ 'p-invalid': submitted && !deduction.title }" />
                <small v-if="submitted && !deduction.title" class="p-invalid text-red-600 w-full text-center" > {{$t("deduction_title") + ' ' + $t("required") }}.</small>  

            </div>
            <div class="w-full text-center">
            <Button @click="submitted=true" type="submit" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
            </div> 
          </form>
        </Dialog>
      </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>