<template>
  
    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("add_sp") }}</p>
      </div>
   
    </div>
    
    <div class="sawa-card">
      <form @submit.prevent="createtreatment">
    
        <div class="p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4"  >
          <!-- ... existing code ... -->
            
               
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('ProgramName') }}</label>
                    <Select   required v-model="student.program_id" @update:model-value="getprograme"   option-value="id" filter :options="programes" optionLabel="name"  :class="{ 'p-invalid': submitted && !student.program_id}"/>
                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('child_name') }}</label>
                    <Select required v-model="student.student_id" option-value="id" filter :options="child" optionLabel="name" :placeholder='$t("child_name")' :class="{ 'p-invalid': submitted && !student.student_id}"  />
                </div> 
                <div class="flex flex-column gap-2">
                  <label class="w-full text-start" for="username">{{ $t('recommendations') }}</label>
                  <Textarea rows="3" v-model="student.recommendations" autoResize fluid /> 
                </div>
                
        </div>
        <table v-if="student.program_id" :class="{'animate__animated animate__bounce animate__delay-0s':error.details}" class="item-table w-[70%]">
            <thead>
              <tr>
                <th>{{ $t("Typetreatment") }}</th>
                <th>{{ $t("number_sessaion") }} </th>
                <th>{{ $t("sessions_count_total") }}</th>
              </tr>
            </thead>
            <tbody  >
              <tr v-for="(item, index) in capasity" :key="index">
              
                <td>{{ item.name }}</td>
                <td>{{ item.sessions_number }}</td>
                <td>{{ maxcapsity }}</td>
                <td><Button type="button" @click="deleteitem(index)" icon="pi pi-trash" class="m-auto" rounded severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" /></td>
              </tr>
              <tr v-if="student.program_id && maxcapsity > 0">
                <td><Select required v-model="student.Type"  option-value="id" filter :options="treaments" optionLabel="name" :placeholder='$t("Typetreatment")' class="w-full"  :class="{ 'p-invalid': submitted && !student.Type}" /> </td>
                <td><InputNumber :max="maxcapsity" :min="1"  class="w-full" v-model="student.sessions_number" :placeholder='$t("Sn")' /></td>
                <td>{{ maxcapsity }}</td>
                <td><Button type="button" @click="addarray" class="m-auto s" icon="pi pi-plus" :disabled="!canAddTreatment" /></td>
              </tr>
            </tbody>
            
        </table>
        <div class="mt-2 mb-5 text-red-500" v-if="error?.details">{{ error.details[0] }}</div>

     
        <Toast/>
        <!-- ... existing code ... -->
      <div class="px-4" >
      
      <div class="slot-picker-header">
        <div>
          <h3>{{ $t('student_program_choose_slots') }}</h3>
          <p>{{ $t('student_program_choose_slots_hint') }}</p>
        </div>
        <span class="selected-slots-count">
          <i class="pi pi-calendar-check" />
          {{ $t('student_program_selected_slots', { count: student.time_slots.length }) }}
        </span>
      </div>
      <div v-if="slotsLoading" class="slot-state"><i class="pi pi-spin pi-spinner" /> {{ $t('calendar_loading') }}</div>
      <div v-else-if="slotsError" class="slot-state slot-state-error">{{ slotsError }}</div>
      <div v-else-if="student.program_id && !opts.events.length" class="slot-state">{{ $t('student_program_no_slots') }}</div>
      <FullCalendar
        v-show="!slotsLoading && opts.events.length"
        :options="opts"
        class="h-[400px]"
        ref="fullCalendar"
      />
      <div class="mt-1 mb-5 text-red-500" v-if="error?.time_slots">{{ error.time_slots[0] }}</div>
      <div class="card flex justify-content-center">

        
      </div>
      <div class="flex flex-column gap-2 w-full">
         
                  
                  <Button type="submit" :loading="isSubmitting" :disabled="isSubmitting" @click="submitted = true"
                    class="m-auto w-full lg:w-[50%]" :label='$t("submit")' />
            
                </div>
      </div>
      </form>
  
  
    </div>

   

  </template>
  
  <script>
  import {useToast} from 'primevue/usetoast'
  import FullCalendar from "@fullcalendar/vue3";
  import TimeGridplugin from "@fullcalendar/timegrid";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import listPlugin from "@fullcalendar/list";
  import axios from "axios";
  import { ref } from "vue";
  import moment from "moment";
  import arLocale from "@fullcalendar/core/locales/ar";
  import DatePicker from 'primevue/datepicker';
  
  
  import { useAppLangStore } from "../../stores/AppLangStore";
  export default {
  
    components: {
      FullCalendar,
      DatePicker
    },
    data() {
      return {
        doctors:{},
        admin_id:"",
        deleteDialog:false,
        submitted:false,
        setiontype:"",
        programes:[],
        child:[],
        rooms:{},
        error: {},
        isSubmitting: false,
        slotsLoading: false,
        slotsError: "",
        programe_type:{},
        toast:useToast(),
        student:{
          time_slots:[],
        },
        capasityboj:{},
        capasity:[],
        maxcapsity:"",
        treaments:[],
        
        time_slotename:[],
        // calender
        buttomaddcal:true,
        timeshow:false,
        FullCalendarshow:false,
        langStore: useAppLangStore(),
       
        opts: {
          plugins: [dayGridPlugin, interactionPlugin, TimeGridplugin, listPlugin],
          initialView: "dayGridMonth",
          footerToolbar: true,
          valid: false,
          buttonIcons: false,
          locale: null,
          validRange: {
            start: new Date(), // Set your minimum date here
            
          },
  
          selectable: false,
          droppable: false,
          editable: false,
          events: [],
          selectHelper: true,
          validRange: {
            start: new Date(),
          },
          headerToolbar: {
           
            center: "prev next today",
  
            left: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          },
          eventsTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          },
         
        
          eventClick: (info) => this.toggleTimeSlot(info),
  
       
        },
  
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {
      deleteitem(index){
      const [removed] = this.capasity.splice(index, 1);
      this.maxcapsity = Number(this.maxcapsity || 0) + Number(removed?.sessions_number || 0);

     },
      deletearray(){
        this.capasity.length=[]
        this.maxcapsity=this.refmaxcapsity
        
      },

      addarray(){
        if (!this.canAddTreatment) return;
        const treatment = this.treaments.find(item => item.id == this.student.Type);
        const existing = this.capasity.find(item => item.treatment_id == this.student.Type);
        if (existing) existing.sessions_number += Number(this.student.sessions_number);
        else this.capasity.push({
          treatment_id: this.student.Type,
          sessions_number: Number(this.student.sessions_number),
          name: treatment.name,
        });
        this.maxcapsity = Number(this.maxcapsity) - Number(this.student.sessions_number);
        this.student.Type = null;
        this.student.sessions_number = null;
      },
      async getprograme(programId){
        this.student.program_id = Number(programId);
        this.capasity = [];
        this.student.Type = null;
        this.student.sessions_number = null;
        this.student.time_slots = [];
        this.opts.events = [];
        this.slotsError = "";
        this.slotsLoading = true;
        try {
          const [programResponse, slotsResponse] = await Promise.all([
            axios.get(`/api/program/${programId}`),
            axios.get(`/api/slot/filter/${programId}`),
          ]);
          const program = programResponse.data.data;
          this.refmaxcapsity = Number(
            program.sessions_number
              ?? (Number(program.individual_sessions || 0) + Number(program.collective_sessions || 0))
          );
          this.maxcapsity = this.refmaxcapsity;
          this.setiontype = Number(program.session_type);
          const now = moment();
          this.opts.events = (slotsResponse.data.data || [])
            .filter(event => moment(event.end).isAfter(now))
            .map(event => ({
              title: event.title,
              start: event.start,
              end: event.end,
              id: Number(event.id),
              backgroundColor: '#64748b',
              borderColor: '#475569',
              classNames: ['student-program-slot'],
            }));
          if (this.opts.events.length) {
            const firstSlot = [...this.opts.events].sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf())[0];
            this.$nextTick(() => this.$refs.fullCalendar?.getApi().gotoDate(firstSlot.start));
          }
        } catch (error) {
          this.slotsError = error.response?.data?.message || this.$t('request_failed_retry');
        } finally {
          this.slotsLoading = false;
        }
      },
      toggleTimeSlot({ event }) {
        const slotId = Number(event.id);
        const selectedIndex = this.student.time_slots.findIndex(item => Number(item.time_slot_id) === slotId);
        if (selectedIndex >= 0) {
          this.student.time_slots.splice(selectedIndex, 1);
          event.setProp('backgroundColor', '#64748b');
          event.setProp('borderColor', '#475569');
        } else {
          this.student.time_slots.push({ time_slot_id: slotId });
          event.setProp('backgroundColor', '#168694');
          event.setProp('borderColor', '#0f6670');
        }
        this.error = { ...this.error, time_slots: null };
      },
      getalltreatement(){
        axios.get("api/treatment/all")
          .then((response) => {
            this.treaments = response.data.data;
            console.log(this.doctors);
          })
      },
      getallchild(){
        axios
          .get("api/child")
          .then((response) => {
            this.child = response.data.children;
          })

      },

  

      getallprogrames(){
        axios
          .get("api/program")
          .then((response) => {
            this.programes = response.data.data;
          })
       
      },

   

    
      createtreatment() {
        if (this.isSubmitting) return;
        this.submitted = true;
        if (!this.capasity.length) {
          this.error = { ...this.error, details: [this.$t('student_program_add_treatment_error')] };
          return;
        }
        if (!this.student.time_slots.length) {
          this.error = { ...this.error, time_slots: [this.$t('student_program_select_slot_error')] };
          return;
        }
        this.isSubmitting = true;
        axios.post("/api/student-program",{
            program_id:this.student.program_id,
            student_id:this.student.student_id,
            details:this.capasity,
            recommendations:this.student.recommendations,
            time_slots:this.student.time_slots,
            shared_slots:this.maxcapsity
        }).then((res) => {    
          this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
          this.$router.push({ name: 'student-programe' });
        }).catch((el)=>{
          this.error = el.response?.data?.errors || {};
          this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${el.response.data.message}`, life: 3000 });
        }).finally(() => { this.isSubmitting = false; });
      },

  
      highlightSelectedDay(info) {
              if (this.$store.state.calendar.selectedDay === info.dateStr) {
                  info.el.classList.add('selected-day');
              }
          },
      loo(){
        if (localStorage.appLang == "en"){
        console.log ("ascasc")
      }
      else{
       this.opts.locale = arLocale
     
      }
      },


     
      
   
    },
    computed: {
      canAddTreatment() {
        const sessions = Number(this.student.sessions_number);
        return Boolean(this.student.Type) && Number.isInteger(sessions) && sessions > 0 && sessions <= Number(this.maxcapsity);
      },
    },
  
  
  
    
    mounted() {
      
      this.getallprogrames()
      this.getallchild()
      this.getalltreatement()
      if (localStorage.appLang == "en") {
        console.log("ascasc");
      } else {
        this.opts.locale = arLocale;
      }

    },
    watch: {
      "langStore.appLang"(newLang) {
        if (newLang == "en") {
          this.opts.locale = "";
        } else {
          this.opts.locale = arLocale;
        }
      },
    },
  
  
  
  };
  </script>
  <style>

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .item-table {
    border-collapse: collapse;
  }
  
  .item-table th, .item-table td {
    padding: 5px;
    border: 1px solid #ddd;
    text-align: center;
  }

  .slot-picker-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; margin: 1rem 0 .75rem; }
  .slot-picker-header h3 { color: #1e293b; font-weight: 700; font-size: 1.05rem; }
  .slot-picker-header p { color: #64748b; font-size: .9rem; }
  .selected-slots-count { display: inline-flex; align-items: center; gap: .5rem; padding: .55rem .85rem; border-radius: 999px; background: #e8f6f7; color: #0f6670; font-weight: 700; }
  .slot-state { display: flex; align-items: center; justify-content: center; gap: .5rem; min-height: 8rem; margin-bottom: 1rem; padding: 1rem; border: 1px dashed #cbd5e1; border-radius: .75rem; background: #f8fafc; color: #475569; }
  .slot-state-error { border-color: #fecaca; background: #fff1f2; color: #be123c; }
  :deep(.student-program-slot) { cursor: pointer; }
  
  
  </style>
