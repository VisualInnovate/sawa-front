<template>
  <div>
    
  <div class="sawa-card evaluation-board">
      <header class="evaluation-toolbar">
        <div><h2>{{ $t("Consultations_evaluations") }}</h2><p>{{ $t("completed_evaluations_hint") }}</p></div>
        <div class="evaluation-tools">
          <Tag :value="$t('requests_count', { count: details.length })" severity="secondary" />
          <IconField><InputIcon class="pi pi-search" /><InputText v-model="search" :placeholder="$t('child_name')" :aria-label="$t('search')" /></IconField>
        </div>
      </header>
      <div v-if="loading" class="evaluation-empty">
        <ProgressSpinner style="width: 42px; height: 42px" strokeWidth="4" />
      </div>
      <div v-else-if="!filteredDetails.length" class="evaluation-empty">
        <i class="pi pi-inbox" />
        <p>{{ $t('no_records_found') }}</p>
      </div>
      <div v-else class="evaluation-grid">
        <article class="evaluation-card" v-for="evalu in filteredDetails" :key="evalu.result_id ? 'result-' + evalu.result_id : evalu.id">
          <header class="evaluation-heading">
            <span class="evaluation-symbol"><i class="pi pi-chart-line" /></span>
            <div class="evaluation-title">
              <h3>{{ evalu.title }}</h3>
              <span>{{ typeLabel(evalu.type) }}</span>
            </div>
            <Tag :severity="evalu.status == 1 ? 'success' : 'warn'" :value="$t(evalu.status == 1 ? 'status_finished' : 'status_under_evaluation')" />
          </header>
          <dl class="evaluation-meta">
            <div v-if="evalu.child_name || evalu.kid?.name">
              <dt><i class="pi pi-user" /> {{ $t("child_name") }}</dt>
              <dd>{{ evalu.child_name || evalu.kid?.name }}</dd>
            </div>
            <div>
              <dt><i class="pi pi-calendar" /> {{ $t("evaluation_date") }}</dt>
              <dd>
                <time>{{ datePart(evalu.date) }}</time>
                <span v-if="timePart(evalu.date)" class="evaluation-time" dir="ltr"><i class="pi pi-clock" /> {{ timePart(evalu.date) }}</span>
              </dd>
            </div>
          </dl>
          <footer class="evaluation-actions">
            <Button v-if="!evalu.result_id" v-can="'evaluations delete'" icon="pi pi-trash" @click="deleteevalution(evalu.id,evalu.child_id)" severity="danger" variant="text" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
            <Button v-can="['evaluation results list', 'able answer list', 'carolina answer list', 'milestone answer list', 'barrier answer list']" @click="go_evaluate(evalu.id,evalu.type,evalu.child_id,evalu)" icon="pi pi-chart-bar" :label="$t('evaluation_results')" />
          </footer>
        </article>
      </div>
  </div>
  <div>
    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
        <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
          <span 
          >{{ $t('هل انت متاكد من ازالة هذا العنصر') }} 
          </span
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
import { fetchUserProfile, USER_PROFILE_INVALIDATED_EVENT } from "./userProfile";
import { getEvaluationTypeLabel } from "../../utils/evaluationTypes";
export default {
   components:{ChildTaps},

  data() {
    return {
        child_id: useStorage("child_id", Number),
         maxDate: new Date(),
         details:[],
         search:"",
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
    typeLabel(type) {
      return getEvaluationTypeLabel(type, this.$t)
    },
    // Side profile results carry a time ("2026-09-23 12:38:00"); other evaluations only a date.
    datePart(value) {
      return String(value || '').split(/[ T]/)[0]
    },
    timePart(value) {
      return String(value || '').split(/[ T]/)[1]?.slice(0, 5) || ''
    },
    refreshProfile() {
      this.getusers(true)
    },
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
    go_evaluate(id,type,child_id,data){
      if (Number(type) === 1) {
        // Evaluations without a side profile open with 0 in its place.
        return this.$router.push({ name: 'showChildResult', params: { child_id, sideProfile_id: data.side_profile_id || 0, evaluation_id: id } });
      }
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
  filteredDetails() {
    const term = this.search.trim().toLocaleLowerCase();
    if (!term) return this.details;
    return this.details.filter(item => String(item.child_name || item.kid?.name || '').toLocaleLowerCase().includes(term));
  },
  filteredDays() {
    // Extract the `day` values from `business_hours`
    const usedDays = this.business_hours.map(entry => entry.day);
    // Filter `days` to only include those present in `usedDays`
    return this.days.filter(day => !usedDays.includes(day));
  },
},
  mounted() {
   this.getusers()
   window.addEventListener(USER_PROFILE_INVALIDATED_EVENT, this.refreshProfile)
  },
  activated() {
    this.getusers(true)
  },
  beforeUnmount() {
    window.removeEventListener(USER_PROFILE_INVALIDATED_EVENT, this.refreshProfile)
  },
};
</script>

<style scoped>
.evaluation-board { padding: clamp(.75rem, 2vw, 1.5rem); }
.evaluation-toolbar, .evaluation-tools, .evaluation-heading, .evaluation-actions { display: flex; align-items: center; gap: 1rem; }
.evaluation-toolbar { justify-content: space-between; flex-wrap: wrap; margin-bottom: 1.5rem; }
.evaluation-toolbar h2 { font-size: 1.3rem; font-weight: 700; color: var(--sawa-primary); margin: 0; }
.evaluation-toolbar p { color: var(--sawa-muted); font-size: .9rem; margin-top: .4rem; }
.evaluation-tools { flex-wrap: wrap; }
.evaluation-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr)); }
.evaluation-card { display: flex; flex-direction: column; border: 1px solid var(--sawa-border); border-radius: 18px; overflow: hidden; background: white; }
.evaluation-heading { background: #f0f8f7; padding: 1rem 1.15rem; gap: .75rem; }
.evaluation-symbol { display: grid; place-items: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 14px; background: white; color: var(--sawa-primary); }
.evaluation-title { flex: 1; min-width: 0; }
.evaluation-title h3 { margin: 0 0 .2rem; font-size: 1.05rem; font-weight: 700; overflow-wrap: anywhere; }
.evaluation-title span { color: var(--sawa-muted); font-size: .85rem; }
.evaluation-meta { display: grid; gap: .85rem; padding: 1rem 1.15rem; margin: 0; flex: 1; }
.evaluation-meta > div { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
.evaluation-meta dt { display: inline-flex; align-items: center; gap: .5rem; color: var(--sawa-muted); font-size: .9rem; white-space: nowrap; }
.evaluation-meta dd { margin: 0; font-weight: 600; text-align: end; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .25rem .75rem; }
.evaluation-time { display: inline-flex; align-items: center; gap: .35rem; color: var(--sawa-muted); font-weight: 500; }
.evaluation-actions { justify-content: flex-end; padding: .75rem 1.15rem; border-top: 1px solid var(--sawa-border); gap: .5rem; }
.evaluation-empty { text-align: center; padding: 3rem; color: var(--sawa-muted); }
@media (max-width: 600px) { .evaluation-tools { width: 100%; } .evaluation-tools .p-iconfield { flex: 1; } }
</style>
