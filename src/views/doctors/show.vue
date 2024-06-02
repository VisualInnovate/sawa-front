<template>
    <div>
      <EvaluationType></EvaluationType>
    <v-card>
     <div class="p-[1%]">
        <div class="flex py-2 ">
           <img  class="w-[100px] h-[100px] rounded-full" :src="'https://sawa.sawa.academy/' + details.image" alt="not found">
      </div>
      <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("name") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ details.name }}</p>
      </div>
      <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("email") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ details.email }}</p>
      </div>
      <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("title") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ details.title }}</p>
      </div>
    
      <div class="flex py-2 " >
            <h3 class="my-auto font-bold">{{ $t("skills") }} :</h3>
            <p class="text-xl  px-1 my-auto" v-for="x in details.skills">
                <span class="text-xl  px-1 my-auto">{{ x.name }} ,</span>
            </p>
            
      </div>
     
     
      
      
     </div>
        
  
      
    </v-card>
    </div>
  </template>
  <script>
  import axios from "axios";
  import { useStorage } from "@vueuse/core";
  import EvaluationType from '../../components/EvaluationType.vue'
  
    import {useToast} from 'primevue/usetoast'
  export default {
     components:{EvaluationType},
  
    data() {
      return {
          child_id: useStorage("child_id", Number),
           maxDate: new Date(),
           details:{},
       
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
  
  
  
      getusers(){
        axios
          .get(`api/users/${localStorage.getItem("doctor_id")}/get/evaluations`)
          .then((response) => {
            console.log(response.data.data)
            this.details = response.data
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },
  
  
     
    },
    mounted() {
     this.getusers()
     this.child_id=localStorage.getItem("child_id") 
    },
  };
  </script>