<template>
  
    <div>
      <div>
        <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" >{{ $t("add_sp") }}</p>
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
        <v-form class="p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4" ref="myForm" @submit.prevent="seedData">
          <!-- ... existing code ... -->
            
               
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('ProgramName') }}</label>
                    <Dropdown   required id="pv_id_1" style="direction: ltr !important;" v-model="student.program_id" @update:model-value="getprograme"   option-value="id" filter :options="programes" optionLabel="name" :placeholder='$t("ProgramName")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.program_id">{{ error.program_id[0] }}</div>
                </div> 
                <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('child_name') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.student_id"  @update:model-value=" getAllDoctor"   option-value="id" filter :options="child" optionLabel="name" :placeholder='$t("child_name")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.student_id">{{ error.student_id[0] }}</div>
                </div> 
            

               
                <div v-if="student.program_id && maxcapsity>0 && setiontype != 1 " class="flex flex-column gap-2">
                    <label for="username">{{ $t('Typetreatment') }}-</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="student.Type"  option-value="id" filter :options="treaments" optionLabel="name" :placeholder='$t("Typetreatment")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.details">{{ error.details[0] }}</div>
                </div> 

                <div v-if="student.program_id && maxcapsity>0 && setiontype != 1 " class="flex flex-column gap-2">
                    <label for="username">{{ $t('Sn') }} ({{ maxcapsity }})</label>
                    <div class="flex">
                        <InputNumber :max="maxcapsity" :min="1" required class="bg-[#f7f5f5] w-[90%]" v-model="student.sessions_number" :placeholder='$t("Sn")' />
                        <Button   @click="addarray"  class="create m-auto s " icon="pi pi-plus" ></Button>
                    </div>

                    <div class="mt-1 mb-5 text-red-500" v-if="error?.details">{{ error.details[0] }}</div>
                </div>

              
                <!-- <div class="flex flex-column gap-2">
                    <label for="username">{{ $t('roomstable') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="treatments.session_type"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("roomstable")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.session_type">{{ error.session_type[0] }}</div>
                </div> -->
                <!-- <div class="flex flex-column gap-2 w-full">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  
                  <Button  v-if="buttomaddcal" @click="createtreatment" :loading="timeshow" class="create m-auto w-full  lg:w-[50%] " icon="pi pi-plus" :label='$t("Add_appointment")'></Button>
                  <small id="username-help"></small>
                </div> -->
                
        
        </v-form>
        <!-- <Button   @click="deletearray"  :label='$t("submit")' class="delete m-auto s "  ></Button> -->

       <div class="p-[2%] bg-[#FDFDFD] grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="px-[2%] py-1 flex">
            <ol>
      <li v-for="(t,index ) in capasity" :key="index">

         {{ index+1 }} - {{t.name }} - {{ $t("Sn") }} - {{ t.sessions_number }}
      </li>
    </ol>
        </div>
        <Button v-if="capasity !=''"  @click="deletearray"  class="delete m-auto s " icon="pi pi-pencil" ></Button>

       
       </div>
        <Toast/>
        <!-- ... existing code ... -->
        <div class="px-4" >
      
      <FullCalendar
         
        :options="opts"
        
        @change="refreshEvents()"
        ref="fullCalendar"
        :dayRender="highlightSelectedDay"
      />
      <div class="mt-1 mb-5 text-red-500" v-if="error?.time_slots">{{ error.time_slots[0] }}</div>
      <div class="card flex justify-content-center">

        
      </div>
      <div class="flex flex-column gap-2 w-full">
         
                  
                  <Button  v-if="buttomaddcal" @click="createtreatment"  class="create m-auto w-full  lg:w-[50%] "  :label='$t("submit")'></Button>
                  <small id="username-help"></small>
                </div>
    </div>
      </div>
  
  
    </v-card>

    <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" :header='$t("submit")' :modal="true">
      <div class="flex flex-column gap-2">
                  <label for="username">{{ $t('doctor') }}</label>
                  <Dropdown  @update:model-value="pushtimeslot"  required id="pv_id_1" style="direction: ltr !important;" v-model="admin_id"  option-value="id" filter :options="doctors" optionLabel="name" :placeholder='$t("doctor")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.admin_id">{{ error.admin_id[0] }}</div>
                    <Button   @click="addtimedoctor"  class="create m-auto w-full  lg:w-[50%] "  :label='$t("submit")'></Button>

              </div> 
              <Button @click="cansel" style="position: absolute; top:15px ;right: 15px;" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" />
        </Dialog>

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
        setiontype:"",
        programes:{},
        child:{},
        rooms:{},
        error: {},
        doctors:{},
        isSubmitting: false,
        programe_type:{},
        toast:useToast(),
        room_id:'',
        slot_id:"",
        student:{},
        capasityboj:{},
        capasity:[],
        maxcapsity:"",
        treaments:{},
        time_sloteobj:{},
        time_slots:[],
        time_slotename:[],
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
        refmaxcapsity:"",
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
            axios
              .post(`/api/calender/${event.event.id}/update`, {
                title: event.event.title,
                start: moment(event.event.start).format("00:00:00 YYYY-MM-d"),
                end: moment(event.event.end).format("00:00:00 YYYY-MM-d"),
              })
              .then((res) => {
                console.log(res.data.k);
              });
          },
  
          eventClick: function (event) {
            this.event_id = event.event.id;
            this.event_title = event.event.title;
            this.modal_text = this.$t("update_event");
            this.creat_event = false;
            this.updat_event = true;
            this.handleEventClick(event)
            this.time_slotename.push(event.event.title)
            console.log( this.time_slotename)
            this.start_event = moment(event.event.start).format("YYYY-MM-DD");
            this.end_event = moment(event.event.end).format("YYYY-MM-DD");
            console.log(this.start_event);
          }.bind(this),
  
          select: function (event) {
            console.log(event);
            this.event_title = "";
            this.modal_text = this.$t("create_event");
            this.creat_event = true;
            this.updat_event = false;
            this.visible = true;
  
            console.log(event);
            this.start_event = moment(event.start).format("YYYY-MM-DD");
            this.end_event = moment(event.end).format("YYYY-MM-DD");
            console.log(event.backgroundColor);
          }.bind(this),
        },
  
        // Add other validation rules for the title field
      };
  
    },
  
    methods: {

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
      handleEventClick(info) {
        this.deleteDialog = !(this.deleteDialog)
        console.log(info)
      // Get the clicked event
      const clickedEvent = info.event;
      console.log(clickedEvent)
      // Change the color of the clicked event
      clickedEvent.setProp('backgroundColor', 'green');
       clickedEvent.setProp('visibility', 'hidden');
    },
      // ... existing methods ...
      Therapeutic (){
        this.$router.push({ name: 'student-programe' });
      },

      programetype (){
        return this.roomType =[
              
                  { name:this.$t('diurnal') , value:0 },
                  { name:this.$t('Clinics') , value:1 },
                  { name:this.$t('house') , value:2 },
                 
              ]
      },
      deletearray(){
        this.capasity.length=[]
        this.maxcapsity=this.refmaxcapsity
        
      },

      addarray(){
        axios.get(`/api/treatment/${this.student.Type}`).then((res) => {
               
          this.capasityboj={
            treatment_id: this.student.Type,
            sessions_number: this.student.sessions_number,
            name:res.data.data.name
       
            
        }
        this.capasity.push(this.capasityboj);
       this.maxcapsity=  this.maxcapsity - this.student.sessions_number
       this.student.sessions_number=""
             });
             
        
        console.log(this.capasity)
      },
      getprograme(e){
      
                this.capasity=[]
                this.student.sessions_number=''
            axios.get(`/api/program/${this.student.program_id}`).then((res) => {
                this.refmaxcapsity=res.data.data.individual_sessions
                this.maxcapsity=res.data.data.individual_sessions
                this.setiontype=res.data.data.session_type
                

             });
             axios.get(`api/users/filter/${e}`).then((res) => {
              this.doctors = res.data.data;

             });
             axios.get(`api/slot/filter/${e}`).then((res) => {
              this.opts.events = res.data.data.map(event => ({
              title: event.start_event+"T"+event.to,
              start: event.start_event+"T"+event.from,
              end: event.end_event+"T"+event.to,
              id: event.id,
              from:event.from
          }));
         

             });
     
      },
      getalltreatement(){
        axios.get("api/treatment/all")
          .then((response) => {
            this.treaments = response.data.data;
            console.log(this.doctors);
          })
          .catch((error) => {
            console.error("Error retrieving doctors:", error);
          });
      },
      getallchild(){
        axios
          .get("api/child")
          .then((response) => {
            this.child = response.data.children;
            console.log(this.doctors);
          })
          .catch((error) => {
            console.error("Error retrieving doctors:", error);
          });
      },
      pushtimeslot(id){
        console.log(id)
        this.time_sloteobj={
            time_slot_id:this.event_id,
            doctor_id:id
        }
      
    
      },
      addtimedoctor(){
        console.log(this.time_sloteobj)
        
        this.time_slots.push( this.time_sloteobj)
        this.deleteDialog=!(this.deleteDialog)
      },
    cansel(){
      this.pushtimeslot()
      this.addtimedoctor()

    },
      getallprogrames(){
        axios
          .get("api/program")
          .then((response) => {
            this.programes = response.data.data;
            console.log(this.doctors);
          })
          .catch((error) => {
            console.error("Error retrieving doctors:", error);
          });

      },

   

    
      createtreatment() {
      
        axios.post("/api/student-program",{
            program_id:this.student.program_id,
            student_id:this.student.student_id,
            details:this.capasity,
            time_slots:this.time_slots

        }).then((res) => {    
          this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
  
        }).catch((el)=>{
          this.timeshow=!(this.timeshow)
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
          .delete(`/api/calender/${this.event_id}/delete`)
          .then((res) => {});
        this.update();
        setTimeout(() => {
          (this.visible = false),
            (this.event_title = null),
            (this.loading = false);
        }, 700);
      },

      updateevent() {
        axios
          .post(`/api/calender/${this.event_id}/update`, {
            title: this.event_title,
            start: moment(this.start_event).format(" YYYY-MM-d"),
            end: moment(this.end_event).format(" YYYY-MM-d"),
          })
          .then((res) => {});
       
        setTimeout(() => {
          
          (this.visible = false),
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
            date: this.start_event,
            from: this.time_start,
            to: this.time_end,
            room_id:this.room_id
          })
          .then((res) => {
            this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Success', life: 3000 });
            this.visible = false
            if (res.status != 200) {
              this.valid = true;
            }
          }).catch((el)=>{
         
       this.error = el.response.data.errors
      });
       
        setTimeout(() => {
          this.update();
            (this.event_title = null),
            (this.start_event = null),
            (this.end_event = null),
            (this.create_visible = false),
            (this.loading = false);
        }, 2000);
      },
      update() {
        axios.get(`/api/slot/student-program`).then((res) => {
          console.log(res.data.data);
  
          this.opts.events = res.data.data.map(event => ({
            title: event.start_event+"T"+event.to,
            start: event.start_event+"T"+event.from,
            end: event.end_event+"T"+event.to,
            id: event.id,
            from:event.from
          }));
         
         
          
  
         
        });
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
  