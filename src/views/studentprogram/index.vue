<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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

const  status=ref([
        { name: t("Pending"), code: -1 },
        { name: t("Accept"), code: 1 },
        { name: t("Cancell"), code: 0 },
      
      ])


onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/student-program").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });


}


const updateStatus=(id,status)=>{
  
  loading.value=true
 
  axios.get(`api/student-program/change-status/${id}?status=${status}`).then((res)=>{
      loading.value=false
      fetchData()
      });

}
const session =(id,program_id)=>{
  router.push({name:'sessions-update',params:{'id':id,'program_id':program_id} })
}


onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  router.push({name:'update-studentprograme',params:{'id':id} })
}


const openNew = () => {
  router.push({name:'create-studentprograme'})
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const deleteAction = () => {
  axios
    .delete(`/api/student-program/${confir_id.value}`)
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
        <Toolbar class="mb-4 shadow-md">
          <template #start>
            <div class="my-2">
            <Button  v-can="'room create'" :label='$t("add_sp")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button>
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
            <Button :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)"/>
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
          v-can="'student program details list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("room") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
         
           <Column field="name" :header='$t("child_name")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.student.name }}
            </template>
           </Column>
           <Column field="name" :header='$t("ProgramName")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.program.name }}
            </template>
           </Column>
         
           <Column field="price" :header='$t("price")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.program.price }}
            </template>
           </Column>
          
           <Column field="price" :header='$t("status")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <Dropdown  @update:model-value="updateStatus(slotProps.data.id,$event)"  :style="{ backgroundColor: slotProps.data.status == 1 ? '#10B981' : slotProps.data.status == -1 ? '#F59E0B' : slotProps.data.status == 0 ? '#EF4444' : 'transparent' }"     id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="slotProps.data.status"  option-value="code"  :options="status" optionLabel="name"   />

            </template>
           </Column>
         


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-can="'student-program edit'"            
                :label='$t("sumi_start")'
                class="create mt-2"
                @click="session(slotProps.data.student_id,slotProps.data.id)"
              />
                <Button
                v-can="'student-program edit'"  
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
                <Button
                v-can="'student-program delete'"
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