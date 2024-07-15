
<template>
  <v-card class="card relative ">
         
<div class="absolute z-50 top-1 ltr:right-0-4 rtl:left-4 flex flex-column gap-2">
  <Dropdown @update:model-value="get_request" required id="pv_id_1" style="direction: ltr !important;" v-model="user.child_id"  option-value="id" filter :options="user.children" optionLabel="name" :placeholder='$t("child_name")' class=" bg-[#f7f5f5] [&>div>div>span]:bg-black w-[200px] h-[90%]" />   
                        
                </div>
      <TabView  v-model:activeIndex="active">
            
          <TabPanel :header="$t('student_details')">
         <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
                 <div ><img onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" v-if="user.image" :src="'https://sawa.sawa.academy/'+user.image" >
                  <img  onclick="document.getElementById('filr').click()" class="m-auto rounded-full" style="width: 150px ;height: 150px;" v-else src="../frontend/image/Ellipse2.png" >
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
                  </div>
           
          </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('name') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="user.name" :placeholder='$t("name")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('type') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="user.type"  option-value="id" filter :options="tpes()" optionLabel="name" :placeholder='$t("type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
            </div>
            <div v-if="user.type == 0 || user.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('skill_name') }}</label>
                  <MultiSelect  v-model="user.skills" filter option-value="id" :options="skills" optionLabel="name" :placeholder='$t("skill_name")'
              class="w-full bg-[#f7f5f5] md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.skills">{{ error.skills[0] }}</div>
            </div>
            <div v-if="user.type == 0 || user.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('department') }}</label>
                  <MultiSelect  v-model="user.department" filter option-value="id" :options="departments" optionLabel="title" :placeholder='$t("department")'
              class="w-full bg-[#f7f5f5] md:w-20rem" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div v-if="user.type == 0 || user.type ==2 " class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('Spotter') }}</label>
                  <InputText required class="bg-[#f7f5f5] text-center" v-model="user.spotter" :placeholder='$t("Spotter")' />

              
                <div class="mt-1 mb-5 text-red-500" v-if="error?.permissions">{{ error.permissions[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('email') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="user.email" :placeholder='$t("email")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.email">{{ error.email[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('title') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="user.title" :placeholder='$t("title")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{ error.title[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('password') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="user.password" :placeholder='$t("password")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.password">{{ error.password[0] }}</div>
            </div>
            
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('roles') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="user.role"  option-value="id" filter :options="roles" optionLabel="name" :placeholder='$t("roles")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
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
         </div>

          </TabPanel>
          <TabPanel :header="$t('Consultations_evaluations')">
            <div>
     
     
        
      
      
      
    <v-card>
        
     <div  class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-3" v-for="evalu in user.evaluation_requests">
          <div class="col-span-2">
            <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("اسم التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==2">milestone</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==1">side profile</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==3">Barrier</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==4">ablls</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==5">carolina</p>
          </div>
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("تاريخ التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.date }}</p>
          </div>
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("اسم المقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.specialist?.name }}</p>
          </div>
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.child?.name }}</p>
          </div>
          </div>
          <div class="text-center" >
          <Button @click="go_evaluate(evalu.child.id,evalu.evaluation_type)" class="details m-auto"> {{ $t("strart_evaluate") }}</Button>
          <Button   icon="pi pi-trash" @click="deleteevalution(evalu.id)" class="delete m-auto"> </Button>

          </div>
            
        </div>
        

     </div>
        
  
      
    </v-card>
    <div>
      <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span 
            >{{ $t('هل انت متاكد من ازالة هذا العنصر') }} 
            >?</span
            >
          </div>
          <template #footer>
            <Button  :label='$t("no")' icon="pi pi-times" class=" p-button-text" @click="deleteDialog = false"/>
            <Button  :label='$t("yes")' icon="pi pi-check" class="p-button-text" @click="deleteAction"/>
          </template>
        </Dialog>
   
    </div>
    <toast></toast>

    </div>
          </TabPanel>
          <TabPanel :header="$t('children')">
              <p class="m-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
                  officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
              </p>
          </TabPanel>
      </TabView>
  </v-card>
</template>

<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import EvaluationType from '../../components/EvaluationType.vue'
import moment from "moment";
  import {useToast} from 'primevue/usetoast'
export default {
   components:{EvaluationType},

  data() {
    return {
        child_id: useStorage("child_id", Number),
         maxDate: new Date(),
         user:{
          skills:[],
          department:[]
         },
         skills:[],
         roles:[],
         departments:[],
         evalate:{},
         error:{},
         deleteDialog:false,
         delete_id:'',
         doctors:{},
         updatedialog:false,
        evaluate_types : [
                    { name: 'side profile', id: 1 },
                    { name: 'milestone', id: 2 },
                    { name: 'barrier', id: 3 },
                   
                ]
     
      // Add other validation rules for the title field
    };

  },

  methods: {
    opennew(){
      this.updatedialog=!(this.updatedialog)
    },
  tpes(){
  return[
            { name:this.$t('driver') , id:1},
                { name:this.$t('doctor') , id:2},
                { name:this.$t('Evaluator') , id:3},
 
]
},
get_request(e){

  axios
        .get(`api/evaluations/requests/${localStorage.getItem("user_id")}/${e}`)
        .then((response) => {
          this.user.evaluation_requests=response.data.data
         
        })
},

      deleteAction(){
      axios.delete(`api/evaluation-request/${this.delete_id}`)
        .then((response) => {

         this.getusers()
         this.deleteDialog=!(this.deleteDialog)
        })
    },
    deleteevalution(id){
      this.delete_id=id
      this.deleteDialog=!(this.deleteDialog)
    
    },
    go_evaluate(id,evalu_id){
      console.log(id,evalu_id)
      if(evalu_id == 1){
        this.$router.push({ name: 'ShowSideProfiles', params:{'id':id}});
      }
      if(evalu_id == 2){
        this.$router.push({ name: 'milestone-evaluation',  params:{'id':id}});
      }
      if(evalu_id == 3){
        this.$router.push({ name: 'barrier-evaluation',  params:{'id':id}});
      }
      if(evalu_id == 4){
        this.$router.push({ name: 'mission-test',  params:{'id':id}});
      }
      if(evalu_id == 5){
        this.$router.push({ name: 'carolina-test',  params:{'id':id}});
      }
     
    },
    serchdata(e){

      axios
        .get(`api/users/${localStorage.getItem("doctor_id")}/search/evaluations?search=${e}`)
        .then((response) => {
          this.details = response.data.evaluation_requests
         
        })
    },

    createevaluate(){
      axios
        .post(`api/evaluation-request`,{
          child_id:localStorage.getItem("child_id"),
          consultant_id:localStorage.getItem("user_id"),
          evaluation_type:this.evalate.evaluation_type,
          date:moment(this.evalate.datet).format("Y-MM-DD") ,
          specialist_id:this.evalate.specialist_id

        })
        .then((response) => {
          this.updatedialog=!(this.updatedialog)
          this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
         
        })
        .catch((el)=>{
        console.log(el.response.data.errors.name)
     this.error = el.response.data.errors
    });

    },



    getusers(){
      axios.post("/api/roles").then((res)=>{
 
    this.roles= res.data.roles.data
    console.log(users.value)

  });
  axios.get("/api/skills").then((res)=>{
    this.skills=res.data.data
  

  });
  axios.get("/api/department").then((res)=>{
    this.departments=res.data.data
  

  });
      axios
        .get(`api/users/${localStorage.getItem("user_id")}`)
        .then((response) => {
          console.log(response.data.evaluation_requests)
          this.user.type = response.data.type
          this.user.email = response.data.email
          this.user.name = response.data.name
          this.user.spotter = response.data.spotter
          this.user.title = response.data.title
          this.user.image = response.data.image
          this.user.role = response.data.roles[0].id
          this.user.evaluation_requests=response.data.evaluation_requests
          this.user.children=response.data.children
          for (let i =0 ; i < response.data.skills.length; i++) {
          
                
          this.user.skills.push(response.data.skills[i].id);

}
for (let i =0 ; i < response.data.departments.length; i++) {
          
                
          this.user.department.push(response.data.departments[i].id);

}
         
        })
      
    },
     editesuser(){
  const body = new FormData();

    body.append("name", this.user.name);
    body.append("email", this.user.email);
    body.append("title", this.user.title);
    body.append("password", this.user.password);
    body.append("image", this.user.file);
    body.append("role", this.user.role);
    if(this.user.spotter){
      body.append("spotter", this.user.spotter);
    }
    if(this.user.skills){
      body.append("skills", this.user.skills);
    }
    if(this.user.department){
      body.append("department_id", this.user.department);
    }
    body.append("type",this.user.type)
    axios
    .post(`/api/users/${localStorage.getItem("user_id")}/edit`,body)
    .then((res) => {
      console.log(res.data)
      fetchData()
      
      
    })
    .catch((el)=>{
      error.value = el.response.data.errors
    })
},
 uploadFile(e){
  const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.user.image = e.target.result;
        this.user.file = image;
       
      };
      console.log(this.user.image)

},
    getdoctors(){
      axios
        .get(`api/doctors`)
        .then((response) => {
         
          this.doctors = response.data.doctors
         
        })
        .catch((error) => {
            
        });

    },


   
  },
  mounted() {
   this.getusers()
   this.getdoctors()
   this.child_id=localStorage.getItem("child_id") 
  },
};
</script>