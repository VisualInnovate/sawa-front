
<template>
  <v-card class="card">
     

      <TabView  v-model:activeIndex="active">
          <TabPanel :header="$t('student_details')">
            <div class="p-[1%]">
        <div class="flex py-2 ">
           <img  class="w-[100px] h-[100px] rounded-full" :src="'https://sawa.sawa.academy/' + user.image" alt="not found">
      </div>
      <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("name") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ user.name }}</p>
      </div>
      <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("email") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ user.email }}</p>
      </div>
      <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("title") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ user.title }}</p>
      </div>
    
      <div class="flex py-2 " >
            <h3 class="my-auto font-bold">{{ $t("skills") }} :</h3>
            <p class="text-xl  px-1 my-auto" v-for="x in user.skills">
                <span class="text-xl  px-1 my-auto">{{ x.name }} ,</span>
            </p>
            
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
          <TabPanel :header="$t('student_details')">
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
         user:[],
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
      axios
        .get(`api/users/13`)
        .then((response) => {
          console.log(response.data.evaluation_requests)
          this.user = response.data
         
        })
      
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