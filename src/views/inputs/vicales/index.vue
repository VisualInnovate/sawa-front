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


  axios.get("/api/vehicle").then((res)=>{
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
  router.push({name:'transportation-update',params:{'id':id} })
}


const openNew = () => {
  router.push({name:'transportation-create'})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const deleteAction = () => {
  axios
    .delete(`/api/vehicle/${confir_id.value}`)
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
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button v-can="'vehicle create'" :label='$t("create_button")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
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
            <Button  v-can="'vehicle list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
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
          v-can="'vehicle list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("veciles") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="users.name" :header='$t("driver_name")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.users.name }}
            </template>
           </Column>

           <Column field="plate_number" :header='$t("Vehicle_ID")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.plate_number }}
            </template>
           </Column>
           <Column field="insurance_exp_date" :header='$t("Insurance_date")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.insurance_exp_date }}
            </template>
           </Column>
           <Column field="license_exp_date" :header='$t("License_expiration")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.license_exp_date }}
            </template>
           </Column>
           <Column field="type" :header='$t("vecile_type")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ $t(['vehicle_type.car', 'vehicle_type.bus', 'vehicle_type.minibus'][slotProps.data.type] ?? 'vehicle_type.unknown') }}
           
            </template>
           </Column>


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-can="'vehicle edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'vehicle delete'"
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
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>