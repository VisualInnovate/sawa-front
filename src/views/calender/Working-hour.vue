<template>
    <v-card class="p-[1%] bg-slate-50">
        <Toolbar class="mb-4 shadow-md">
          <template #start>
            <div class="my-2">
                <Dropdown @update:model-value="getTimes" :placeholder='$t("employee_name")' id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.employee_id"  option-value="id" filter :options="employees" optionLabel="name"  />

            </div>
          </template>

          <template #end>

          </template>
        </Toolbar>

        <FullCalendar  v-if="event.employee_id" :options="opts" ref="fullCalendar" />
      <Dialog v-model:visible="visible" id="modal" modal :header='$t("submit") ' :style="{ width: '40vw' }">
        <form @submit.prevent="createEvent">
          <div>

            <div class="flex flex-column ">
              <label class="text-right ">{{ $t("title") }}</label>
              <InputText  v-model="event.title" :class="{ 'p-invalid': submitted && !event.title}" />
            </div>
            <!-- <div class="flex flex-column ">
              <label class="text-right ">{{ $t("color") }}</label>
              <ColorPicker   :style="{ 'background-color':'#' +event.color  }"  class="w-full h-[50px] mb-2" v-model="event.color" />
            </div> -->
            <div  class="flex flex-column gap-2">
              <label class="text-right ">{{ $t("type_work") }}</label>
              <MultiSelect v-model="event.type"  :options="event_types" optionLabel="name" optionValue="id" :class="{ 'p-invalid': submitted && !event.user_id}" />
            </div>
           
            <div class="flex gap-2 my-2">
                <InputSwitch v-model="event.sub" /> 
                  <span class="px-2"> {{ $t('هل تريد تكرار الحدث') }}</span>
            </div>
            <div v-if="event.sub" class="flex flex-column gap-2 py-1">
                      <label class="w-full text-right" for="username">{{ $t('evalute_type') }}</label>
                      <Dropdown  required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.repeat_type"    :options="repeat_types"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !event.repeat_type}" />
              </div>
              <div v-if="event.repeat_type?.id == 2"  class="flex flex-column gap-2">
              <label class="text-right ">{{ $t("اختر ايام التكرار") }}</label>
                 <MultiSelect v-model="event.day"  :options="days_week"   optionLabel="name" optionValue="value" :class="{ 'p-invalid': submitted && !event.days}" />
              </div>
           
            
            <Button type="submit" class="create mt-3" :label='$t("submit") '  @click="submitted = true "  />
            <!-- <Button  label="Update" :loading="loading" @click="updateEvent"  />
            <Button   class="delete"    label="Delete"  :loading="loading"  @click="deleteEvent" />-->
  
          </div>
        </form>
      </Dialog>
      <Dialog v-model:visible="updateevent" id="modal" modal :header="modal_text" :style="{ width: '40vw' }">
        <form @submit.prevent="updateEvent">
          <div>
            <div class="flex flex-column ">
              <label class="text-right ">{{ $t("title") }}</label>
              <InputText  v-model="event.title" :class="{ 'p-invalid': submitted && !event.title}" />
            </div>
            <!-- <div class="flex flex-column ">
              <label class="text-right ">{{ $t("color") }}</label>
              <ColorPicker   :style="{ 'background-color':'#' +event.color  }"  class="w-full h-[50px] mb-2" v-model="event.color" />
            </div> -->
            <div  class="flex flex-column gap-2">
              <label class="text-right ">{{ $t("doctor") }}</label>
              <MultiSelect v-model="event.type"  :options="event_types" optionLabel="name" optionValue="id" :class="{ 'p-invalid': submitted && !event.user_id}" />
            </div>
            
           
         
           <div class="flex ">
            <Button type="submit" class="bg-[green] mt-3"  icon="pi pi-pencil"      @click="updateEvent " />
            <Button type="submit" class="delete mt-3"  icon="pi pi-trash"  @click="deleteEvent "  />
           </div>
            <!-- <Button  label="Update" :loading="loading" @click="updateEvent"  />
            <Button   class="delete"    label="Delete"  :loading="loading"  @click="deleteEvent" />-->
  
          </div>
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

         days_week :[
          
            { name: 'Sunday', value: 0 },
            { name: 'Monday', value: 1 },
            { name: 'Tuesday', value: 2},
            { name: 'Thursday', value: 3 },
            { name: 'Wednesday', value: 4 },
            { name: 'Friday', value: 5 },
            { name: 'Saturday', value: 6 }
          
        ],
        event_types : [
                      { name: 'تقيممات', id: 1 },
                      { name: 'اجتماعات', id: 2 },
                      { name: 'استشارات', id: 3 },
                     
   
        ],
        repeat_types:[
                      { name: 'تكرار ايام ',type:'single','dateFormat':'DD MM yy ', id: 1 },
                      { name: 'تكرار اسبوعي ',type:'single','dateFormat':'DD MM yy ', id: 2 },
                      // { name: 'تكرار الشهور',type:'month','dateFormat':' MM yy ', id: 4 },
                      // { name: 'تكرار السنوات',type:'year','dateFormat':'  yy ', id: 3 },
        ],
        users:[],
        business_hours:[],
        langStore: useAppLangStore(),
        visible: false,
        updateevent:false,
        event:{color:'87ceeb',
          repeate:{}
        },
        submitted:false,
        employees: [],
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
      updateEvents() {
        axios.get(`/api/event-calendar?employee_id=${this.event.employee_id}`,).then((res) => {
  
          this.opts.events = res.data.data.map(event => ({
  
              title: event.title,
              start: event.start,
              end: event.end,
              type: event.type,
              col :event.color,
              id: event.id,
              backgroundColor:'#'+event.color,
             
            }));
          
         
          
        });
      },
      getTimes(id){
        axios
          .get(`api/employees/get/with/shift-days/${id}`)
          .then((response) => {
           
            this.business_hours = response.data.data.days
           this.updateEvents()
           
          })
      },


    
    
      handleEventClick(event) {
        console.log(event)
        this.event_id=event.event.id
        this.event.title = event.event.title
        this.event.color = '#'+event.event.color
        this.event.start = event.event.start
        this.event.end = event.event.start   
        this.event.type = event.event.extendedProps.type   
        this.event.color = event.event.extendedProps.col   
        this.updateevent = true;
      },
      handleSelect(event) {
        const clickedDate = new Date(event.startStr); 
  
        this.opts.slotMinTime=this.business_hours.find(item => item.day === clickedDate.getDay()).start
        this.opts.slotMaxTime=this.business_hours.find(item => item.day === clickedDate.getDay()).end
        if(event.view.type == 'dayGridMonth'){
          const calendarApi = this.$refs.fullCalendar.getApi();
          calendarApi.changeView("timeGridDay", event.startStr);
        }else{
            this.event.start=event.startStr
            this.event.end=event.endStr
            this.visible = true;
        }
    
  },
      createEvent() {
      
        this.event.repeate.type=this.event.repeat_type.id
        this.event.repeate.days=this.event.day
        
        axios.post("/api/event-calendar",{
          employee_id:this.event.employee_id,
          title:this.event.title,
          type:this.event.type,
          start:this.event.start,
          end:this.event.end,
          color:this.event.color,
          repeat:this.event.repeate
        }).then(() => {
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
        axios.delete(`/api/event-calendar/${this.event_id}`).then(() => {
          this.updateevent=false
          this.updateEvents();
        });
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
                const usedDays = newValue.map(entry => entry.day);
                // Filter `days` to only include those present in `usedDays`
                this.opts.hiddenDays=this.days.filter(day => !usedDays.includes(day));
            },
        },
    mounted() {
       
      this.fetchEmployees();
      this.doctorshow = localStorage.getItem("type");
      this.opts.locale = localStorage.appLang === "en" ? null : arLocale;
      this.updateEvents();
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
  