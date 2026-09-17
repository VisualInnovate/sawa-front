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
      <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-2" v-for="evalu in details" :key="evalu.id">
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
          <h3 class="my-auto font-bold">{{ $t(" حالة التقييم") }} :</h3>
          <p v-if="evalu.status == 1" class="text-xl  px-1 my-auto">{{ $t("status_finished") }}</p>
          <p v-if="evalu.status == 0"  class="text-xl  px-1 my-auto">{{ $t("status_under_evaluation") }}</p>
        </div>
        </div>
        <div class="text-center" >
        
            <Button v-can="['evaluation results list', 'able answer list', 'carolina answer list', 'milestone answer list', 'barrier answer list']" @click="go_evaluate(evalu.id,evalu.type,evalu.child_id)" class="m-auto">{{ $t("evaluation_results") }}</Button>     
            <Button v-can="'evaluations delete'"  icon="pi pi-trash" @click="deleteevalution(evalu.id,evalu.child_id)" class="m-auto" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')"> </Button>
          
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
        <form @submit.prevent="create" class="">
              
        
          <div  class="flex flex-column gap-2 py-1">
                <label class="w-full text-start" for="username">{{ $t('evalute_type') }}</label>
                <Select @update:model-value="getdoctor_evalte" required v-model="evalate.evaluation_type"  option-value="id" filter :options="evaluate_types"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !evalate.evaluation_type}" />
          </div>
          <div v-if="evalate.evaluation_type" class="flex flex-column gap-2 py-1">
                <label class="w-full text-start" for="username">{{ $t('Name_evaluator') }}</label>
                <Select @update:model-value="getDays" required v-model="evalate.specialist_id"  option-value="id" filter :options="doctors"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !evalate.specialist_id}"/>
          </div>
          <div v-if="evalate.specialist_id" class="flex flex-column gap-2">
                  <label  class="w-full text-start" for="username">{{ $t('Evaluation_date') }}</label>
                  <DatePicker  @update:model-value="gettimes($event)"   :disabledDays="filteredDays"  style="width: 100%" showButtonBar v-model.number="evalate.date" showIcon  :class="{ 'p-invalid': submitted && !evalate.date}"  :minDate="maxDate" />   
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.date">{{ error.date[0] }}</div>
          </div> 
          <div  v-if="evalate.date" class="flex flex-column gap-2 py-1">
                <label class="w-full text-start" for="username">{{ $t('hour_evaluator') }}</label>
                <Select required v-model="evalate.Session_time"   filter :options="slots"  optionLabel="key" :class="{ 'p-invalid': submitted && !evalate.Session_time}" class="w-full" />
              <div class="mt-1 mb-5 text-red-500" v-if="error?.specialist_id">{{ error.specialist_id[0] }}</div>
          </div>
         
          <div class="w-full text-center">
          <Button type="submit" @click="submitted=true" class="m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
         </div>
        </form>
         
          
        

         
      </Dialog>
  </div>
  <Toast />

  </div>
</template>
<script>
import axios from "axios";
import { useStorage } from "@vueuse/core";
import ChildTaps from '../../components/ChildTaps.vue'
import moment from "moment";
import { fetchUserProfile } from "./userProfile";
export default {
   components:{ChildTaps},

  data() {
    return {
        child_id: useStorage("child_id", Number),
         maxDate: new Date(),
         details:[],
         loading:true,
         evalate:{},
         error:{},
         days:[0,1,2,3,4,5,6],
         business_hours:[],
         submitted:false,
         slots:[],
         delete_id:0,
         doctors:[],
         deleteDialog:false,
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
  
    getdoctor_evalte(id){
      axios
        .post(`api/evaluation-doctors`,{
          evaluation_type:id
        })
        .then((response) => {
         
          this.doctors = response.data.doctors
         
        })
       
    },
    getDays(id){
      this.business_hours=this.doctors.find(item => item.id == id).business_hours
      console.log(this.business_hours)
    },
    gettimes(e){
      
      axios
        .post(`api/users/available/slots`,{
          user_id:this.evalate.specialist_id,
          evaluation_type:this.evalate.evaluation_type,
          date:moment(e).format("Y-MM-DD") 
        })
        .then((response) => {
         
         this.slots=response.data.slots
        })
      


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

    create(){
      axios
        .post(`api/evaluation-request`,{
          child_id:localStorage.getItem("child_id"),
          consultant_id:localStorage.getItem("user_id"),
          evaluation_type:this.evalate.evaluation_type,
          date:moment(this.evalate.date).format("Y-MM-DD") ,
          specialist_id:this.evalate?.specialist_id,
          start_time:this.evalate?.Session_time?.start,
          end_time:this.evalate?.Session_time?.end,


        })
        .then((response) => {
          this.updatedialog=!(this.updatedialog)
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
          
          this.$router.push({ name: 'children-request' });
         
        })
        .catch((el)=>{
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });
    });

    },


    getusers(refresh = false){
      this.loading = true
      fetchUserProfile({ refresh })
        .then((data) => {
          this.details = data.other_evaluations ?? []
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteevalution(id){
      this.delete_id=id
      this.deleteDialog=!(this.deleteDialog)
    
    },
    deleteAction(){
      axios.delete(`api/evaluations/${this.delete_id}/delete`)
        .then((response) => {

         this.getusers(true)
         this.deleteDialog=!(this.deleteDialog)
        })
    },

   
  },
  computed: {
  filteredDays() {
    // Extract the `day` values from `business_hours`
    const usedDays = this.business_hours.map(entry => entry.day);
    // Filter `days` to only include those present in `usedDays`
    return this.days.filter(day => !usedDays.includes(day));
  },
},
  mounted() {
   this.getusers()


   
  },
};
</script>