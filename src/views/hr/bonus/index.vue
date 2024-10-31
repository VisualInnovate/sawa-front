<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import moment from "moment";
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const allemployee=ref({})
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
const bouns=ref({})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/bonus").then((res)=>{
    loading.value= false
    users.value= res.data.data
    console.log(users.value)

  });
  axios.get("/api/employees").then((res)=>{
   
    allemployee.value= res.data.data
    

  });


}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
    axios.get(`/api/bonus/${id}`).then((res)=>{
    loading.value= false
    bouns.value= res.data.data


  });
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const update=()=>{
    axios
    .put(`/api/bonus/${confir_id.value}`,bouns.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      payroll.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
    createdialog.value=!(createdialog.value)
    bouns.value={}
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const create=()=>{
  bouns.value.date = moment(bouns.value.dat).format("YYYY-MM-DD" );
    axios
    .post('/api/bonus',bouns.value)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      bouns.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/bonus/${confir_id.value}`)
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
            <Button v-can="'bonus create'" :label='$t("Adding_bonus_employee")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button>
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
            <Button v-can="'bonus list'" :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)"/>
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
          v-can="'bonus list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("bonus") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         

          <Column field="Employees" :header='$t("Employees")' :sortable="true" header-style="width:20%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.employee.name }}
            </template>
           </Column>
         
           <Column field="amount" :header='$t("bouns_amount")' :sortable="true" header-style="width:20%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.amount }}
            </template>
           </Column>

        
           <Column field="date" :header='$t("bouns_date")' :sortable="true" header-style="width:20%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.date }}
            </template>
           </Column>
          
          


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-can="'bonus edit'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
                <Button
                v-can="'bonus delete'"
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

            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('bouns_reason') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="bouns.reason" :placeholder='$t("bouns_reason")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.reason">{{ error.reason[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('bouns_amount') }}</label>
                <InputNumber required class="bg-[#f7f5f5] text-center" v-model="bouns.amount" :placeholder='$t("bouns_amount")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.amount">{{ error.amount[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" for="username">{{ $t('bouns_date') }}</label>
                   <Calendar  style="width: 100%" showButtonBar v-model.number="bouns.date" showIcon  :placeholder='$t("holiday_date")'   />   
                   <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
               </div> 
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('Employees') }}</label>
                  <MultiSelect v-model="bouns.employees"  required id="pv_id_1" style="direction: ltr !important;"  option-value="id" filter :options="allemployee" optionLabel="name" :placeholder='$t("Employees")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />          
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.employees">{{ error.employees[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="create" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('bouns_reason') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="bouns.reason" :placeholder='$t("bouns_reason")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.reason">{{ error.reason[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('bouns_amount') }}</label>
                <InputNumber required class="bg-[#f7f5f5] text-center" v-model="bouns.amount" :placeholder='$t("bouns_amount")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.amount">{{ error.amount[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                   <label style="text-align: right !important;" for="username">{{ $t('bouns_date') }}</label>
                   <Calendar  style="width: 100%" showButtonBar v-model.number="bouns.date" showIcon  :placeholder='$t("bouns_date")'   />   
                   <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
               </div> 
            
           <div class="w-full text-center">
            <Button @click="update" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
      </div>
      </va-card>
    </div>
   
  </div>
</template>

<style scoped lang="scss"></style>