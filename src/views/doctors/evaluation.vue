
<template>
    <div>
      <EvaluationType></EvaluationType>
      
    <div class="sawa-card">
      <div v-if="loading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
      </div>
      <div v-else-if="!details.length" class="text-center py-8 text-gray-500">
        <i class="pi pi-inbox text-2xl mb-2" />
        <p>{{ $t('no_records_found') }}</p>
      </div>
     <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-3" v-for="evalu in details" :key="evalu.result_id ? 'result-' + evalu.result_id : evalu.id">
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
          <Button v-if="evalu.result_id && evalu.side_profile_id" v-can="'evaluation results list'"
            :label="$t('evaluation_results')" @click="$router.push({ name: 'showChildResult', params: { child_id: evalu.child_id, sideProfile_id: evalu.side_profile_id, evaluation_id: evalu.id } })" />
          <!-- <div class="text-center" >
          <Button @click="go_evaluate(evalu.child_id,evalu.type)" class="m-auto"> {{ $t("strart_evaluate") }}</Button>
          </div> -->
            
        </div>
        

     </div>
        
  
      
    </div>
  
    <Toast />

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
           maxDate: new Date(),
           details:[],
           loading:true,
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
            this.$toast.add({ severity: 'success', summary: this.$t('success_message'), detail: this.$t('successful'), life: 3000 });
           
          })
          .catch((el)=>{
          console.log(el.response.data.errors.name)
       this.error = el.response.data.errors
      });

      },
  
  

      getusers(){
        this.loading = true
        axios
          .get(`api/users/${localStorage.getItem("doctor_id")}/get/evaluations`)
          .then((response) => {
            this.details = response.data.evaluations ?? []
          })
          .catch((error) => {
            console.error("Error retrieving evaluations:", error);
          })
          .finally(() => {
            this.loading = false
          });
      },
    },
    mounted() {
     this.getusers()
     this.child_id=localStorage.getItem("child_id") 
    },
  };
  </script>
