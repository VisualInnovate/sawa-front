<template>
    <div>
      <ChildTaps></ChildTaps>
      
    <v-card>
        <div class=" my-2"  >
          <Button @click="opennew" class="bg-[green] m-auto" >  اضافة تقييم</Button>
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
          <Button @click="go_evaluate(evalu.id)" class="details m-auto"> نتائج التقييم</Button>
          </div>
            
        </div>
        

     </div>
        
  
      
    </v-card>
    <div>
      <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="">
                
           
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('evalute_type') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="evalate.evaluation_type"  option-value="id" filter :options="evaluate_types"  optionLabel="name" :placeholder='$t("evalute_type")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.evaluation_type">{{ error.evaluation_type[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-right" for="username">{{ $t('Name_evaluator') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="evalate.specialist_id"  option-value="id" filter :options="doctors"  optionLabel="name" :placeholder='$t("Name_evaluator")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.specialist_id">{{ error.specialist_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label  class="w-full text-right" for="username">{{ $t('Evaluation_date') }}</label>
                    <Calendar  style="width: 100%" showButtonBar v-model.number="evalate.date" showIcon  :placeholder='$t("Evaluation_date")'  :minDate="maxDate" />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
                </div> 
           
            
          </div>
           
            
           <div class="w-full text-center">
            <Button @click="createevaluate" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>

           
        </Dialog>
    </div>
    <toast></toast>

    </div>
  </template>
  <script>
  import axios from "axios";
  import { useStorage } from "@vueuse/core";
  import ChildTaps from '../../components/ChildTaps.vue'
  import moment from "moment";
    import {useToast} from 'primevue/usetoast'
  export default {
     components:{ChildTaps},
  
    data() {
      return {
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
                      { name: 'ablls', id: 4 },
   
                  ]
       
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      opennew(){
        this.updatedialog=!(this.updatedialog)
      },
    

      go_evaluate(id){
        this.$router.push({ name: 'milestone-resulte', params:{'id':id}});
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
          .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`)
          .then((response) => {
           
            this.details = response.data.evaluations
           
          })
          .catch((error) => {
              
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