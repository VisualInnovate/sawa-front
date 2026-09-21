
<template>
    <div>
         
    <div class="sawa-card">
      <div v-if="loading" class="flex justify-center py-8">
        <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="4" />
      </div>
      <div v-else-if="!details.length" class="text-center py-8 text-gray-500">
        <i class="pi pi-inbox text-2xl mb-2" />
        <p>{{ $t('no_records_found') }}</p>
      </div>
     <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class=" bg-slate-100 rounded-sm p-4 grid grid-cols-3" v-for="evalu in details" :key="evalu.id">
          <div class="col-span-2">
            <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("اسم التقييم") }} :</h3>
            <p class="text-xl px-1 my-auto">{{ evaluationName(evalu) }}</p>
          </div>
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("تاريخ التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.date }}</p>
          </div>
        
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.child?.name }}</p>
          </div>
          </div>
          <div class="text-center" >
          <Button v-can="['evaluation results create', 'able answer create', 'carolina answer create', 'milestone answer create', 'barrier answer create']" @click="go_evaluate(evalu.child_id,evalu.evaluation_type,evalu.id)" class="m-auto"> {{ $t("strart_evaluate") }}</Button>
          <Button v-can="'evaluation request delete'"  icon="pi pi-trash" @click="deleteevalution(evalu.id)" class="m-auto" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')"> </Button>

          </div>
            
        </div>
        

     </div>
        
  
      
    </div>
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
            <Button  :label='$t("no")' icon="pi pi-times" @click="deleteDialog = false" variant="text" severity="secondary" />
            <Button  :label='$t("yes")' icon="pi pi-check" @click="deleteAction" severity="danger" />
          </template>
        </Dialog>
      <Dialog v-model:visible="updatedialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
          <div class="">
                
           
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-start" for="username">{{ $t('evalute_type') }}</label>
                  <Select required v-model="evalate.evaluation_type"  option-value="id" filter :options="evaluate_types"  optionLabel="name" :placeholder='$t("evalute_type")' class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.evaluation_type">{{ error.evaluation_type[0] }}</div>
            </div>
            <div class="flex flex-column gap-2 py-1">
                  <label class="w-full text-start" for="username">{{ $t('Name_evaluator') }}</label>
                  <Select required v-model="evalate.specialist_id"  option-value="id" filter :options="doctors"  optionLabel="name" :placeholder='$t("Name_evaluator")' class="w-full" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.specialist_id">{{ error.specialist_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label  class="w-full text-start" for="username">{{ $t('Evaluation_date') }}</label>
                    <DatePicker  style="width: 100%" showButtonBar v-model.number="evalate.date" showIcon  :placeholder='$t("Evaluation_date")'  :maxDate="maxDate" />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
                </div> 
           
            
          </div>
           
            
           <div class="w-full text-center">
            <Button @click="createevaluate" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
           </div>

           
        </Dialog>
    </div>
    <Toast />

    </div>
  </template>
  <script>
  import axios from "axios";
  import { useStorage } from "@vueuse/core";
  import EvaluationType from '../../components/EvaluationType.vue'
  import moment from "moment";
  import { fetchUserProfile } from "./userProfile";
  import { getEvaluationStartRoute, getEvaluationTypeLabel } from "../../utils/evaluationTypes";
  export default {
     components:{EvaluationType},
  
    data() {
      return {
          child_id: useStorage("child_id", Number),
          eavl_id: useStorage("eavl_id", Number),
           maxDate: new Date(),
           details:[],
           loading:true,
           evalate:{},
           evalate_type: useStorage("evalate_type", ''),
           error:{},
           deleteDialog:false,
           delete_id:'',
           doctors:[],
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

           this.getusers(true)
           this.deleteDialog=!(this.deleteDialog)
          })
      },
      deleteevalution(id){
        this.delete_id=id
        this.deleteDialog=!(this.deleteDialog)
      
      },
      evaluationName(evaluation) {
        return getEvaluationTypeLabel(
          evaluation.evaluation_type,
          (key) => this.$t(key),
          evaluation.title || this.$t("unknown_evaluation_type"),
        );
      },
      go_evaluate(id,evalu_id,eva_id){
        const route = getEvaluationStartRoute(evalu_id, id, eva_id);
        if (!route) {
          this.$toast.add({ severity: 'error', summary: this.$t('error'), detail: this.$t('unknown_evaluation_type'), life: 4000 });
          return;
        }

        localStorage.setItem("child_id", id);
        localStorage.setItem("eavl_id", eva_id);
        this.evalate_type = evalu_id;
        this.$router.push(route);
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
  
  

      getusers(refresh = false){
        this.loading = true
        fetchUserProfile({ refresh })
          .then((data) => {
            this.details = data.evaluation_requests ?? []
          })
          .finally(() => {
            this.loading = false
          })
      },
     
    },
    mounted() {
     this.getusers()
     this.child_id=localStorage.getItem("child_id") 
    },
  };
  </script>
