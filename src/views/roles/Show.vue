<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import Editor from 'primevue/editor';
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
import { Button } from 'flowbite-vue';
const toast = useToast()
const router = useRouter()
const submitted=ref(false)
const loading = ref(true)
const details = ref({})
const description = ref('')
const permissions = ref(null)
const show = ref(false)
const role = ref({})
const confir_id=ref('')
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const createdialog=ref(false)
const skill=ref({})
const updatedialog=ref(false)
const selectedPermissionIds = ref([]); // Array to store selected permission IDs

const areAllPermissionsSelected = (permissionsList) => {
  return permissionsList.every((permission) =>
    selectedPermissionIds.value.includes(permission.id)
  );
};
const handleSelectAll = (category, permissionsList) => {
  const permissionIdsInCategory = permissionsList.map((permission) => permission.id);

  if (areAllPermissionsSelected(permissionsList)) {
    // If all permissions are already selected, deselect all
    selectedPermissionIds.value = selectedPermissionIds.value.filter(
      (id) => !permissionIdsInCategory.includes(id)
    );
  } else {
    // If not all permissions are selected, select all
    selectedPermissionIds.value = [
      ...new Set([...selectedPermissionIds.value, ...permissionIdsInCategory]),
    ];
  }
};
const handelSearch= (e)=>{

axios.get(`/api/permissions?search=${e}`).then((res)=>{
  loading.value= false
  permissions.value= res.data.permissions
 

});


}
const fetchData= ()=>{
  axios.get("/api/permissions").then((res)=>{
    loading.value= false
    permissions.value= res.data.permissions
  });
}
const  getOne=()=>{

  axios.get(`/api/roles/${router.currentRoute.value.params.id}`).then((res)=>{
    loading.value= false
    role.value.name= res.data.role.name
    for (let i = 0; i < res.data.role.permissions.length; i++) {
      
     selectedPermissionIds.value.push(res.data.role.permissions[i].id)
    } });
}
    const submitForm=()=>{
      axios.put(`/api/roles/${router.currentRoute.value.params.id}/edit`,{
        permissions:selectedPermissionIds.value,
        name:role.value.name
      }).then((res)=>{
        router.push({name:'Roles'})
      });
    }

onMounted(() => {
  fetchData()
  getOne()
})

const showDirection=(e)=>{
  show.value=!(show.value)
  description.value=e.description
  details.value=e
}



const handleCheckboxClick = (permissionId) => {
  const index = selectedPermissionIds.value.indexOf(permissionId);
  if (index === -1) {
    selectedPermissionIds.value.push(permissionId);
  } else {
    selectedPermissionIds.value.splice(index, 1);
  }
  console.log(selectedPermissionIds.value)
};
</script>

<template>
  <div class="grid" style="max-height: 90vh !important; overflow-y: scroll;">
    <div class="flex w-full pb-4 px-4 justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("roles") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText  @update:model-value="handelSearch" :placeholder='$t("search")'/>
              </span>
              </div>
    </div>
    <div class="col-12">
      <v-card class="card shadow-md">
      <form class="flex " @submit.prevent="submitForm">
        <div class="flex flex-column gap-2 py-1 w-[50%]">                
            <div class="flex">
                    <label class="text-right ">{{ $t("اسم الرول") }}</label>
                    <svg class="my-auto mx-1" width="7" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.8" d="M1.859 5.008L1.196 4.527L1.95 3.253L0.624 2.668L0.871 1.888L2.288 2.213L2.431 0.744H3.25L3.393 2.213L4.823 1.888L5.07 2.668L3.731 3.253L4.485 4.527L3.822 5.008L2.847 3.877L1.859 5.008Z" fill="#DA1414"/>
                    </svg>
                </div>
            <InputText  class="bg-[#f7f5f5] text-center" v-model="role.name" required :class="{ 'p-invalid': submitted && !role.name}" />
         </div>
         <div class="flex flex-column mx-2 items-stretch">
          <label class="text-right invisible ">{{ $t("اسم الرول") }}</label>

          <Button  type="submit" @click="submitted=true"  class="create my-auto"  > {{ $t("submit") }}</Button>
          
         </div>
      </form>
        <div class="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1">
          <div class="p-4" v-for="(permissionsList, category) in permissions" :key="category">
              <div class="flex items-center">
                <h3 class="mx-2 font-bold text-lg text-slate-800">{{ category }}</h3>
                <input
                  type="checkbox"
                  class="border my-auto mx-2"
                  :checked="areAllPermissionsSelected(permissionsList)"
                  @change="handleSelectAll(category, permissionsList)"
                />
         
              </div>
              <div class="flex py-[1px]" v-for="permission in permissionsList" :key="permission.id">
                <input
                  class="border my-auto mx-2"
                  type="checkbox"
                  :checked="selectedPermissionIds.includes(permission.id)"
                  @change="handleCheckboxClick(permission.id)"
                />
                <p>{{ permission.name }}</p>
                <i @click="showDirection(permission)" class="pi pi-arrow-left px-4 my-auto text-base text-[#135C65]"></i>
              </div>
            </div>
        </div>
        <Dialog v-model:visible="show" :style="{ width: '550px' }" :header='$t("submit")' :modal="true">
          <div class="">
            <div class="flex flex-column gap-2">
              <label class="w-full text-right" for="username">{{ $t('description') }}</label>
              <v-textarea disabled readonly="true" bg-color="#EAE8E9" rows="3" v-model="description"></v-textarea> 
            </div>
          </div>
         
        </Dialog>
      </v-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>