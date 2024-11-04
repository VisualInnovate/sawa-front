<template>
    <div>
      <ChildTaps></ChildTaps>
      
    <v-card>
       
        
     <div  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 " v-for="evalu in details?.data">
          <div>
           
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
            <p v-if="evalu.status == 1" class="text-xl py-1 text-white rounded-md my-auto bg-[#f36464] px-3 mx-2"> منتهي</p>
            <p v-if="evalu.status == 0"  class="text-xl py-1 text-white rounded-md my-auto bg-[#f1f164] px-3 mx-2">  انتظار </p>
          </div>
          </div>
          <!-- <div class="text-center" >
          
              <Button @click="go_evaluate(evalu.id,evalu.type,evalu.child_id)" class="details m-auto"> نتائج التقييم</Button>     
              <Button   icon="pi pi-trash" @click="deleteevalution(evalu.id,evalu.child_id)" class="delete m-auto"> </Button>
            
          </div> -->
            
        </div>
        

     </div>
        
     <div class=" w-full pb-2 text-center"  >
      <div  class="card">
        
        <Paginator  v-model:first="current_page" :rows="1" :totalRecords="total_pages" :rowsPerPageOptions="[10, 20, 30]"
        :template="{
       
        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  JumpToPageDropdown'
    }"
        ></Paginator>
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
           deleteDialog:false,
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
  
  
  
      getusers(){
        axios
          .get(`api/evaluation-requests/child/${this.child_id}`)
          .then((response) => {
            console.log(response.data.evaluation_requests)
            this.details = response.data.evaluationRequests
           
          })
          .catch((error) => {
            console.error("Error retrieving Appointment Types:", error);
          });
  
      },
  
  
     
    },
    mounted() {
    this.child_id=localStorage.getItem("child_id") 
     this.getusers()
     
    },
  };
  </script>