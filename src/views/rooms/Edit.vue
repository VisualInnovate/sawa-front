<template>
  <div>
    <!-- ... existing code ... -->
    <div>
      <p class="text-xl p-4 text-[#135C65] cursor-pointer font-bold" @click="roompage()">{{ $t("room") }}</p>
    </div>

    <v-form @submit.prevent="createRoom">
      <!-- ... existing code ... -->

      <div class="name-input shadow-md">
      
        <div class="py-4">      
          <InputText style="margin: auto ; text-align: center;background-color:#e7e7e7; border: none; border-bottom: 2px solid black; "  :placeholder='$t("numberroom")'  class="w-full "  type="number" v-model="formData.title"  />
        </div>
       

        <div class="card py-4 flex justify-content-center">
           <Dropdown id="pv_id_1" style="direction: ltr !important;" v-model="formData.sessation_id"  option-value="id" :options="sessionTypes" optionLabel="title" :placeholder='$t("typesessaion")' class="w-full md:w-14rem" />
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
      <v-btn @click="updateData()"  class="mt-5  seed m-auto" style="width: 606px;">
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
        sessation_id: "",
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
            { name:this.$t('typeroom1') , value:1 },
                { name:this.$t('typeroom2') , value:2 },
              
               
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
   
    updateData() {
            axios
                .post(`/api/update/room/${this.$route.params.id}`, this.formData)
                .then((response) => {
                    // Handle successful response
                    console.log("Data updated:", response.data);
                    this.isSuccessModalOpen = true;
                    this.$router.push({ name: 'Rooms' });

                    // Redirect to the 'all-treatments' route after successful seeding

                    // Optionally, you can update your component state or perform other actions here
                    // You might want to redirect the user or give a success message
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error updating data:", error);
                    // You might want to show an error message to the user
                });
        },
    getoneRoom(id) {
            axios.get(`api/get/room/${id}`)
                .then((res) => {
                  this.formData.capacity=res.data.rooms.capacity
                  this.formData.user_id=res.data.rooms.user.id
                  this.formData.room_type_id=res.data.rooms.room_type_id
                  this.formData.treatment_id=res.data.rooms.treatment_id
                  this.formData.title=res.data.rooms.title
                  this.formData.sessation_id=res.data.rooms.typesesation.id
                })
        },

  },
  mounted() {
    this.getTypesesstion();
    this.getAllDoctor();
    this.getTreatmentTypes();
    this.getoneRoom(this.$route.params.id);
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


.name-input label {
  display: block;
  /* Ensures the label takes the full width of the container */
  text-align: center;
  font-size: 20px;
  color: #0b0c0c;
  /* Text color for label */
  border-bottom: 1px solid #333;
  /* Border style and color */
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
.seed {
  background-color: #135c65;
  display: block;
  color: white;
  
  width: 606px;
  width: 500px;
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

.custom-select:hover {
  border-color: #666;
}

.custom-select:focus {
  outline: none;
  border-color: #135c65;
  box-shadow: 0 0 8px rgba(19, 92, 101, 0.5);
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
