<template>
    <div>
      <!-- ... existing code ... -->
      <div>
        
      </div>
  
      <v-form @submit.prevent="createRoom">
        <!-- ... existing code ... -->
  
        <div class="name-input">
        
          <div class="py-4">      
            <InputText style="margin: auto ; text-align: center;background-color:#e7e7e7; border: none; border-bottom: 2px solid black; "  :placeholder='$t("numberroom")'  class="w-full "  type="number" v-model="formData.title"  />
          </div>
         
  
          <div class="card py-4 flex justify-content-center">
             <Dropdown id="pv_id_1" style="direction: ltr !important;" v-model="formData.session"  option-value="id" :options="sessionTypes" optionLabel="title" :placeholder='$t("typesessaion")' class="w-full md:w-14rem" />
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

export default {
    data() {
        return {
            // ... existing data properties ...
            rooms: [],
            selectedValue: "",
            sessionTypes: [],
            treatmentTypes: [],
            doctors: [],
            roomType: "",
            formData: {
                title: "",
                capacity: "",
                room_type_id: "",
                session: "",
                user_id: "",
                treatmentTypes: ""

            }
        };
    },
    methods: {
        // ... existing methods ...

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
        getoneRoom(id) {
            axios.get(`api/get/room/${id}`)
                .then((res) => {
                    this.formData.title = res.data.rooms.title,

                        this.formData.user_id = res.data.rooms.user,
                        console.log(res.date.rooms.user);
                        this.formData.treatmentTypes = res.data.rooms.treatment_type,
                        this.formData.capacity = res.data.rooms.capacity,
                        console.log("ddd", this.rooms)

                })
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
    background-color: #f8f8f8;
    padding: 1cm;
}

.name-input {
    width: 606px;
}

.name-input input {
    width: 606px;
    border: none;
    border-bottom: 1px solid #135c65;
    /* Border color for bottom line */
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

/* Add any other custom styles here */
</style>
  