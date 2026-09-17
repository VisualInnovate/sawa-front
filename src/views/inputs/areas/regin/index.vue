<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const permissions=ref([
{ name: ' ', code: ' ' },
])
const areass=ref([
{ name: ' ', code: ' ' },
])

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
const areas=ref([])
const region_name=ref('')
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/region").then((res)=>{
    
    users.value= res.data.data
    console.log(users.value)

  });
  axios.post("/api/region/Allregion").then((res)=>{
    permissions.value= res.data.regions.map(event => ({
              name:event
             
            }));

    loading.value= false

  });

}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  region_name.value=''
  areas.value=[]
    axios.get(`/api/region/getareabyregion/${id}`).then((res)=>{
    loading.value= false
    axios.post(`/api/region/getareabyregion`,{
    region_name:res.data.data.region_name
  }).then((res)=>{
    
    areass.value= res.data.areas.map(event => ({
              name:event
             
            }));

  });
    region_name.value= res.data.data.region_name
    for (let i = 0; i < res.data.data.areas.length; i++) {
      console.log(res.data.data.areas[0])
    
      areas.value.push(res.data.data.areas[i].area_name)
}
   

  });
   console.log( areas.value)
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


const getoneregin=(e)=>{
  console.log(e)
  axios.post(`/api/region/getareabyregion`,{
    region_name:e
  }).then((res)=>{
    
    areass.value= res.data.areas.map(event => ({
              name:event
             
            }));

  });
}

///// update

const editeroles=()=>{
    axios
    .post(`/api/region/update/region/${confir_id.value}`,{
      region_name:region_name.value,
      areas:areas.value
    })
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: t('successful'), life: 3000})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
  areass.value=[]
  region_name.value=''
  areas.value=[]
    createdialog.value=!(createdialog.value)
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const createrole=()=>{
    axios
    .post('/api/region/create-region-with-areas',{
      region_name:region_name.value,
      areas:areas.value

    })
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: t('success_message'), detail: ' Successful', life: 3000})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const deleteAction = () => {
  axios
    .delete(`/api/region/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      fetchData()
      deleteDialog.value=false
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
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button        v-can="'region create'"  :label='$t("area")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
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
            <Button  v-can="'region list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
          </template>
        </Toolbar>

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
          v-can="'region list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("area") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>

          
          <Column field="index" :header='$t("index")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
           </Column> 

           <Column field="name" :header='$t("name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
           </Column>

      
          


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-can="'region edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'region delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data.id)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
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
            <Button  :label='$t("no")' icon="pi pi-times" @click="deleteDialog = false" variant="text" severity="secondary" />
            <Button  :label='$t("yes")' icon="pi pi-check" @click="deleteAction" severity="danger" />
          </template>
        </Dialog>
        <Dialog v-model:visible="createdialog" :style="{ width: '550px' }" :header='$t("area")' :modal="true">
          <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-start" for="username">{{ $t('name') }}</label>
                  <Select v-model="region_name" editable :options="permissions" @update:model-value="getoneregin"  optionLabel="name"  :placeholder='$t("name")' option-value="name"
                  class="text-center"/>

                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-start" for="username">{{ $t('area_name') }}</label>
                  <MultiSelect v-model="areas" filter option-value="name" :options="areass" optionLabel="name" :placeholder='$t("area_name")'
              class="w-full md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="createrole" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '550px' }" :header='$t("area")' :modal="true">
          <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-start" for="username">{{ $t('name') }}</label>
                  <Select v-model="region_name" editable :options="permissions" @update:model-value="getoneregin"  optionLabel="name"  :placeholder='$t("name")' option-value="name"
                  class="text-center"/>

                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-start" for="username">{{ $t('area_name') }}</label>
                  <MultiSelect v-model="areas" filter option-value="name" :options="areass" optionLabel="name" :placeholder='$t("area_name")'
              class="w-full md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="editeroles" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>