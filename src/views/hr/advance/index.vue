<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import moment from "moment";
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { useI18n } from 'vue-i18n'
import InputNumber from 'primevue/inputnumber';

const { t } = useI18n()
const toast = useToast()
const submitted=ref(false)
const loading = ref(true)
const employees=ref([])
const user = ref({})
const users = ref(null)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const advance=ref({})
const updatedialog=ref(false)
const  status=ref([
        { name: t("Pending"), code: 0 },
        { name: t("Accept"), code: 1 },
        { name: t("Cancell"), code: -1 },
      
      ])
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/financial-advance").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });
  axios.get("/api/employees").then((res)=>{
   
    employees.value= res.data.data

  });


}

const updateStatus=(id,status)=>{
  
    loading.value=true
   
    axios.get(`/api/financial-advance/change-status/${id}?status=${status}`).then((res)=>{
        loading.value=false
        fetchData()
        });

}

onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/financial-advance/${id}`).then((res)=>{

        advance.value= res.data.data
    

  });
  confir_id.value=id
  updatedialog.value=!(updatedialog.value)
}


///// update

const update=()=>{
    axios
    .put(`/api/financial-advance/${confir_id.value}`,advance.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_update_success")}`, life: 3000 });

      advance.value = ref({})
    })
    .catch((el)=>{
      toast.add({ severity: 'error', summary: t("error"), detail: `${t("mission_error")}`, life: 3000 });

    })
}

const openNew = () => {
    submitted.value=!(submitted.value)
    createdialog.value=!(createdialog.value)
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const create=()=>{
    axios
    .post('/api/financial-advance',advance.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_add_success")}`, life: 3000 });
      advance.value = ref({})
    })
    .catch((el)=>{
      toast.add({ severity: 'error', summary: t("error"), detail: `${t("mission_error")}`, life: 3000 });
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/financial-advance/${confir_id.value}`)
    .then((res) => {
      console.log(res.data)
      deleteDialog.value=false
      fetchData()
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_delete_success")}`, life: 3000 });

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
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="page">
        <Toolbar>
          <template #start>
            <div class="my-2">
            <Button v-can="'financial advance create'" :label='$t("advance")' icon="pi pi-plus" class="mr-2" @click="openNew"></Button>
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
            <Button v-can="'financial advance list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
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
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'financial advance list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("advances") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

        
          <Column field="employee.name" :header='$t("employee_name")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column>
           <Column field="amount" :header='$t("advance_mount")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.amount }}
            </template>
           </Column>
           <Column field="date" :header='$t("advance_date")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.date }}
            </template>
           </Column>
           <Column field="status" :header='$t("status")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
                <Select  :disabled="!$can('financial advance edit')" @update:model-value="updateStatus(slotProps.data.id,$event)"  :style="{ backgroundColor: slotProps.data.status == 1 ? '#10B981' : slotProps.data.status == -1 ? '#EF4444' : slotProps.data.status == 0 ? '#F59E0B' : 'transparent' }" v-model="slotProps.data.status"  option-value="code"  :options="status" optionLabel="name"   />

               
            </template>
           </Column>

      
          


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div class="table-actions">
                <Button
                v-can="'financial advance edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
                <Button
                v-can="'financial advance delete'"
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
        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <form @submit.prevent="create">
            <div class="flex flex-column gap-2">
                    <label class="text-start ">{{ $t("employee_name") }}</label>     
                    <Select required v-model="advance.employee_id"  option-value="id" :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full"  :class="{ 'p-invalid': submitted && !advance.employee_id }"/>
                </div>
          
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('advance_mount') }}</label>
                <InputNumber required class="text-center" v-model="advance.amount"  :class="{ 'p-invalid': submitted && !advance.amount}"/>
            </div>
           
           <div class="w-full text-center">
            <Button type="submit" @click="submitted=true" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>  
          </form>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <form @submit.prevent="update">
            <div class="flex flex-column gap-2">
                    <label class="text-start ">{{ $t("employee_name") }}</label>     
                    <Select required v-model="advance.employee_id"  option-value="id" :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full"  :class="{ 'p-invalid': submitted && !advance.employee_id }"/>
                </div>
          
            <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('advance_mount') }}</label>
                <InputNumber required class="text-center" v-model="advance.amount"  :class="{ 'p-invalid': submitted && !advance.amount}"/>
            </div>
           <div class="w-full text-center">
            <Button type="submit" @click="submitted=true" class="m-auto w-[50%] my-4" :label='$t("submit")' severity="success"></Button> 
           </div>  
          </form>
        </Dialog>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>