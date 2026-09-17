<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount,computed} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import { get } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
const toast = useToast()
const { t } = useI18n();
const models=ref([])
const model=ref('')
const maxSelection=ref(6)
const relations=ref([])
const relation=ref('')
const columns=ref([])
const column=ref([])
const loading = ref(true)
const reportLoading = ref(false)
const users = ref([])
const productDialog = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null);
const filters = ref({})
const createdialog=ref(false)
const position=ref({})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})
const filteredColumns = computed(() => {
  const all = Array.isArray(columns.value) ? columns.value : []
  const selected = Array.isArray(column.value) ? column.value : []
  // No column picked yet: show every column the report returned.
  return selected.length ? all.filter(u => selected.includes(u.column)) : all
});
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

    const related=[]
    ;(Array.isArray(relation.value) ? relation.value : []).forEach(item =>{
      related.push(item.relation)
    })
    reportLoading.value = true
    axios.post(`/api/report/generate-report?lang=${localStorage.getItem("appLang")}`,{
        model:model.value,
        columns:columns.value,
        relations:related
    }).then((res)=>{
    users.value= res.data.data ?? []
  }).catch(() => {
    toast.add({ severity: 'error', summary: t('error'), detail: t('failed_to_fetch_results'), life: 3000 })
  }).finally(() => {
    reportLoading.value = false
  });
}


const getrelationColum=(data)=>{
  const related_ids=[]
  data.forEach(item =>{
      related_ids.push(item.id)
    })
  axios.get(`/api/report/select-columns?lang=${localStorage.getItem("appLang")}&model=${related_ids}`).then((res)=>{
    res.data.data.forEach(num => {
      columns.value.push(num)
    });

  });
}
const getrelation = (id) => {
    relation.value=[]
    column.value=[]
    columns.value=[]
    users.value=[]
    axios.get(`/api/report/select-relations?lang=${localStorage.getItem("appLang")}&model=${id}`).then((res)=>{
    relations.value= res.data.data

  });
  axios.get(`/api/report/select-columns?lang=${localStorage.getItem("appLang")}&model=${id}`).then((res)=>{
    columns.value= res.data.data

  });
}





const exportCSV = () => {
  if (users.value.length === 0) {
    toast.add({ severity: 'warn', summary: t('no_data'), detail: t('no_data_to_export'), life: 3000 });
    return;
  }
  if (!dt.value) {
    console.error("DataTable reference (dt) is not bound.");
    return;
  }
  if (typeof dt.value.exportCSV !== 'function') {
    console.error("exportCSV method is not available on the DataTable.");
    return;
  }
  dt.value.exportCSV({ fileName: 'report.csv' });
};

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
};
</script>

<template>
  
  <div class="grid">
    <div class="col-12">
      <div class="page">
        <Toolbar class="mb-4  shadow-md">
          <template #start>
            <div class="my-2 grid md:grid-cols-5 gap-4 grid-cols-1">
                <Select @update:model-value="getrelation" v-model="model"  required  option-value="id"  :options="models" optionLabel="model" :placeholder='$t("model_id")' class="w-full" />
                <MultiSelect    :maxSelectedLabels="maxSelection" :selectionLimit="maxSelection"  @update:model-value="getrelationColum"      :loading="model == ''"  v-model="relation"  required  :options="relations" optionLabel="value" :placeholder='$t("relation_id")' class="w-full" />
                <MultiSelect   :maxSelectedLabels="maxSelection" :selectionLimit="maxSelection" :loading="relation == ''"   v-model="column"  required  option-value="column"  :options="columns" optionLabel="value" :placeholder='$t("columns_id")' class="w-full" />
                <Button  :label='$t("search")'  @click="getreport" />
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


      <div  style="" class="shadow-xl overflow-scroll">
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="users"
           :loading="reportLoading"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'reports list'"
        >
                  <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("reports") }}</h5>
              <Button v-can="'reports list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />

            
            </div>
          </template>

          
         

        
          
           
            
            
          <Column v-for="(u, index) in filteredColumns" :key="index" :field="index" :header="u.value" :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data[u.value] }}
            </template>
          </Column>

        
          <Column header-style="min-width:10rem;">
           
          </Column>



        </DataTable>
       
      
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>