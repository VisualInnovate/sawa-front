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
      <!-- ... existing code ... -->
      <v-dialog v-model="isSuccessModalOpen" max-width="400px">
        <v-card>
          <v-card-title>{{ $t("Success!") }}</v-card-title>
          <v-card-text>
            {{ $t("Data seeded successfully!") }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeSuccessModal" color="success">
              {{ $t("OK") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-form class="animate__animated animate__zoomIn  p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="seedData">
        <!-- ... existing code ... -->
          
        <div class="flex flex-column gap-2">
                <label for="username">{{ $t('roomnumber') }}</label>
              <InputText required class="bg-[#f7f5f5]" v-model="rooms.name" :placeholder='$t("roomnumber")' />
              <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
              </div>
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('roomdoctor') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="rooms.admin_id"  option-value="id" filter :options="doctors" optionLabel="name" :placeholder='$t("roomdoctor")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.admin_id">{{ error.admin_id[0] }}</div>
              </div> 
              <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('typeroom') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="rooms.type_tow"  option-value="value" :options="arr2()" optionLabel="name" :placeholder='$t("typeroom")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.type_tow">{{ error.type_tow[0] }}</div>
              </div>
              <div v-if="rooms.type_tow == 2" class="flex flex-column gap-2">
                  <label for="username">{{ $t('typeroom') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="rooms.type"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("typeroom")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.type">{{ error.type[0] }}</div>
              </div>
             
              

              <div  v-if="rooms.type_tow !=0 && rooms.type_tow  " class="flex flex-column gap-2">
                  <label for="username">{{ $t('roomsnumber') + " "}}</label>
                  <InputNumber required class="bg-[#f7f5f5]" v-model="rooms.capacity" :placeholder='$t("roomsnumber")' />
                  <div class="mt-1 mb-5 text-red-500" v-if="error?.capacity">{{ error.capacity[0] }}</div>
              </div>
              <!-- <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('roomstable') }}</label>
                  <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="treatments.session_type"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("roomstable")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.session_type">{{ error.session_type[0] }}</div>
              </div> -->
             
              

      
      </v-form>
      <Toast/>
      <!-- ... existing code ... -->
      <div class="px-4" >
    
    <FullCalendar
     style="max-height:70vh;"
      :options="opts"
        
      @change="refreshEvents()"
      ref="fullCalendar"
      :dayRender="highlightSelectedDay"
    />
    <div class="card flex justify-content-center">
      <Dialog
        v-model:visible="visible"
        id="modal"
        modal
        :header="modal_text"
        :style="{ width: '40vw' }"
      >
        <form>
          <div>

            <div v-if="updat_event" class="py-3">
              <label  for="time_start">{{ $t("start_date") }}</label>
              <Calendar
              
            style="width: 100%"
            showButtonBar
            v-model.number="start_event"
            showIcon
            placeholder="dd/mm/yy"
            

          />
            </div>
            <div v-if="updat_event" class="py-3">
              <label for="time_start">{{ $t("end_date") }}</label>
              <Calendar
            style="width: 100%"
            showButtonBar
            v-model.number="end_event"
            showIcon
            placeholder="dd/mm/yy"
         

          />
            </div>
            <div>
              <label for="time_start">{{ $t("from") }}</label>
              <input
              class="cal"
                type="time"
                name="time_start"
                id="time_start"
                v-model="time_start"
                style="border-radius: 5px"
              />
            </div>
            <div>
              <label for="time_end">{{ $t("to") }}</label>
              <input
                class="cal"
                type="time"
                name="time_end"
                id="time_end"
                v-model="time_end"
                style="border-radius: 5px"
              />
            </div>
            <Button
              style="background-color: rgb(4, 171, 4); border: 0"
              label="Create "
              v-if="creat_event"
              :loading="loading"
              @click="createvent"
            />
            <Button
            icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
              v-if="updat_event"
              :loading="loading"
              @click="updateevent"
            />
            <Button
            icon="pi pi-trash"
                class="delete mt-2"
          
              v-if="updat_event"
              :loading="loading"
              @click="deletevent"
            />
           
          
          </div>
        </form>
      </Dialog>
      <div class="flex flex-column gap-2 w-full">
                <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                <Button @click="createtreatment" class="create m-auto w-full lg:w-[50%] " :label='$t("submit")'></Button>
                <small id="username-help"></small>
              </div>
    </div>
  </div>
    </div>


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
      rooms:{},
      error: {},
      doctors:{},
      isSubmitting: false,
      programe_type:{},
      toast:useToast(),
      room_id:'',
      slot_id:"",

      // calender
      buttomaddcal:true,
      timeshow:false,
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
        eventTimeFormat: { // like '14:30:00'
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  },
        plugins: [dayGridPlugin, interactionPlugin, TimeGridplugin, listPlugin],
        initialView: "dayGridMonth",
        footerToolbar: true,
        valid: false,
        buttonIcons: false,
        locale: null,
        validRange: {
          start: new Date(), // Set your minimum date here
          
        },

        selectable: true,
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
        eventDrop: function (event) {
          console.log(event.event.id);
          axios
            .post(`/api/calender/${event.event.id}/update`, {
              start: event.event.start,
              end: event.event.end,
            })
            .then((res) => {
              console.log(res.data.k);
            });
        },
        eventDrop: function (event) {
       
        const date1 = new Date(event.event.start);
        const hours1 = String(date1.getHours()).padStart(2, '0');
      const minutes1 = String(date1.getMinutes()).padStart(2, '0');
      const date2 = new Date(event.event.end);
        const hours2 = String(date2.getHours()).padStart(2, '0');
      const minutes2 = String(date2.getMinutes()).padStart(2, '0');
          axios
            .post(`/api/slot`, {
              title: event.event.title,
              from:hours1 +":"+minutes1,
              to:hours2 +":"+minutes2,
              room_id:this.$route.params.id,
              start_event: moment(event.event.start),
              end_event: moment(event.event.end),
            })
            .then((res) => {
              this.update()
              console.log(res.data.k);
            });
        }.bind(this),

        eventClick: function (event) {
          
          this.event_id = event.event.id;
          this.event_title = event.event.title;
          this.modal_text = this.$t("update_event");
          this.creat_event = false;
          this.updat_event = true;
          this.getslotid()
          this.visible= true;
          this.start_event = moment(event.event.start).format("YYYY-MM-DD");
          this.end_event = moment(event.event.end).format("YYYY-MM-DD");
          console.log(event.event._def.publicId);
        }.bind(this),

        select: function (event) {
          console.log(event);
          this.event_title = "";
          this.modal_text = this.$t("create_event");
          this.creat_event = true;
          this.updat_event = false;
          this.visible = true;

          console.log(event);
          const originalDate = new Date(event.end);
          originalDate.setDate(originalDate.getDate() -1);
          this.start_event = moment(event.start).format("YYYY-MM-DD");
          this.end_event = moment(originalDate.toISOString().split('T')[0]).format("YYYY-MM-DD");
          console.log(event.backgroundColor);
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
    programetype (){
      return this.roomType =[
            
                { name:this.$t('diurnal') , value:0 },
                { name:this.$t('Clinics') , value:1 },
                { name:this.$t('house') , value:2 },
               
            ]
    },

    getTreatmentTypes() {
      axios
        .get("api/treatment-types")
        .then((response) => {
          this.treatmentTypes = response.data.treatmentTypes;
          console.log(this.treatmentTypes);
        })
        .catch((error) => {
          console.error("Error retrieving Appointment Types:", error);
        });
    },

    getprograme(){
      axios
        .get("api/treatmentcounts")
        .then((response) => {
          // this.treatmentTypes = response.data.treatmentTypes;
          console.log(this.treatmentTypes);
        })
        .catch((error) => {
          console.error("Error retrieving Appointment Types:", error);
        });

    },
    getAllDoctor() {
      axios
        .get("api/doctors")
        .then((response) => {
          this.doctors = response.data.doctors;
          console.log(this.doctors);
          this.update()
        })
        .catch((error) => {
          console.error("Error retrieving doctors:", error);
        });
    },
  
    createtreatment() {
      axios.put(`/api/room/${this.$route.params.id}`,this.rooms).then((res) => {
        this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });

      }).catch((el)=>{
        console.log(el.response.data.errors.name)
     this.error = el.response.data.errors
    })
    },
    closeSuccessModal() {
      this.isSuccessModalOpen = false;
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
    goBack() {
      this.$router.go(-1);
    },
    deletevent(event) {
      console.log(event);

      axios
        .delete(`/api/slot/${this.event_id}`)
        .then((res) => {
          this.update()
          this.visible = false
        });
   
      setTimeout(() => {
        
          (this.event_title = null),
          (this.loading = false);
      }, 700);
    },

    updateevent() {
      
      axios
        .put(`/api/slot/${this.event_id}`, {
          
          start_event:this.start_event,
          end_event:this.end_event,
          from: this.time_start,
          
          to: this.time_end,
          room_id:this.$route.params.id
         
        })
        .then((res) => {
          this.update()
          this.visible = false
        });
     
      setTimeout(() => {
        
       
          (this.event_title = null),
          (this.event_id = null),
          (this.loading = false);
      }, 700);
    },
     createvent() {
      this.loading = true;
      axios
        .post("/api/slot", {
          title: this.event_title,
          end_event:this.end_event,
          start_event:this.start_event,
          date: this.start_event,
          from: this.time_start,
          to: this.time_end,
          room_id:this.$route.params.id
        })
        .then((res) => {
          this.slot_id=res.data.data.id
          this.visible = false
          if (res.status != 200) {
            this.valid = true;
          }
          this.update();
        });
     
      setTimeout(() => {
        
          (this.event_title = null),
          (this.start_event = null),
          (this.end_event = null),
          (this.create_visible = false),
          (this.loading = false);
      }, 2000);
    },
    update() {
      axios.get(`/api/room/${this.$route.params.id}`).then((res) => {
        console.log(res.data.data);
        this.rooms.name=res.data.data.name
            this.rooms.capacity=res.data.data.capacity
            this.rooms.type=res.data.data.type
            this.rooms.admin_id=res.data.data.admin_id 
            this.rooms.type_tow=res.data.data.type_tow 
            this.opts.events = res.data.data.slots.map(event => ({
            title: event.start_event+"T"+event.to,
            start: event.start_event+"T"+event.from,
            end: event.end_event+"T"+event.to,
            id: event.id,
            from:event.from
          }));
       
       
        

       
      });
    },
    getslotid(){
      axios
        .get(`/api/slot/${this.event_id}`)
        .then((res) => {
          this.time_start=res.data.data.from
          this.time_end=res.data.data.to
         
        })
        .catch((error) => {
          console.error("Error retrieving doctors:", error);
        });

    },

    refreshEvents() {
      this.$refs.calendar.$emit("refetch-events");
    },
  },



  
  mounted() {
  
    this.getAllDoctor()
    if (localStorage.appLang == "en") {
      console.log("ascasc");
    } else {
      this.opts.locale = arLocale;
    }
    console.log(localStorage.appLang);
   
    console.log(this.opts);
   

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

<style scoped>
.grid::-webkit-scrollbar {
  display: none !important;
}
/* Add custom styles for the name input field */
.name-input {
  height: 70vh;
  margin: auto !important;
   overflow-y: scroll;
  width: 100%;
  position: relative;
  background-color: #e7e7e7;
  padding: 10px;
  margin-bottom: 15px !important;
  border-radius: 10px;
}
.name-input::-webkit-scrollbar {
  display: none;
}
#pv_id_1{
  text-align: center;
}
/* Hide scrollbar for IE, Edge and Firefox */
.name-input {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.name-input {
  width: 606px;
}



.seed {
  width: 600px;

  margin: auto !important;
  background-color: #135c65;
  display: block;
  color: white;
 

 
  /* Set the width to 606px */
}

.custom-select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background-color: #f8f8f8;
  color: #333;
  appearance: none;
  /* Remove default arrow in some browsers */
  -webkit-appearance: none;
  /* Remove default arrow in Chrome and Safari */
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}



.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
  /* Adjust margin as needed */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  align-items: center;
  color: #ff0000;
  /* Red color for errors */
  margin-top: 5px;
  font-size: 0.9em;
}

.error-icon {
  margin-right: 5px;
  /* Add styles for your error icon */
}

@media (max-width: 768px) {

  .name-input,
  .custom-select,
  .error-message {
    width: 100%;
    /* Full width on smaller screens */
    margin-bottom: 15px;
  }

  .v-btn {
    width: 100%;
    /* Full width button */
    padding: 12px;
    /* Larger touch target */
  }

  .error-message {
    font-size: 0.8em;
    /* Adjust font size */
  }
}
.cal {
  width: 100%;
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 8px;
  border: 2px solid rgb(130, 130, 168);
}

/* Add additional CSS for animation or other styling as needed */

/* Add any other custom styles here */
</style>
