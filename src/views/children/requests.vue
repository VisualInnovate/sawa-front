<template>
    <div>
      <ChildTaps></ChildTaps>
      
    <div class="sawa-card">
       
        
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
            <h3 class="my-auto font-bold">{{ $t("نوع التقييم") }} :</h3>
            <p class="text-xl  px-1 my-auto">{{ typeLabel(evalu) }}</p>
          </div>
          <div v-if="evalu.notes" class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t("notes") }} :</h3>
            <p class="text-lg px-1 my-auto whitespace-pre-line">{{ evalu.notes }}</p>
          </div>
          <div class="flex py-2 ">
            <h3 class="my-auto font-bold">{{ $t(" حالة التقييم") }} :</h3>
            <Tag class="my-auto mx-2" :severity="requestStatus(evalu.status).severity" :value="$t(requestStatus(evalu.status).key)" />
          </div>
          <!-- «المحاسبة»: closed until paid; a cancelled one gets a new time and evaluator. -->
          <div v-if="evalu.billing_status && evalu.billing_status !== 'cancelled'" class="flex flex-wrap items-center gap-2 py-2">
            <Tag :severity="billingSeverity[evalu.billing_status]" :value="$t(`acc.billing.${evalu.billing_status}`)" />
            <span v-if="evalu.billing_price != null" class="text-sm" :class="{ 'line-through text-color-secondary': evalu.billing_status === 'free' }">{{ amount(evalu.billing_price) }}</span>
          </div>
          <div v-if="Number(evalu.status) === 3" class="flex flex-wrap items-center justify-between gap-2 py-2">
            <small class="text-red-600">{{ $t("acc.cancelled_hint") }}</small>
            <Button v-can="'evaluation request create'" icon="pi pi-refresh" size="small" :label="$t('acc.reassign_evaluation')" @click="reassigning = evalu" />
          </div>
          </div>
          <div v-can="'evaluation request delete'" class="flex justify-end pt-2">
            <Button icon="pi pi-trash" size="small" severity="danger" variant="outlined" :label="$t('delete')" @click="deleting = evalu; deleteDialog = true" />
          </div>
          <!-- <div class="text-center" >
          
              <Button @click="go_evaluate(evalu.id,evalu.type,evalu.child_id)" class="m-auto">{{ $t("evaluation_results") }}</Button>     
              <Button   icon="pi pi-trash" @click="deleteevalution(evalu.id,evalu.child_id)" class="m-auto" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')"> </Button>
            
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
      
    </div>
    <div>
      <ReassignEvaluationDialog :visible="!!reassigning" :request="reassigning" @update:visible="(open) => { if (!open) reassigning = null; }" @saved="getusers" />
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
            <Button  :label='$t("yes")' icon="pi pi-check" @click="deleteAction" severity="danger" :loading="removing" />
          </template>
        </Dialog>
    </div>
    <Toast />

    </div>
  </template>
  <script>
  import axios from "axios";
  import { useStorage } from "@vueuse/core";
  import ChildTaps from '../../components/ChildTaps.vue'
  import { requestStatus } from "../../utils/evaluationRequestStatus";
  import { getEvaluationTypeLabel } from "../../utils/evaluationTypes";
  import { amount, billingSeverity } from "../../utils/accounting";
  import ReassignEvaluationDialog from "../../components/accounting/ReassignEvaluationDialog.vue";
  
    import {useToast} from 'primevue/usetoast'
  export default {
     components:{ChildTaps, ReassignEvaluationDialog},
  
    data() {
      return {
          child_id: useStorage("child_id", Number),
           maxDate: new Date(),
           details:{},
           deleteDialog:false,
           reassigning: null,
           deleting: null,
           removing: false,
           toast: useToast(),
           billingSeverity,
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      requestStatus,
      amount,
      typeLabel(request) {
        return getEvaluationTypeLabel(request.evaluation_type, this.$t, request.title || "-");
      },
  
  
  
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
  
  
      // An unpaid charge is cancelled with the request; a paid one waits for the accountant.
      deleteAction() {
        if (!this.deleting) return;
        this.removing = true;
        axios.delete(`api/evaluation-request/${this.deleting.id}`)
          .then(() => {
            this.toast.add({ severity: "success", summary: this.$t("deleted_successfully"), life: 3000 });
            this.deleteDialog = false;
            this.deleting = null;
            this.getusers();
          })
          .catch((error) => {
            this.toast.add({ severity: "error", summary: error.response?.data?.message || this.$t("request_failed_retry"), life: 4000 });
          })
          .finally(() => { this.removing = false; });
      },
    },
    mounted() {
    this.child_id=localStorage.getItem("child_id") 
     this.getusers()
     
    },
  };
  </script>