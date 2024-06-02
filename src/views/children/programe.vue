<template>
  <div>
    <ChildTaps></ChildTaps>
    <v-card>
       
     <div  class="grid grid-cols-1 lg:grid-cols-1 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-1" >
          <div class="w-full">
            <div class=" flex py-2 ">
                  <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
                  <p class="text-xl  px-1 my-auto">{{ details?.name }}</p>
            </div>  
            <div class=" flex py-2 ">
                  <h3 class="my-auto font-bold">{{ $t("ProgramType") }} :</h3>
                  <p class="text-xl  px-1 my-auto" v-if=" details?.student_program?.program.program_type == 0">{{ $t("diurnal") }}</p>
                  <p class="text-xl  px-1 my-auto" v-if=" details?.student_program?.program.program_type == 1">{{ $t("Clinics") }}</p>
                  <p class="text-xl  px-1 my-auto" v-if=" details?.student_program?.program.program_type == 2">{{ $t("house") }}</p>
            </div>
            <div class=" flex py-2 ">
                  <h3 class="my-auto font-bold">{{ $t("ProgramName") }} :</h3>
                  <p class="text-xl  px-1 my-auto">{{ details?.student_program?.program.name }}</p>
            </div>
            <div class="flex py-2 ">
                  <h3 class="my-auto font-bold">{{ $t("price") }} :</h3>
                  <p class="text-xl  px-1 my-auto">{{ details?.student_program?.program?.price }}</p>
            </div>
            <div class="flex py-2 ">
                  <h3 class="my-auto font-bold">{{ $t("number_sessaion") }} :</h3>
                  <p class="text-xl  px-1 my-auto">{{ details?.student_program?.program?.individual_sessions }}</p>
            </div>
            <div class="flex py-2 ">
                  <h3 class="my-auto font-bold">{{ $t("gruop_sessaion") }} :</h3>
                  <p class="text-xl  px-1 my-auto">{{ details?.student_program?.program?.collective_sessions }}</p>
            </div>
          </div>
          
            
        </div>
        

     </div>
        
  
      
    </v-card>
         
  </div>
</template>
<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import ChildTaps from '../../components/ChildTaps.vue'

  import {useToast} from 'primevue/usetoast'
export default {
   components:{ChildTaps},

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
        .get(`api/program/programFor/${localStorage.getItem("child_id")}`)
        .then((response) => {
          console.log(response.data.data)
          this.details = response.data.data
         
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