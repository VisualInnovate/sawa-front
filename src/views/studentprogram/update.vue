<template>
  
  <div>
    <div>
      <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("add_sp") }}</p>
    </div>
 
  </div>
  
  <v-card>
    <form @submit.prevent="updatePrograme">
  
      <div class="p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4"  >
        <!-- ... existing code ... -->
          
             
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('ProgramName') }}</label>
                  <Dropdown   required id="pv_id_1" style="direction: ltr !important;" v-model="student.program_id" @update:model-value="getprograme"   option-value="id" filter :options="programes" optionLabel="name"  :class="{ 'p-invalid': submitted && !student.program_id}"/>
              </div> 
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('child_name') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.student_id"  @update:model-value=" getAllDoctor"   option-value="id" filter :options="child" optionLabel="name" :placeholder='$t("child_name")' :class="{ 'p-invalid': submitted && !student.student_id}"  />
              </div> 
              <div class="flex flex-column gap-2">
                  <label class="w-full text-right" for="username">{{ $t('recommendations') }}</label>
                  <v-textarea  bg-color="#EAE8E9" rows="3" v-model="student.recommendations" ></v-textarea> 
                </div>
              
      </div>
      <table v-if="student.program_id &&setiontype != 1" :class="{'animate__animated animate__bounce animate__delay-0s':error.balance}"  class="item-table w-[70%]">
          <thead>
            <tr>
              <th>{{ $t("Typetreatment") }}</th>
              <th>{{ $t("number_sessaion") }} </th>
              <th> عدد الجسات الفردية + الجماعية </th>
            </tr>
          </thead>
          <tbody  >
            <tr v-for="(item, index) in capasity" :key="index">
            
              <td>{{ item.name }}</td>
              <td>{{ item.sessions_number }}</td>
              <td>{{ maxcapsity }}</td>
              <td><Button @click="deleteitem(index)"  icon="pi pi-trash" class="p-button-rounded delete p-button-success m-auto" /></td>
            </tr>
            <tr v-if="student.program_id && maxcapsity>0 && setiontype != 1 " >
              <td><Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.Type"  option-value="id" filter :options="treaments" optionLabel="name" :placeholder='$t("Typetreatment")' class="w-full"  :class="{ 'p-invalid': submitted && !student.Type}" /> </td>
              <td><InputNumber :max="maxcapsity" :min="1"  class="bg-[#f7f5f5] w-full" v-model="student.sessions_number" :placeholder='$t("Sn")' /></td>
              <td>{{ maxcapsity }}</td>
              <td> <Button   @click="addarray" type="submit"  class="create m-auto s " icon="pi pi-plus" ></Button></td>
            </tr>
          </tbody>
          
      </table>

   
      <Toast/>
      <!-- ... existing code ... -->
    <div class="px-4" >
    
    <FullCalendar
       
      :options="opts"
      class="h-[400px]"
      @change="refreshEvents()"
      ref="fullCalendar"
      :dayRender="highlightSelectedDay"
    />
    <div class="mt-1 mb-5 text-red-500" v-if="error?.time_slots">{{ error.time_slots[0] }}</div>
    <div class="card flex justify-content-center">

      
    </div>
    <div class="flex flex-column gap-2 w-full">
       
                
                <Button  type="submit "  @click="submitted =true"  class="create m-auto w-full  lg:w-[50%] "  :label='$t("submit")'></Button>
          
              </div>
    </div>
    </form>


  </v-card>

 

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
import Calendar from "primevue/calendar";


import { useAppLangStore } from "../../stores/AppLangStore";
export default {

  components: {
    FullCalendar,
    Calendar
  },
  data() {
    return {
      doctors:{},
      admin_id:"",
      deleteDialog:false,
      submitted:false,
      setiontype:"",
      programes:{},
      child:{},
      rooms:{},
      error: {},
      doctors:{},
      isSubmitting: false,
      programe_type:{},
      toast:useToast(),
      student:{
        time_slots:[],
      },
      capasityboj:{},
      capasity:[],
      maxcapsity:"",
      treaments:{},
      
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
        editable: true,
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
       
      
        eventClick: function (event) {
         
         
          if (this.student.time_slots.some(item => item.time_slot_id == event.event.id)) {
            event.event.setProp('backgroundColor', 'blue');
            this.student.time_slots.splice(this.student.time_slots.findIndex(item => item.time_slot_id == event.event.id),1)
          }else{
            event.event.setProp('backgroundColor', 'green');
          this.student.time_slots.push({ time_slot_id: event.event.id });
          }
         console.log(this.student.time_slots)
        }.bind(this),

     
      },

      // Add other validation rules for the title field
    };

  },

  methods: {
    deleteitem(index){
    this.capasity.splice(index, 1); // يحذف العنصر بناءً على الفهرس

   },
    getAllDocto() {
    axios
      .get("api/doctors")
      .then((response) => {
        this.doctors = response.data.doctors;
        console.log(this.doctors);
      })
      .catch((error) => {
        console.error("Error retrieving doctors:", error);
      });
  },

    deletearray(){
      this.capasity.length=[]
      this.maxcapsity=this.refmaxcapsity
      
    },

    addarray(){
     
      this.capasity.push({'treatment_id':this.student.Type,'sessions_number':this.student.sessions_number,'name': this.treaments.find(item => item.id==this.student.Type ).name});
      this.maxcapsity=  this.maxcapsity - this.student.sessions_number
      this.student.sessions_number=""
        
           
      

    },
    getprograme(e){
    
              this.capasity=[]
              this.student.sessions_number=''
          axios.get(`/api/program/${this.student.program_id}`).then((res) => {
              this.refmaxcapsity=res.data.data.individual_sessions
              this.maxcapsity=res.data.data.individual_sessions
              this.setiontype=res.data.data.session_type
              

           });
           axios.get(`api/slot/filter/${e}`).then((res) => {
            this.opts.events = res.data.data.map(event => ({
            title: event.title,
            start: event.start,
            end: event.end,
            id: event.id,
            from:event.from
        }));
       

           });
   
    },
    getalltreatement(){
      axios.get("api/treatment/all")
        .then((response) => {
          this.treaments = response.data.data;
          this.getOne()
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
    getOne(){

      axios
        .get(`api/student-program/${this.$route.params.id}`)
        .then((response) => {
          this.student.student_id=response.data.data.student_id
          this.student.program_id=response.data.data.program_id
          this.student.recommendations=response.data.data.recommendations
          this.maxcapsity=response.data.data.program.individual_sessions
          response.data.data.student_program_details.forEach(element => {
            this.maxcapsity= this.maxcapsity-element.sessions_number
          });
          this.capasity = response.data.data.student_program_details.map(event => ({
            treatment_id:event.treatment_id,
            sessions_number:event.sessions_number,
            name:event.treatment.name
         }));
         this.opts.events = response.data.data.time_slots.map(event => ({
            title: event.title,
            start: event.start,
            end: event.end,
            id: event.id,
            from:event.from
        }));
       
        })

    },


    getallprogrames(){
      axios
        .get("api/program")
        .then((response) => {
          this.programes = response.data.data;
        })
     
    },

 

  
    updatePrograme() {
    
      axios.put(`/api/student-program/${this.$route.params.id}`,{
          program_id:this.student.program_id,
          student_id:this.student.student_id,
          details:this.capasity,
          time_slots:this.student.time_slots,
          shared_slots:this.maxcapsity
      }).then((res) => {    
        this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });

      }).catch((el)=>{
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${el.response.data.message}`, life: 3000 });

    })
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


   
    
 
    refreshEvents() {
      this.$refs.calendar.$emit("refetch-events");
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


</style>