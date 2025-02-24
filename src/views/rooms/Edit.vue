<template>
  
  <div>
    <div>
      <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("room") }}</p>
    </div>
    <div v-if="loading" class="loader"></div>
    <!-- Your existing content goes here -->
  </div>
  
  <v-card>
    <div>
    
      <form class=" p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="createtreatment">
        <!-- ... existing code ... -->
          
              <div class="flex flex-column gap-2">
                <label for="username">{{ $t('roomnumber') }}</label>
              <InputText required class="bg-[#f7f5f5]" v-model="rooms.name" :class="{ 'p-invalid': submitted && !rooms.name}" />
              <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
              </div>
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('roomdoctor') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="rooms.admin_id"  option-value="id" filter :options="doctors" optionLabel="name"   :class="{ 'p-invalid': submitted && !rooms.admin_id}" />
              </div> 
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('typeroom') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="rooms.type_tow"  option-value="value" :options="arr2()" optionLabel="name" :class="{ 'p-invalid': submitted && !rooms.type_tow}" />
                 
              </div>
              <div v-if="rooms.type_tow == 2" class="flex flex-column gap-2">
                  <label for="username">{{ $t('typeroom') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="rooms.type"  option-value="value" :options="arr()" optionLabel="name" :class="{ 'p-invalid': submitted && !rooms.type}" />
              </div>
                
              <div  v-if="rooms.type_tow !=0 && rooms.type !=0 && rooms.type_tow  " class="flex flex-column gap-2">
                  <label for="username">{{ $t('roomsnumber') + " "}}</label>
                  <InputNumber required class="bg-[#f7f5f5]" v-model="rooms.capacity" :class="{ 'p-invalid': submitted && !rooms.capacity}" />
              </div>
         
              <div class="flex flex-column gap-2 w-full">
                <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                
                <Button type="submit"  @click="submitted=true"  class="create m-auto w-full  lg:w-[50%] " icon="pi pi-plus" :label='$t("Add_appointment")'></Button>
                <small id="username-help"></small>
              </div>
             
              

      
      </form>
      <Toast/>
      <!-- ... existing code ... -->
      <div class="px-4" >
    
    <FullCalendar
       
      :options="opts"
     v-if="rooms.room_id"
      @change="refreshEvents()"
      ref="fullCalendar"
      :dayRender="highlightSelectedDay"
    />
    <div class="card flex justify-content-center">
      <Dialog v-model:visible="visible" id="modal" modal :header='$t("submit") ' :style="{ width: '40vw' }">
        <form @submit.prevent="create">
          <div>

            <div class="flex flex-column ">
              <label class="text-right ">{{ $t("title") }}</label>
              <InputText  v-model="event.title" :class="{ 'p-invalid': submitted && !event.title}" />
            </div>
            <!-- <div class="flex flex-column ">
              <label class="text-right ">{{ $t("color") }}</label>
              <ColorPicker   :style="{ 'background-color':'#' +event.color  }"  class="w-full h-[50px] mb-2" v-model="event.color" />
            </div> -->
           
           
            <div class="flex gap-2 my-2">
                <InputSwitch v-model="event.sub" /> 
                  <span class="px-2"> {{ $t('هل تريد تكرار الحدث') }}</span>
            </div>
            <div v-if="event.sub" class="flex flex-column gap-2 py-1">
                      <label class="w-full text-right" for="username">{{ $t('نوع التكرار') }}</label>
                      <Dropdown  required id="pv_id_1" style="direction: ltr !important; text-align: center !important;" v-model="event.repeat_type"    :options="repeat_types"  optionLabel="name"  class="w-full" :class="{ 'p-invalid': submitted && !event.repeat_type}" />
              </div>
              <div v-if="event.repeat_type?.id == 2"  class="flex flex-column gap-2">
              <label class="text-right ">{{ $t("اختر ايام التكرار") }}</label>
                 <MultiSelect v-model="event.day"  :options="days_week"   optionLabel="name" optionValue="value" :class="{ 'p-invalid': submitted && !event.days}" />
              </div>
              <div v-if="event.repeat_type "  class="flex flex-column gap-2">
              <label class="text-right ">{{ $t(" تاريخ نهاية التكرار") }}</label>
              <Calendar    showButtonBar v-model.number="event.end_of_repeat" showIcon     />   
              </div>

            
            <Button type="submit" class="create mt-3" :label='$t("submit") '  @click="submitted = true "  />
            <!-- <Button  label="Update" :loading="loading" @click="updateEvent"  />
            <Button   class="delete"    label="Delete"  :loading="loading"  @click="deleteEvent" />-->
  
          </div>
        </form>
      </Dialog>
      <Dialog v-model:visible="updateDialog" id="modal" modal :header="modal_text" :style="{ width: '40vw' }">
        <form @submit.prevent="updateevent">
          <div>
            <div class="flex flex-column ">
              <label class="text-right ">{{ $t("title") }}</label>
              <InputText  v-model="event.title" :class="{ 'p-invalid': submitted && !event.title}" />
            </div>
            
         
           <div class="flex ">
            <Button type="submit" class="bg-[green] mt-3"  icon="pi pi-pencil"      @click="submitted=true " />
            <Button type="submit" class="delete mt-3"  icon="pi pi-trash"  @click="deleteEvent "  />
           </div>
        
          </div>
        </form>
      </Dialog>
    </div>
  </div>
    </div>

   <div class="w-full py-3 text-center">
    <Button class="create w-[90%] m-auto lg:w-[50%] " :label='$t("update")' @click="updateRoom"></Button>
   </div>
  </v-card>
</template>

<script>
import {useToast} from 'primevue/usetoast'
import arLocale from "@fullcalendar/core/locales/ar";
import FullCalendar from "@fullcalendar/vue3";
import TimeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Calendar from "primevue/calendar";
import axios from "axios";
import { ref } from "vue";
import moment from "moment";


import { useAppLangStore } from "../../stores/AppLangStore";
export default {

  components: {
    FullCalendar,
    Calendar
  },
  data() {
    return {
      rooms:{},
      days_week :[
          
          { name: 'Sunday', value: 0 },
          { name: 'Monday', value: 1 },
          { name: 'Tuesday', value: 2},
          { name: 'Thursday', value: 3 },
          { name: 'Wednesday', value: 4 },
          { name: 'Friday', value: 5 },
          { name: 'Saturday', value: 6 }
        
      ],
      repeat_types:[
                      { name: 'تكرار ايام ',type:'single','dateFormat':'DD MM yy ', id: 1 },
                      { name: 'تكرار اسبوعي ',type:'single','dateFormat':'DD MM yy ', id: 2 },
                      { name: 'تكرار الشهور',type:'month','dateFormat':' MM yy ', id: 3 },
                      { name: 'تكرار السنوات',type:'year','dateFormat':'  yy ', id: 4 },
        ],
      error: {},
      doctors:{},
      submitted:false,
      isSubmitting: false,
      updateDialog:false,
      programe_type:{},
      toast:useToast(),
      room_id:'',
      slot_id:"",

      // calender
     event:{color:'87ceeb',
          repeate:[
            {
              type:'',
              days:'',
              end_of_repeat:''
            }
          ]
        },
      buttomaddcal:true,
      FullCalendarshow:false,
      langStore: useAppLangStore(),
      visible: false,
      create_visible: false,
      event_id: null,
      creat_event: ref(false),
      updat_event: ref(false),
      event_title: "",
      start_event: "",
      end_event: "",
      loading: false,
      modal_text: "",
      time_start: "",
      time_end: "",
      opts: {
      plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, listPlugin],
        initialView: "dayGridMonth",
        locale: null,
        slotDuration:'00:30:00',
        slotLabelInterval: '00:30:00',
     
        slotMinTime:'08:00:00',
       slotMaxTime:'17:00:00',
        selectable: true,
        editable: true,
        validRange: { start: new Date() },
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
        selectable: true,
        droppable: true,
        editable: true,
        selectHelper: false,
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
          console.log(event.event.start)
          this.updateDialog=true
          this.event.end=event.event._def.extendedProps.cole
          this.event.start=event.event.start
          this.event.title = event.event.title;
          this.event_id=event.event.id
          this.rooms.room_id=event.event.extendedProps.room_id
       

        }.bind(this),

        select: function (event) {
      

          
              if(event.view.type == 'dayGridMonth'){
                const calendarApi = this.$refs.fullCalendar.getApi();
                calendarApi.changeView("timeGridDay", event.startStr);
              }else{
                  this.event.start=event.startStr
                  this.event.end=event.endStr
                  this.visible = true;
              }
        }.bind(this),
      },

      // Add other validation rules for the title field
    };

  },

  methods: {
    // ... existing methods ...
    Therapeutic (){
      this.$router.push({ name: 'Rooms' });
    },
    arr2(){
      return this.roomType =[
            
            { name:this.$t('Administrative') , value:0 },
            { name:this.$t('social') , value:1},
            { name:this.$t('Consultation_evaluation') , value:2},
           
           
        ]
    },

    
    arr (){
      return this.roomType =[
            
                { name:this.$t('typeroom2') , value:0 },
                { name:this.$t('typeroom1') , value:1},
                { name:this.$t('typeroom3') , value:2},
               
               
            ]
    },



    getAllDoctor() {
      axios
        .get("api/doctors")
        .then((response) => {
          this.doctors = response.data.doctors;
          this.update();
        })
        .catch((error) => {
          console.error("Error retrieving doctors:", error);
        });
    },
    
  
    createtreatment() {
    
      axios.post("/api/room",this.rooms).then((res) => {
        this.rooms.room_id=res.data.data.id

      }).catch((el)=>{
     
    })
    },



    highlightSelectedDay(info) {
            if (this.$store.state.calendar.selectedDay === info.dateStr) {
                info.el.classList.add('selected-day');
            }
        },
  
    goBack() {
      this.$router.go(-1);
    },
    deleteEvent() {
      axios
        .delete(`/api/slot/${this.event_id}`)
        .then((res) => {
          this.update()
          this.updateDialog = false
        });
   
   
    },

    updateRoom(){
      axios.put(`/api/room/${this.$route.params.id}`,this.rooms).then((res) => {
      this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_update_success")}`, life: 3000 });
      }).catch((el)=>{
        this.$toast.add({ severity: 'error', summary: this.$t("error"), detail: `${this.$t("mission_error")}`, life: 3000 });

      })
    },
    updateevent() {
     if(this.repeat)this.repeat=1
     else this.repeat=0
      axios
        .put(`/api/slot/${this.event_id}`, {        
          title: this.event.title,
          start:this.event.start,
          end: this.event.end,
          color:this.event.color,
          room_id:this.rooms.room_id, 
          repeat:this.repeat,       
        })
        .then((res) => {
          this.update()
          this.updateDialog = false
        });

    },
     create() {
        this.event.repeate[0].type=this.event?.repeat_type?.id
        this.event.repeate[0].days=this.event.day
        this.event.repeate[0].end_of_repeat=moment(this.event.end_of_repeat).format(' YYYY-MM-DD')
      axios
        .post("/api/slot", {
          title: this.event.title,
          start:this.event.start,
          end: this.event.end,
          color:this.event.color,
          room_id:this.rooms.room_id, 
          repeat:this.event.repeate,
        })
        .then((res) => {
          this.visible=false
          this.update();
        }).catch((el)=>{
       
     this.error = el.response.data.errors
    });
     
   
    },
    update() {
      axios.get(`/api/room/${this.$route.params.id}`).then((res) => {
        console.log(res.data.data.id);
        this.rooms=res.data.data
        this.rooms.room_id=res.data.data.id
        this.opts.events = res.data.data.slots.map(event => ({
            cole: event.end,
            title: event.title,
            start: event.start,
            id: event.id,
            room_id:event.room_id
          }));
       
       
        

       
      });
    },
    refreshEvents() {
      this.$refs.calendar.$emit("refetch-events");
    },
  },



  
  mounted() {
    
    if (localStorage.appLang == "en") {
      console.log("ascasc");
    } else {
      this.opts.locale = arLocale;
    }
    console.log(localStorage.appLang);
   
    console.log(this.opts);
   this.getAllDoctor()
  },
  watch: {
    "langStore.appLang"(newLang) {
      if (newLang == "en") {
        this.opts.locale = "";
      } else {
        this.opts.locale = arLocale;
      }
      this.update();
    },
  },



};
</script>
