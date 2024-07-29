<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Sideprofiletap from '../../components/Sideprofiletap.vue'
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




onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/evaluationheaders").then((res)=>{
    loading.value= false
    users.value= res.data.headers
    console.log(users.value)

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  router.push({name:'EditHeaders',params:{'id':id} })
}


const openNew = () => {
  router.push({name:'CreateHeaders'})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const deleteAction = () => {
  axios
    .delete(`/api/evaluationheaders/${confir_id.value}/delete`)
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
        <div class="relative">
          <Sideprofiletap></Sideprofiletap>
          <Button  v-can="'room create'" :label='$t("create_button")' icon="pi pi-plus" class="p-button-success mr-2 absolute top-3" @click="openNew"></Button>
          <Button v-can="'skills list'" :label='$t("export")' icon="pi pi-upload" class="export absolute top-3 ltr:left-[15%] rtl:right-[15%] " @click="exportCSV($event)"/>

        </div>
      
      

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
          v-can="'room show'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("headers") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
          <Column field="id" :header='$t("index")' :sortable="true" header-style="width:14%; min-width:14rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
           </Column>
           <Column field="title" :header='$t("header_title")' :sortable="true" header-style="width:18%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
           </Column>

           <Column field="type" :header='$t("header_type")' :sortable="true" header-style="width:14%; min-width:14rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.type }}
            </template>
           </Column>
          
           <Column field="capacity" :header='$t("min_age")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              months {{ " " + slotProps.data.min_age  }} 
            </template>
           </Column>
         


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-can="'room edit'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
                <Button
                v-can="'room delete'"
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
      </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>