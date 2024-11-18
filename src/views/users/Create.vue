
<template>
  <v-card class="mx-auto pa-12 pb-8 bg-slate-50" elevation="8">
   
     
  
    <form @submit.prevent="create">
      <div class="">
                 <div ><img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" :class="{ 'p-invalid': submitted && !usersdata.image}" v-if="usersdata.image" :src=" usersdata.image" >
                  <img  onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" :class="{ 'p-invalid': submitted && !usersdata.image}" v-else src="https://sys.sawa.sawa.academy/public/default.jpg">
                 
                  </div>
           
          </div>
           <div class="grid grid-cols- gap-4 lg:grid-cols-2">
            <div class="flex flex-column gap-2 py-1">
                 
                  <label class="w-full " for="username">{{ $t('name') }}</label>
                <InputText  class="bg-[#f7f5f5] text-center" v-model="usersdata.name" :class="{ 'p-invalid': submitted && !usersdata.name}" />
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full t" for="username">{{ $t('type') }}</label>
                  <Dropdown  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.type"  option-value="id" filter :options="tpes()" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.name}"  />
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full " for="username">{{ $t('skill_name') }}</label>
                  <MultiSelect  v-model="usersdata.skills" filter option-value="id" :options="skills" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.skills}" />
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full " for="username">{{ $t('department') }}</label>
                  <MultiSelect  v-model="usersdata.department" filter option-value="id" :options="departments" optionLabel="title" :class="{ 'p-invalid': submitted && !usersdata.department}" />
            </div>
            <div v-if="usersdata.type == 0 || usersdata.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full " for="username">{{ $t('Spotter') }}</label>
                  <InputText  class="bg-[#f7f5f5] text-center" v-model="usersdata.spotter" :class="{ 'p-invalid': submitted && !usersdata.spotter}" />

            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full " for="username">{{ $t('email') }}</label>
                <InputText type="email"  class="bg-[#f7f5f5] text-center" v-model="usersdata.email" :class="{ 'p-invalid': submitted && !usersdata.email}"  />            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full " for="username">{{ $t('title') }}</label>
                <InputText  class="bg-[#f7f5f5] text-center" v-model="usersdata.title" :class="{ 'p-invalid': submitted && !usersdata.title}" />
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full " for="username">{{ $t('password') }}</label>
                <InputText   class="bg-[#f7f5f5] text-center" v-model="usersdata.password" :class="{ 'p-invalid': submitted && !usersdata.password}" />
            </div>
            
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full " for="username">{{ $t('roles') }}</label>
                  <Dropdown  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="usersdata.role"  option-value="id" filter :options="roles" optionLabel="name" :class="{ 'p-invalid': submitted && !usersdata.role}" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.role">{{ error.role[0] }}</div>
            </div>
            <div class=" flex-column gap-2 py-1 hidden">
                  <label class="w-full " for="username">{{ $t('personal_image') }}</label>
           
                  <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
            </div>

           </div>
           <p class="text-2xl font-bold py-2">{{ $t("add_Appointment") }}</p>
           <table  class="item-table w-[70%]">
            
            <thead>
              <tr>
                <th>{{ $t("day") }}</th>
                <th>{{ $t("evalute_type") }}</th>
                <th>{{ $t("from") }}</th>
                <th>{{ $t("to") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="times.length >=1" v-for="(time, index) in times" :key="index">
              
                <td>{{ time.day }}</td>
                <td>{{ evaluate_types.find(item => item.id === time?.evaluation_type).name  }}</td>
                <td>{{ time.start }}</td>
                <td>{{ time.end }}</td>
                <td><Button @click="deleteitem(index)"  icon="pi pi-trash" class="p-button-rounded delete p-button-success m-auto" /></td>
              </tr>
              <tr>
                <td><Dropdown   class="w-full" style="direction: ltr !important;" v-model="day" option-value="value" :options="filteredDays" optionLabel="name" :placeholder='$t("day")' :class="{ 'p-invalid': submitted && !day}" /></td>
                <td><Dropdown  id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="evaluation_type"  option-value="id"  :options="evaluate_types"  optionLabel="name" :placeholder='$t("evalute_type")' class="w-full " :class="{ 'p-invalid': submitted && !evaluation_type}"  /></td>
                <td> <InputText  type="time" timeOnly  v-model="startTime"  class="w-full" autofocus  :placeholder='$t("from")' format="12" :class="{ 'p-invalid': submitted && !startTime}"/></td>
                <td> <InputText  type="time" timeOnly  v-model="endTime"   class="w-full" autofocus  :placeholder='$t("to")' :class="{ 'p-invalid': submitted && !endTime}"/></td>
               
                <td> <Button   @click="addItem"  class="create m-auto s " icon="pi pi-plus" ></Button></td>
              </tr>
            </tbody>
          </table>
          <Button @click="submitted=true" type="submit" class=" mt-4 m-auto create  w-full " :label='$t("submit")'></Button>
    </form>
    <Toast/>
  </v-card>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from 'vue-i18n';
import {useToast} from 'primevue/usetoast'
import { useUsersStore } from "../../stores/Users";
import axios from "axios";
import { da } from "date-fns/locale";
const toast = useToast()
const usersdata=ref({})
const { t } = useI18n();
const submitted=ref(false)
const roles=ref([])
const departments=ref([])
const filterDays=ref([])
const skills=ref([])
const times=ref([])
const day=ref('')
const endTime=ref("")
const startTime=ref("")
const evaluation_type=ref('')
const evaluate_types =ref( [
                      { name: 'side profile', id: 1 },
                      { name: 'milestone', id: 2 },
                      { name: 'barrier', id: 3 },
                      { name: 'ablls', id: 4 },
                      { name: 'carolina', id: 5 },
   
                  ])
const days = ref([
   
    { name: 'Sunday', value: 'Sunday' },
    { name: 'Monday', value: 'Monday' },
    { name: 'Tuesday', value: 'Tuesday' },
    { name: 'Thursday', value: 'Thursday' },
    { name: 'Wednesday', value: 'Wednesday' },
    { name: 'Friday', value: 'Friday' },
    { name: 'Saturday', value: 'Saturday' }
   
]);

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
const create=()=>{



  const body = new FormData();
  console.log(usersdata.value.name)
    body.append("name", usersdata.value.name);
    body.append("email", usersdata.value.email);
    body.append("title", usersdata.value.title);
    body.append("password", usersdata.value.password);
    if(usersdata.value.file){
      body.append("image", usersdata.value.file);
    }
    
    body.append("role", usersdata.value.role);
    body.append("business_hours",JSON.stringify(times.value));
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
    
      toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_add_success")}`, life: 3000 });
    })
    .catch((el)=>{
      toast.add({ severity: 'error', summary: t("error"), detail: `${t("mission_error")}`, life: 3000 });
      
    })
}
const addItem = () => {
  if (day.value && startTime.value && endTime.value) {
    times.value.push({ day: day.value, start: startTime.value, end: endTime.value,evaluation_type:evaluation_type.value });
    day.value = '';
    startTime.value = '';
    endTime.value = '';
  }
  console.log(times.value)
};
const filteredDays = computed(() => {
  return days.value.filter(day =>
    !times.value.some(time => time.day === day.value)
  );
});
const deleteitem=(index)=>{
       times.value.splice(index, 1); // يحذف العنصر بناءً على الفهرس

   }
      
const tpes=()=>{
  return[
   
   { name: t('driver'), id: 1 },
  { name: t('doctor'), id: 2 },
  { name:  t('Evaluator'), id: 5 },

]
}
const fetchSeletData=()=>{
  axios.post("/api/roles").then((res)=>{

    roles.value= res.data.roles.data


  });
  axios.get("/api/skills").then((res)=>{
    skills.value=res.data.data
  

  });
  axios.get("/api/department").then((res)=>{
    departments.value=res.data.data
  

  });
}
onMounted(async () => {
  fetchSeletData()
});
</script>


<style lang="scss">
.custom-alert-class {
  .v-alert__close {
    margin-inline-start: 10px;
  }
}
.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  
}

.item-table {
  border-collapse: collapse;
}

.item-table th, .item-table td {
  padding: 5px;
  border: 1px solid #ddd;
  text-align: center;
}

</style>
