<script setup>
import {FilterMatchMode} from 'primevue/api'
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
    skill.value={}
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
      <va-card class="card">
        <Toolbar class="mb-4 shadow-md">
          <template #start>
            <div class="my-2">
            <Button v-can="'holidays create'" :label='$t("advance")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button>
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
            <Button v-can="'holidays list'" :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)"/>
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
          v-can="'holidays list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("advances") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
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
                <Dropdown  @update:model-value="updateStatus(slotProps.data.id,$event)"  :style="{ backgroundColor: slotProps.data.status == 1 ? '#10B981' : slotProps.data.status == -1 ? '#EF4444' : slotProps.data.status == 0 ? '#F59E0B' : 'transparent' }"     id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="slotProps.data.status"  option-value="code"  :options="status" optionLabel="name"   />

               
            </template>
           </Column>

      
          


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-can="'holidays edit'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
                <Button
                v-can="'holidays delete'"
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
          <form @submit.prevent="create">
            <div class="flex flex-column gap-2">
                    <label class="text-right ">{{ $t("employee_name") }}</label>     
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="advance.employee_id"  option-value="id" :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full "  :class="{ 'p-invalid': submitted && !advance.employee_id }"/>
                </div>
          
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('advance_mount') }}</label>
                <InputNumber required class="bg-[#f7f5f5] text-center" v-model="advance.amount"  :class="{ 'p-invalid': submitted && !advance.amount}"/>
            </div>
           
           <div class="w-full text-center">
            <Button type="submit" @click="submitted=true" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>  
          </form>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <form @submit.prevent="update">
            <div class="flex flex-column gap-2">
                    <label class="text-right ">{{ $t("employee_name") }}</label>     
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="advance.employee_id"  option-value="id" :options="employees" optionLabel="name" :placeholder='$t("employee_name")' class="w-full "  :class="{ 'p-invalid': submitted && !advance.employee_id }"/>
                </div>
          
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('advance_mount') }}</label>
                <InputNumber required class="bg-[#f7f5f5] text-center" v-model="advance.amount"  :class="{ 'p-invalid': submitted && !advance.amount}"/>
            </div>
           <div class="w-full text-center">
            <Button type="submit" @click="submitted=true" class="bg-[green] m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>  
          </form>
        </Dialog>
      </div>
      </va-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>