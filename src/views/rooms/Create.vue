<template>
  <div>
    <!-- ... existing code ... -->
    <div>
      <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" @click="roompage()">{{ $t("room") }}</p>
    </div>

    <v-form @submit.prevent="createRoom">
      <!-- ... existing code ... -->

      <div class="name-input">
      
        <div class="py-4">      
          <InputText style="margin: auto ; text-align: center;background-color:#e7e7e7; border: none; border-bottom: 2px solid black; "  :placeholder='$t("numberroom")'  class="w-full "  type="number" v-model="formData.title"  />
        </div>
       

        <div class="card py-4 flex justify-content-center">
           <Dropdown  id="pv_id_1" style="direction: ltr !important;" v-model="formData.session"  option-value="id" :options="sessionTypes" optionLabel="title" :placeholder='$t("typesessaion")' class="w-full [&>div>div>span]:bg-black md:w-14rem " />
        </div>
        <div class="card py-4 flex justify-content-center">
           <Dropdown id="pv_id_1" style="direction: ltr !important;" v-model="formData.treatment_id" option-value="id" :options="treatmentTypes" optionLabel="title" :placeholder='$t("Typetreatment")' class="w-full md:w-14rem" />
        </div>
        <div class="card py-4 flex justify-content-center">
           <Dropdown id="pv_id_1" style="direction: ltr !important;" v-model="formData.user_id" option-value="id" :options="doctors" optionLabel="name" :placeholder='$t("roomdoctor")' class="w-full md:w-14rem" />
        </div>
        <div class="card py-4 flex justify-content-center">
           <Dropdown id="pv_id_1" style="direction: ltr !important;" v-model="formData.room_type_id" option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("typeroom")' class="w-full md:w-14rem" />
        </div> 
        <div class="py-4">      
          <InputText style="margin: auto ; text-align: center;background-color:#e7e7e7; border: none; border-bottom: 2px solid black; " class="w-full "  type="number" v-model="formData.capacity"  />
        </div>
      
      </div>
      <v-btn type="submit" class="mt-5  seed m-auto" style="width: 606px;">
        {{ $t("submit") }}
      </v-btn>
    </v-form>

    <!-- ... existing code ... -->
  </div>
</template>

<script>
import axios from "axios";
import Dropdown from 'primevue/dropdown';

import InputText from 'primevue/inputtext';

export default {
  components:{Dropdown,InputText},
  data() {
    return {
      // ... existing data properties ...
      selectedCity: null,
           
      selectedValue: "",
      sessionTypes: [],
      treatmentTypes: [],
      doctors: [],
      roomType: [  ],
      formData: {
        title: "",
        capacity: 15,
        room_type_id: "",
        session: "",
        user_id: "",
        treatment_id: ""

      }
    };
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    },
  },
  methods: {
    // ... existing methods ...
    arr (){
      return this.roomType =[
            
                { name:this.$t('typeroom2') , value:2 },
                { name:this.$t('typeroom1') , value:1 },
               
            ]
    },


    getAllDoctor() {
      axios
        .get("api/all/doctors")
        .then((response) => {
          this.doctors = response.data.doctors;
          console.log(this.doctors);
        })
        .catch((error) => {
          console.error("Error retrieving doctors:", error);
        });
    },
    getTypesesstion() {
      axios
        .get("api/session-types")
        .then((response) => {
          this.sessionTypes = response.data.sessionTypes;
          console.log(this.sessionTypes);
        })
        .catch((error) => {
          console.error("Error retrieving doctors:", error);
        });
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
    roompage(){
      this.$router.push({ name: 'Rooms' });
    },
    createRoom() {
      const DataSend = {
        title: this.formData.title,
        user_id: this.formData.user_id,
        capacity: this.formData.capacity,
        sessation_id: this.formData.session,
        room_type_id: this.formData.room_type_id,
        treatment_id: this.formData.treatment_id,

      };
      axios
        .post("/api/store_room", DataSend)
        .then((responseData) => {
          
          console.log("this add data is sussec:", responseData);
          this.$router.push({ name: 'Rooms' });
        })
        .catch((error) => {
          console.error("Error seeding data:", error);
          // Optionally, show an error message or perform other error-handling actions
        });
    }

  },
  mounted() {
    this.getTypesesstion();
    this.getAllDoctor();
    this.getTreatmentTypes();
  },
  // ... existing code ...
};
</script>

<style scoped>
/* Add custom styles for the name input field */
.name-input {
  width: 100%;
  position: relative;
  background-color: #e7e7e7;
  padding: 1cm;
  margin: auto;
  border-radius: 10px;
}

.name-input {
  margin-top: 2%;
  width: 606px;
}



#input-1{
  text-align: center !important;
  background-color:#E4E4E4 !important;
}
#pv_id_1{
  border: none;
  text-align: center;
  background-color:#E7E7E7 !important;
  border-bottom: 2px solid black;
  border-radius: 0 ;
 font-size: 20px;
 padding-top: 3%;
}
#pv_id_1:focus {
  border: none !important;

}
.p-dropdown .p-placeholder {
  color: red !important; /* Set the desired color */
}
 span{
  color: red !important;
}
.p-dropdown-label .p-inputtext .p-placeholder{
  color: red !important;
}
.seed {
  background-color: #135c65;
  display: block;
  color: white;
  
  width: 606px;
  width: 500px;
  /* Set the width to 606px */
}


.number-input {
  width: 500px;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
/* Add any other custom styles here */
</style>
