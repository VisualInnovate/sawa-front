
<template>
    <div>
      <EvaluationType></EvaluationType>
      
    <v-card>
        
     <div  class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-3" v-for="evalu in details">
          <div class="col-span-2">
        <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("اسم المقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu?.title }}</p>
          </div>
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("تاريخ التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.date }}</p>
          </div>
         
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.kid?.name }}</p>
          </div>
          </div>
          <!-- <div class="text-center" >
          <Button @click="go_evaluate(evalu.child_id,evalu.type)" class="details m-auto"> {{ $t("strart_evaluate") }}</Button>
          </div> -->
            
        </div>
        

     </div>
        
  
      
    </v-card>
  
    <toast></toast>

    </div>
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
          child_id: useStorage("child_id", Number),
           maxDate: new Date(),
           details:[],
           evalate:{},
           error:{},
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
    

      go_evaluate(id,evalulation,evalu_id){
        if(evalu_id == 1){
          this.$router.push({ name: 'ShowSideProfiles', params:{'id':id}});
        }
        if(evalu_id == 2){
          this.$router.push({ name: 'milestone-evaluation',  params:{'id':id}});
        }
        if(evalu_id == 3){
          this.$router.push({ name: 'barrier-evaluation',  params:{'id':id}});
        }
       
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
          .get(`api/users/${localStorage.getItem("doctor_id")}/get/evaluations`)
          .then((response) => {
            console.log(response.data.evaluation_requests)
            this.details = response.data.evaluations
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
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