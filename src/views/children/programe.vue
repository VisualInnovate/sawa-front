<template>
  <div>
    <ChildTaps></ChildTaps>
  <v-card>
   <div class="p-[1%]">
    <div class="flex py-2 ">
          <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
          <p class="text-xl  px-1 my-auto">{{ details.name }}</p>
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
        .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`)
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