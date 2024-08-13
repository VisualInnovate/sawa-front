
  <template>
    <div>
      <div class=" relative">
        <EvaluationType></EvaluationType>
        <div class="absolute  top-4 ltr:left-2 rtl:right-4 flex flex-column gap-2">
                    
          <InputText @update:model-value="serchdata($event)"  :placeholder='$t("search")'/>                      <div class="mt-1 mb-5 text-red-500" v-if="error?.child_id">{{ error.child_id[0] }}</div>
                </div>
      </div>
     
        
      
      
      
    <v-card>
        
     <div  class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div class="shadow-md bg-slate-100 rounded-sm p-4 grid grid-cols-3" v-for="evalu in details">
          <div class="col-span-2">
            <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("اسم التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==2">milestone</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==1">side profile</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==3">Barrier</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==4">ablls</p>
            <p class="text-xl  px-1 my-auto" v-if="evalu.evaluation_type ==5">carolina</p>
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
            <h3 class="my-auto font-bold">{{ $t("child_name") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ evalu.child?.name }}</p>
          </div>
          </div>
          <div class="text-center" >
          <Button @click="go_evaluate(evalu.child.id,evalu.evaluation_type,evalu.id)" class="details m-auto"> {{ $t("strart_evaluate") }}</Button>
          <Button   icon="pi pi-trash" @click="deleteevalution(evalu.id)" class="delete m-auto"> </Button>

          </div>
            
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
                    <Calendar  style="width: 100%" showButtonBar v-model.number="evalate.date" showIcon  :placeholder='$t("Evaluation_date")'  :maxDate="maxDate" />   
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
  import EvaluationType from '../../components/EvaluationType.vue'
  import moment from "moment";
    import {useToast} from 'primevue/usetoast'
  export default {
     components:{EvaluationType},
  
    data() {
      return {
          child_id: useStorage("child_id", Number),
          eavl_id: useStorage("eavl_id", Number),
           maxDate: new Date(),
           details:[],
           evalate:{},
           evalate_type: useStorage("evalate_type", ''),
           error:{},
           deleteDialog:false,
           delete_id:'',
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

          deleteAction(){
        axios.delete(`api/evaluation-request/${this.delete_id}`)
          .then((response) => {

           this.getusers()
           this.deleteDialog=!(this.deleteDialog)
          })
      },
      deleteevalution(id){
        this.delete_id=id
        this.deleteDialog=!(this.deleteDialog)
      
      },
      go_evaluate(id,evalu_id,eva_id){
        console.log(id,evalu_id)



        if(evalu_id == 1){
          this.$router.push({ name: 'ShowSideProfiles', params:{'id':id}});
        }
        if(evalu_id == 2){
          this.$router.push({ name: 'milestone-evaluation',  params:{'id':id}});
        }
        if(evalu_id == 3){
          this.$router.push({ name: 'barrier-evaluation',  params:{'id':id}});
        }
        if(evalu_id == 4){
          this.$router.push({ name: 'mission-test',  params:{'id':id}});
        }
        if(evalu_id == 5){
          this.$router.push({ name: 'carolina-test',  params:{'id':id}});
        }
        
 
         localStorage.setItem("child_id",id)
         localStorage.setItem("eavl_id",eva_id)
        
         this.evalate_type=evalu_id
     
       
       
       
       
      },
      serchdata(e){

        axios
          .get(`api/users/${localStorage.getItem("doctor_id")}/search/evaluations?search=${e}`)
          .then((response) => {
            this.details = response.data.evaluation_requests
           
          })
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
          .get(`api/users/${localStorage.getItem("doctor_id")}/get/evaluations`)
          .then((response) => {
            console.log(response.data.evaluation_requests)
            this.details = response.data.evaluation_requests
           
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
    mounted() {
     this.getusers()
     this.getdoctors()
     this.child_id=localStorage.getItem("child_id") 
    },
  };
  </script>