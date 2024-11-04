<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
const toast = useToast()
const models=ref([])
const model=ref('')
const relations=ref([])
const relation=ref('')
const columns=ref([])
const column=ref([])
const loading = ref(true)
const users = ref([
{
  name:'mohamed',  
  date:'date',  
  tiem:'tiem',  
  bons:'bons',  
},
{
  name:'mohamed',  
  date:'date',  
  tiem:'tiem',  
  bons:'bons',  
}


])
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const position=ref({})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get(`/api/report/select-report?lang=${localStorage.getItem("appLang")}`).then((res)=>{
    loading.value= false
    models.value= res.data.data
   
    console.log(users.value)

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const getreport=()=>{
    axios.post(`/api/report/generate-report?lang=${localStorage.getItem("appLang")}`,{
        model:model.value,
        columns:column.value,
        relations:relation.value
    }).then((res)=>{
    users.value= res.data.data

  });
}



const getrelation = (id) => {
    relation.value=''
    column.value=''
    axios.get(`/api/report/select-relations?lang=${localStorage.getItem("appLang")}&model=${id}`).then((res)=>{
    relations.value= res.data.data

  });
  axios.get(`/api/report/select-columns?lang=${localStorage.getItem("appLang")}&model=${id}`).then((res)=>{
    columns.value= res.data.data

  });
}





const exportCSV = () => {
  dt.value.exportCSV()
}


const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4  shadow-md">
          <template #start>
            <div class="my-2 grid lg:grid-cols-5 gap-4 grid-cols-1">
                <Dropdown @update:model-value="getrelation" v-model="model"  required id="pv_id_1" style="direction: ltr !important;"  option-value="id"  :options="models" optionLabel="model" :placeholder='$t("model_id")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <MultiSelect  v-model="relation"  required id="pv_id_1" style="direction: ltr !important;"  option-value="relation"  :options="relations" optionLabel="value" :placeholder='$t("relation_id")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <MultiSelect v-model="column"  required id="pv_id_1" style="direction: ltr !important;"  option-value="column"  :options="columns" optionLabel="value" :placeholder='$t("columns_id")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <Button  :label='$t("search")'  class="create" @click="getreport" />
<!--              <Button-->
<!--                label="Delete"-->
<!--                icon="pi pi-trash"-->
<!--                class="p-button-danger"-->
<!--                :disabled="!selectedProducts || !selectedProducts.length"-->
<!--                @click="confirmDeleteSelected"-->
<!--              />-->
            </div>
          </template>

          <template #end>
<!--            <FileUpload-->
<!--              mode="basic"-->
<!--              accept="image/*"-->
<!--              :max-file-size="1000000"-->
<!--              label="Import"-->
<!--              choose-label="Import"-->
<!--              class="mr-2 inline-block"-->
<!--            />-->
           
          </template>
        </Toolbar>

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
          v-can="'positions list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("posttion") }}</h5>
              <Button v-can="'positions list'" :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)"/>

             <div>
                
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
          
           
            
            
            <Column v-for="u,index in users" :field="index" :header="index" :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
               
            <template #body="slotProps">
               {{u }}
            </template>
           </Column> 
          
         

      
          


        
          <Column header-style="min-width:10rem;">
           
          </Column>



        </DataTable>
       
      
      </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>