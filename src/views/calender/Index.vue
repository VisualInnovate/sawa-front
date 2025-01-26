<template>
  <v-card class="p-[1%] bg-slate-50">
      <Toolbar class="mb-4 shadow-md">
        <template #start>
          <div class="flex ">
              <Dropdown  @update:model-value="event.type=''" :placeholder='$t("employee_name")' id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.employee_id"  option-value="id" filter :options="employees" optionLabel="name" class="mx-2"  />
              <Dropdown :loading="!event.employee_id"  @update:model-value="getTimes" :placeholder='$t("type_work")' id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.type"  option-value="id" filter :options="event_types" optionLabel="name"  />

          </div>
        </template>

        <template #end>

        </template>
      </Toolbar>

      <FullCalendar   v-if="business_hours.length >= 1" :options="opts" ref="fullCalendar" />
    <Dialog v-model:visible="visible" id="modal" modal :header='$t("submit") ' :style="{ width: '40vw' }">
      <form @submit.prevent="create" class="">
                
               <div class="flex flex-column ">
              <label class="text-right ">{{ $t("title") }}</label>
              <InputText  v-model="event.title" :class="{ 'p-invalid': submitted && !event.title}" />
            </div>
          
                <div  class="flex flex-column gap-2 py-1">
                      <label class="w-full text-right" for="username">{{ $t('evalute_type') }}</label>
                      <Dropdown  required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.evaluation_type"  option-value="id"  :options="evaluate_types"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !event.evaluation_type}" />
                </div>
                <div  class="flex flex-column gap-2 py-1">
                      <label class="w-full text-right" for="username">{{ $t('child_name') }}</label>
                      <Dropdown  disabled required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.child_id"  option-value="id" filter :options="childreen"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !event.child_id}"/>
                </div>
               
               
                <div class="w-full text-center">
                <Button type="submit" @click="submitted=true" class="create m-auto w-[50%] my-4" :label='$t("submit")'></Button> 
               </div>
              </form>
    </Dialog>
    <Dialog v-model:visible="updateevent" id="modal" modal :header="modal_text" :style="{ width: '40vw' }">
      <form >
        <h2 class="font-bold text-xl text-center py-1" >{{ event.title }}</h2>
        <p class="font-bold text-lg text-center py-1"> {{ $t("from") }} {{event.start_time }} {{ $t("to") }} {{ event.end_time }}</p>
        <Button  class="delete mt-3"  icon="pi pi-trash"  @click="deleteEvent "  />
      </form>
    </Dialog>
    <Dialog v-model:visible="not_find" id="modal" modal :header="modal_text" :style="{ width: '40vw' }">
      <form >
        
       <p>{{ $t("no_open_positions") }}</p>
        
      </form>
    </Dialog>
  </v-card>
  <Toast></Toast>
</template>

<script>
import axios from "axios";
import moment from "moment";
import arLocale from "@fullcalendar/core/locales/ar";
import FullCalendar from "@fullcalendar/vue3";
import TimeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import { useAppLangStore } from "../../stores/AppLangStore";
import { Toast } from "flowbite-vue";
import { watch } from "vue";
import { text } from "@fortawesome/fontawesome-svg-core";

export default {
  components: {
    FullCalendar,
    Calendar,
    InputText,
    
  },
  data() {
    return {
      filter:{},
      not_find:false,
      childreen:[],
      modal_text:false,
      evaluate_types : [
                      { name: 'side profile', id: 1 },
                      { name: 'milestone', id: 2 },
                      { name: 'barrier', id: 3 },
                      { name: 'ablls', id: 4 },
                      { name: 'carolina', id: 5 },
   
                  ],
      event_types : [
                    { name: 'تقيممات', id: 1 },
                    { name: 'اجتماعات', id: 2 },
                   
                   
 
      ],
      users:[],
      business_hours:[],
      langStore: useAppLangStore(),
      visible: false,
      updateevent:false,
      event:{color:'87ceeb'},
      submitted:false,
      employees: [],
      avalible_day:[],
      days:[0,1,2,3,4,5,6],
      doctorshow: "",
      create_visible: false,
      event_id: null,     
      opts: {
        plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, listPlugin],
        initialView: "dayGridMonth",
        locale: null,
        slotDuration:'00:30:00',
        slotLabelInterval: '00:30:00',
        hiddenDays: [],
        slotMinTime:'00:00:00',
        slotMaxTime:'00:00:00',
        selectable: true,
        editable: true,
        validRange: { start: new Date() },
        headerToolbar: {
          left: "title",
          center: "prev next today",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
      selectAllow: (selectInfo) => {
      const calendarApi = this.$refs.fullCalendar.getApi();
      const events = calendarApi.getEvents();

      for (let event of events) {
        // تحقق فقط من التداخل على مستوى الوقت داخل نفس اليوم
        if (
          moment(selectInfo.start).isSame(event.start, "day") && // نفس اليوم
          (
            (selectInfo.start >= event.start && selectInfo.start < event.end) || // البداية داخل الحدث
            (selectInfo.end > event.start && selectInfo.end <= event.end)  // النهاية داخل الحدث
          )
        ) {
          return false; // يوجد تداخل، لا تسمح
        }
      }

      return true; // لا يوجد تداخل، يمكن الإضافة
    },
    

        eventClick: this.handleEventClick.bind(this),
        dateClick: this.handleDateClick,
        datesSet: this.handleDatesSet.bind(this),
        select: this.handleSelect.bind(this),
       
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    fetchEmployees() {
      axios
        .get("api/employees")
        .then((response) => {
          this.employees = response.data.data;
        })
        .catch((error) => console.error("Error retrieving doctors:", error));
    },
    handleDatesSet(event){
      if(this.business_hours.length >= 1){
          const clickedDate = new Date(event.startStr); 

      this.opts.slotMinTime=this.business_hours.find(item => item.day === clickedDate.getDay()).start
      this.opts.slotMaxTime=this.business_hours.find(item => item.day === clickedDate.getDay()).end
      }
    },

    getClidreen(){
      axios.get("/api/child").then((res)=>{

    this.childreen= res.data.children


  });
    },
    updateEvents() {
      axios.get(`/api/event-calendar?employee_id=${this.event.employee_id}&type=${this.event.type}`).then((res) => {
       
        this.opts.events = res.data.data.map(event => ({

            title: event.title,
            start: event.start,
            end: event.end,
            type: event.type,
            col :event.color,
            id: event.id,
            backgroundColor:'#'+event.color,
           
            // from:event.from
          }));
        
       
        
      });
    },
    create(){
        axios
          .post(`api/evaluation-request`,{
            employee_id:this.event.employee_id,
            color:this.event.color,
            title:this.event.title,
            evaluation_type:this.event.evaluation_type,
            consultant_id:this.event.employee_id,
            child_id:this.event.child_id,
            date:moment(this.opts.event.end).format(' YYYY-MM-DD'),
            start_time:moment(this.opts.event.start).format('HH:mm:ss'),
            end_time:moment(this.opts.event.end).format('HH:mm:ss'),
          })
          .then((response) => {
            this.visible=!(this.visible)
            this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
            this.getTimes()
            
           
          })
          .catch((el)=>{
            this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });
      });

      },
      getTimes(id) {
  axios
    .get(`api/employees/get/with/calendar/${this.event.employee_id}?type=${id}`)
    .then((response) => {
      this.avalible_day=response.data.data.days
      // Map business hours and store them in an array
      this.business_hours = response.data.data.days.map((event) => ({
        day: new Date(event.start).getDay(),
        start: moment(event.start).format("HH:mm:ss"),
        end: moment(event.end).format("HH:mm:ss"),
      }));

      // Dynamically set hiddenDays in calendar
      const openDays = this.business_hours.map((item) => item.day);
      this.opts.hiddenDays = this.days.filter((day) => !openDays.includes(day));

      // Map the booked events and add to calendar
      this.opts.events = response.data.data.booked.map((event) => ({
        title: event.title,
        start: `${event.date}T${event.start_time}+02:00`,
        end: `${event.date}T${event.end_time}+02:00`,
        backgroundColor: "#" + event.color,
      }));
    });
},



  
  
    handleEventClick(event) {
  

      this.event_id=event.event.id
      this.event.title = event.event.title
      this.event.color = '#'+event.event.color

      this.event.start_time = moment( event.event.start ).format('HH:mm:ss')   
      this.event.end_time = moment( event.event.end ).format('HH:mm:ss')   
    
      this.updateevent = true;
    },
    handleSelect(event) {
      this.opts.event=event
      
      const clickedDate = new Date(event.startStr); 

      this.opts.slotMinTime=this.business_hours.find(item => item.day === clickedDate.getDay()).start
      this.opts.slotMaxTime=this.business_hours.find(item => item.day === clickedDate.getDay()).end
      if (event.view.type == 'dayGridMonth' && this.avalible_day.some(day => day.start.includes(event.startStr))) {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.changeView("timeGridDay", event.startStr);
      }
      else if(event.view.type == 'timeGridDay'){
        this.visible=true
      }
      else{
        this.not_find=true
      }
  
},
    createEvent() {
    
      
      
      axios.post("/api/event-calendar", this.event).then(() => {
        this.updateEvents();
        this.visible=false
        this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });

      }) .catch((el)=>{
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${el.response.data.message}`, life: 3000 });

      });
    },
    
    updateEvent() {
      axios.put(`/api/event-calendar/${this.event_id}`, this.event).then(() => {
     this.updateevent=false
        this.updateEvents();
      });
    },
    deleteEvent() {

      axios.delete(`api/evaluations/44/delete`)
          .then((response) => {
            // this.getTimes()
           
          })
      
    },
    resetModal() {
      this.visible = false;
      this.updateevent=false
      this.event={
        color:'87ceeb'
      }
    },
  },
  watch: {
          // Watch the variable for changes
          business_hours(newValue, oldValue) {
                  // Extract the `day` values from `business_hours`
             if(newValue.length >=1){
              const usedDays = newValue.map(entry =>   entry.day);
              // Filter `days` to only include those present in `usedDays`
              this.opts.hiddenDays=this.days.filter(day => !usedDays.includes(day));
             }else{
              this.opts.hiddenDays= []
             }
          },
      },
  mounted() {
    this.getClidreen()
    this.fetchEmployees();
    this.doctorshow = localStorage.getItem("type");
    this.opts.locale = localStorage.appLang === "en" ? null : arLocale;
    console.log(this.$route.params.id)
    this.event.child_id=parseInt(this.$route.params.id)
  },
};
</script>
<style scoped>
input {
  width: 100%;
  font-size: 20px;
  text-align: center;
  margin: 20px 0;
  padding: 8px;
  border: 2px solid #8284a8;
}
p {
  color: red;
  font-size: 20px;
  text-align: center;
  margin: 5px 0;
}

</style>
