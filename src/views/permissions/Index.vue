<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Editor from 'primevue/editor';
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()

const loading = ref(true)
const details = ref({})
const description = ref('')
const permissions = ref(null)
const show = ref(false)
const deleteDialog = ref(false)
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const skill=ref({})
const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= (e)=>{

  axios.get(`/api/permissions`).then((res)=>{
    loading.value= false
    permissions.value= res.data.permissions
   

  });


}
const handelSearch= (e)=>{

axios.get(`/api/permissions?search=${e}`).then((res)=>{
  loading.value= false
  permissions.value= res.data.permissions
 

});


}

const updateDis=()=>{
  axios.put(`/api/permissions/${details.value.id}/edit`,{
    description:description.value
    
  }).then((res)=>{
    fetchData()
    show.value=!(show.value)
    
  });
}

onMounted(() => {
  
fetchData()

})
    const showDirection=(e)=>{
      show.value=!(show.value)
      description.value=e.description
      details.value=e
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
  <div class="grid" style="max-height: 90vh !important; overflow-y: scroll;">

    <div class="flex w-full pb-4 px-4 justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("permissions") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText  @update:model-value="handelSearch" :placeholder='$t("search")'/>
              </span>
              </div>
    </div>
    <div class="col-12">
      <v-card class="card shadow-md">
       
        <div class="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1">
          <div class="p-4" v-for="(permissionsList, category) in permissions" :key="category">
            <h3 class="font-bold text-lg text-slate-800">{{ category }}</h3>
            <div class="flex py-[1px]" v-for="permission in permissionsList" :key="permission.id">
              <p class="">{{ permission.name }} </p>
              <i @click="showDirection(permission)" class="pi pi-arrow-left px-4 my-auto text-base text-[#135C65]"></i>
            </div>
           
          </div>
        </div>
        <Dialog v-model:visible="show" :style="{ width: '550px' }" :header='$t("submit")' :modal="true">
          <div class="">
           
            <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('description') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="description" ></v-textarea> 
                </div>
          </div>
          <template #footer>
            <Button  :label='$t("no")' icon="pi pi-times" class=" p-button-text" @click="show = false"/>
            <Button  :label='$t("yes")' icon="pi pi-check" class="p-button-text" @click="updateDis"/>
          </template>
        </Dialog>
     
      </v-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>