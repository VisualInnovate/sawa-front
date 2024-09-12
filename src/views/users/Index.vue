<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import { useI18n } from 'vue-i18n';
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import {useRouter} from "vue-router";
const toast = useToast()
const router = useRouter()
const usersdata=ref({
 skills:[],
 department:[]
})
const { t } = useI18n();
const roles=ref([])
const skills=ref([])



const tpes=()=>{
  return[
   
   { name: t('driver'), id: 1 },
  { name: t('doctor'), id: 2 },
  { name:  t('Evaluator'), id: 5 },

]
}



const departments=ref({})
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

const updatedialog=ref(false)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.post("/api/users").then((res)=>{

    users.value= res.data.users.data
    loading.value= false

  });
  axios.post("/api/roles").then((res)=>{
    loading.value= false
    roles.value= res.data.roles.data
    console.log(users.value)

  });
  axios.get("/api/skills").then((res)=>{
    skills.value=res.data.data
  

  });
  axios.get("/api/department").then((res)=>{
    departments.value=res.data.data
  

  });
}



onMounted(() => {
  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})
const edit=(id)=>{
  usersdata.value.skills=[]
  usersdata.value.department=[]
    axios.get(`/api/users/${id}`).then((res)=>{
    loading.value= false
    
 
    usersdata.value.role= res.data.roles.id
   

    usersdata.value.image= res.data.image
    usersdata.value.type= res.data.type
    usersdata.value.email= res.data.email
    usersdata.value.spotter= res.data.spotter
    usersdata.value.title= res.data.title
    usersdata.value.name= res.data.name
    usersdata.value.role = res.data.roles[0].id


    for (let i =0 ; i < res.data.skills.length; i++) {
     
        
          
          usersdata.value.skills.push(res.data.skills[i].id);
        

}
for (let i =0 ; i < res.data.departments.length; i++) {
     

       
       usersdata.value.department.push(res.data.departments[i].id);
     

}
   

  });
  console.log(usersdata.value.skills)
    confir_id.value=id
    updatedialog.value=!(updatedialog.value)
}


///// update

const editesuser=()=>{
  const body = new FormData();
  console.log(usersdata.value.name)
    body.append("name", usersdata.value.name);
    body.append("email", usersdata.value.email);
    body.append("title", usersdata.value.title);
    body.append("password", usersdata.value.password);
    body.append("image", usersdata.value.file);
    body.append("role", usersdata.value.role);
    if(usersdata.value.spotter){
      body.append("spotter", usersdata.value.spotter);
    }
    if(usersdata.value.skills.length >=1){
      body.append("skills", usersdata.value.skills);
    }
    if(usersdata.value.department){
      body.append("department_id", usersdata.value.department);
    }
    body.append("type",usersdata.value.type)
    axios
    .post(`/api/users/${confir_id.value}/edit`,body)
    .then((res) => {
      console.log(res.data)
      fetchData()
      updatedialog.value=!(updatedialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      skill.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}

const openNew = () => {
  usersdata.value= ref({})
    createdialog.value=!(createdialog.value)
}

const confirmDelete = (id) => {
  console.log(id)
  deleteDialog.value = true
  confir_id.value=id
 

}

const uploadFile = (e) => {
  const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        usersdata.value.image = e.target.result;
        usersdata.value.file = image;
        console.log(this.imageSrc);
      };

};

const createuser=()=>{
  const body = new FormData();
  console.log(usersdata.value.name)
    body.append("name", usersdata.value.name);
    body.append("email", usersdata.value.email);
    body.append("title", usersdata.value.title);
    body.append("password", usersdata.value.password);
    body.append("image", usersdata.value.file);
    body.append("role", usersdata.value.role);
    if(usersdata.value.spotter){
      body.append("spotter", usersdata.value.spotter);
    }
   
    if(usersdata.value.skills){
      body.append("skills", usersdata.value.skills);
    }
    if(usersdata.value.department){
      body.append("department_id", usersdata.value.department);
    }
    body.append("type",usersdata.value.type)

  


    axios
    .post('/api/users/create',body)
    .then((res) => {
      console.log(res.data)
      fetchData()
      createdialog.value=!(createdialog.value)
      toast.add({severity: 'success', summary: 'Successful', detail: 'Successful', life: 3000})
      skill.value = ref({})
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
}
const deleteAction = () => {
  axios
    .delete(`/api/users/${confir_id.value}/delete`)
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
  <div  class="grid" style="max-height: 90vh !important; overflow: scroll;">
    <div class="col-12">
      <va-card class="card">
        <Toolbar class="mb-4 shadow-md">
          <template #start>
            <div class="my-2">
           <Button v-can="'create user'" :label='$t("user_add")' icon="pi pi-plus" class="p-button-success mr-2" @click="openNew"></Button> 
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
            <Button v-can="'show user'" :label='$t("export")' icon="pi pi-upload" class="export" @click="exportCSV($event)"/>
          </template>
        </Toolbar>

        <Toast/>


      <div  class="shadow-xl ">
        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="users"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="5"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} products"
          responsive-layout="scroll"
          v-can="'show user'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="m-0 my-auto">{{ $t("users") }}</h5>
             <div>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </span>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
         
          <Column field="index" :header='$t("index")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
           </Column>
         
           <Column field="name" :header='$t("name")' :sortable="true" header-style="width:14%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
           </Column>
           <Column field="image" :header='$t("personal_image")' :sortable="true" header-style="width:10%; min-width:12rem;" class="ltr:text-justify">
            <template #body="slotProps">
              <img class="m-auto rounded-full" style="width: 100px ;height: 100px;" :src="slotProps.data.image">
             
            </template>
           </Column>
           <Column field="email" :header='$t("email")' :sortable="true" header-style="width:14%; min-width:10rem;" class="ltr:text-justify">
            <template #body="slotProps">
              {{ slotProps.data.email }}
            </template>
           </Column>
         
          


        
          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <div >
                <Button
                v-can="'update user'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.id)"
              />
                <Button
                v-can="'create user'"
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
        <Dialog v-model:visible="createdialog" :style="{ width: '450px' }" :header='$t("users")' :modal="true">
          <div class="">
                 <div ><img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" v-if="usersdata.image" :src="'https://sawa.sawa.academy/'+ usersdata.image" >
                  <img  onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" v-else src="../frontend/image/Ellipse2.png" >
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
                  </div>
           
          </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('name') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.name" :placeholder='$t("name")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('type') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.type"  option-value="id" filter :options="tpes()" optionLabel="name" :placeholder='$t("type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('skill_name') }}</label>
                  <MultiSelect  v-model="usersdata.skills" filter option-value="id" :options="skills" optionLabel="name" :placeholder='$t("skill_name")'
              class="w-full bg-[#f7f5f5] md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('department') }}</label>
                  <MultiSelect  v-model="usersdata.department" filter option-value="id" :options="departments" optionLabel="title" :placeholder='$t("department")'
              class="w-full bg-[#f7f5f5] md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('Spotter') }}</label>
                  <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.spotter" :placeholder='$t("Spotter")' />

           
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('email') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.email" :placeholder='$t("email")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.email">{{ error.email[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('password') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="usersdata.password" :placeholder='$t("password")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
            </div>
            
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('roles') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.role"  option-value="id" filter :options="roles" optionLabel="name" :placeholder='$t("roles")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.role">{{ error.role[0] }}</div>
            </div>
            <div class=" flex-column gap-2 py-1 hidden">
                  <label class="w-full text-right" for="username">{{ $t('personal_image') }}</label>
                  <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
            </div>

           <div class="w-full text-center">
            <Button @click="createuser" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>
        </Dialog>
        <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="">
                 <div ><img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" v-if="usersdata.image" :src="'https://sawa.sawa.academy/'+ usersdata.image" >
                  <img  onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" v-else src="../frontend/image/Ellipse2.png" >
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
                  </div>
           
          </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('name') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.name" :placeholder='$t("name")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('type') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.type"  option-value="id" filter :options="tpes()" optionLabel="name" :placeholder='$t("type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('skill_name') }}</label>
                  <MultiSelect  v-model="usersdata.skills" filter option-value="id" :options="skills" optionLabel="name" :placeholder='$t("skill_name")'
              class="w-full bg-[#f7f5f5] md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.skills">{{ error.skills[0] }}</div>
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('department') }}</label>
                  <MultiSelect  v-model="usersdata.department" filter option-value="id" :options="departments" optionLabel="title" :placeholder='$t("department")'
              class="w-full bg-[#f7f5f5] md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('Spotter') }}</label>
                  <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.spotter" :placeholder='$t("Spotter")' />

              
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('email') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.email" :placeholder='$t("email")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.email">{{ error.email[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="usersdata.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('password') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="usersdata.password" :placeholder='$t("password")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
            </div>
            
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('roles') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.role"  option-value="id" filter :options="roles" optionLabel="name" :placeholder='$t("roles")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.role">{{ error.role[0] }}</div>
            </div>
            <div class=" flex-column gap-2 py-1 hidden">
                  <label class="w-full text-right" for="username">{{ $t('personal_image') }}</label>
                  <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
            </div>
           <div class="w-full text-center">
            <Button @click="editesuser" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>

           
        </Dialog>
      </div>
      </va-card>
    </div>
  </div>
</template>

<style >



</style>