<template>
    <div>
      <ChildTaps></ChildTaps>
      
    <v-card>
        <div class=" my-2"  >
          <Button class="details m-auto">  اضافة تقييم</Button>
          </div>
     <div  class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-2" v-for="evalu in details">
          <div>
            <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("اسم التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.title }}</p>
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
            <h3 class="my-auto font-bold">{{ $t(" حالة التقييم") }} :</h3>
            <p v-if="evalu.status == 1" class="text-xl  px-1 my-auto"> منتهي</p>
            <p v-if="evalu.status == 0"  class="text-xl  px-1 my-auto"> تحت التقييم </p>
          </div>
          </div>
          <div class="text-center" >
          <Button class="details m-auto"> نتائج التقييم</Button>
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
           details:[],
       
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
  
  
  
      getusers(){
        axios
          .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`)
          .then((response) => {
           
            this.details = response.data.evaluations
           
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