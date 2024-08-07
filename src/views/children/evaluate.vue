<template>
    <div>
      <ChildTaps></ChildTaps>
      
    <v-card>
        <div class=" my-2 "  >
          <Button @click="opennew" class="bg-[green] m-auto" >  اضافة تقييم</Button>
         
          </div>
        
     <div  class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-2" v-for="evalu in details.data">
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
          
              <Button @click="go_evaluate(evalu.id,evalu.type,evalu.child_id)" class="details m-auto"> نتائج التقييم</Button>     
              <Button   icon="pi pi-trash" @click="deleteevalution(evalu.id,evalu.child_id)" class="delete m-auto"> </Button>
            
          </div>
            
        </div>
        

     </div>
        
     <div class=" w-full pb-2 text-center"  >
      <div v-if="details.data != []" class="card">
        
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
           delete_id:0,
           doctors:{},
           deleteDialog:false,
           total_pages:0,
           current_page:0,
           updatedialog:false,
          evaluate_types : [
                      { name: 'side profile', id: 1 },
                      { name: 'milestone', id: 2 },
                      { name: 'barrier', id: 3 },
                      { name: 'ablls', id: 4 },
                      { name: 'carolina', id: 5 },
   
                  ]
       
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      opennew(){
        this.updatedialog=!(this.updatedialog)
      },
    

      go_evaluate(id,type,child_id){
        if(type==2){
          this.$router.push({ name: 'milestone-resulte', params:{'id':child_id,'evla_id':id}});
        } 
        if(type==3){
          this.$router.push({ name: 'barrier-resulte', params:{'id':child_id}});
        }
        if(type==4){
          this.$router.push({ name: 'ablls-resulte', params:{'id':id}});
        }
        if(type==5){
          this.$router.push({ name: 'carolina-resulte', params:{'id':id}});
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
          .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations`)
          .then((response) => {

            this.total_pages=response.data.evaluations.last_page+1
            this.details = response.data.evaluations
           
          })
          .catch((error) => {
              
          });
  
      },
      deleteevalution(id){
        this.delete_id=id
        this.deleteDialog=!(this.deleteDialog)
      
      },
      deleteAction(){
        axios.delete(`api/evaluations/${this.delete_id}/delete`)
          .then((response) => {

           this.getusers()
           this.deleteDialog=!(this.deleteDialog)
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
    watch: {
      current_page(newVal, oldVal) {
      console.log(`Counter changed from ${oldVal} to ${newVal}`);
       
      axios
          .get(`api/child/${localStorage.getItem("child_id")}/get/evaluations?page=${newVal}`)
          .then((response) => {
            
            this.details = response.data.evaluations
            
           
        })
      // Perform any additional actions here
    }
  },
    mounted() {
     this.getusers()
     this.getdoctors()
     this.child_id=localStorage.getItem("child_id") 
    },
  };
  </script>