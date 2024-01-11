<template>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <div class="paragraph">
        <h2>{{ $t("addTherapeutic") }}</h2>
        <p>{{ $t("listaddTherapeutic") }}</p>
      </div>
      <div class="search-section">
        <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input" />
        <v-icon color="success" size="40" @click="performSearch()" class="icon-border">mdi-magnify</v-icon>
      </div>

      <div class="add-data">
        <v-col cols="12" sm="6" md="4" class="create-user-link">
          <router-link :to="{ name: 'Therapeutic' }">
            <v-icon color="success" size="40" class="icon-border">mdi-plus</v-icon>
          </router-link>
          <p>{{ $t("addTherapeutic") }}</p>
        </v-col>
      </div>
    </div>
    <div class="contant" v-for="(treatment, index) in treatments" :kay="index">
      <div class="fist-div">
        <div>
          <h5>{{ treatment.title }}</h5>
          <p>{{ $t("ProgramType") }} :{{ treatment.program_type.title }}</p>
          <p>{{ $t("SystemProgram") }} : {{ treatment.program_system.title }}</p>

          <p>{{ $t("SessionType") }} : {{ treatment.session_types.title }}</p>
          <p> {{ $t("AppointmentType") }} : {{ treatment.appointment.title }} </p>
          <p>{{ $t("Typetreatment") }} : {{ treatment.treatment_type.title }}</p>
          <hr>
          <div class="app-dev">
            <div class="rigte">
              {{ $t("doctord") }} {{ treatment.user.title }}
              <h6>
                {{ $t("price") }} {{ treatment.price }} {{ $t("pound") }}
              </h6>
              <p> {{ $t("today") }} - {{ treatment.dayName }}</p>
            </div>
            <div class="left">
              <v-row class="create-user-link" no-gutters>
                <v-col cols="auto" class="d-flex align-center">
                  <router-link :to="{ name: 'EditTreatment', params: { id: treatment.id } }">
                    <v-icon color="success" size="40">mdi-pencil</v-icon>
                  </router-link>
                </v-col>
                <v-col cols="auto" class="d-flex align-center">
                  <span>{{ $t("edit") }}</span>
                </v-col>
                <v-col cols="auto" class="d-flex align-center">
                  <v-icon color="error" size="40" @click="deleteOneTreatment(treatment.id)">mdi-delete</v-icon>
                </v-col>
                <v-col cols="auto" class="d-flex align-center">
                  <span>{{ $t("delete") }}</span>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Rest of your component -->

  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
export default {
  props: {
    treatment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formatDayInArabic() {
      if (this.treatment && this.treatments.created_at) {
        const date = new Date(this.treatments.created_at);
        const options = { weekday: 'long' };
        return new Intl.DateTimeFormat('ar-EG', options).format(date);
      } else {
        return 'N/A'; // Provide a default value or handle the case where data is not available
      }
    },
  },
  data() {
    return {

      dayName: "",
      searchQuery: "",
      createdAt: "",
      editData: false,
      treatments: [],
      oneTreatment: [],
      // other data properties
    };
  },
  methods: {
    performSearch() {
      // Implement your search logic here
      console.log("Searching for:", this.searchQuery);
    },
    getTreatments() {
      axios.get("api/treatments").then((response) => {
        this.treatments = response.data.treatments.map(treatment => {
          const date = new Date(treatment.created_at);
          const options = { weekday: 'long' }; // 'long' will return the full day name
          treatment.dayName = new Intl.DateTimeFormat('ar', options).format(date);
          return treatment;

        });
      });
    },
    getOneTreatment(id) {
      axios.get(`api/treatments/${id}`).then((response) => {
        this.oneTreatment = response.data.oneTreatment;
        console.log(this.oneTreatment);


      });

    },
   deleteOneTreatment(id) {
      axios.delete(`api/treatments/${id}`).then((response) => {
        console.log(response);
        Swal.fire(
          'تم الحذف بنجاح!',
          'Your treatment has been deleted.',
          'success'
        );

        // Find the index of the treatment in the treatments array
        const index = this.treatments.findIndex(treatment => treatment.id === id);

        // Remove the treatment from the array if it exists
        if (index !== -1) {
          this.treatments.splice(index, 1);
        }

      }).catch(error => {
        // Handle any errors here
        console.error("There was an error deleting the treatment: ", error);
        Swal.fire(
          'Error!',
          'There was a problem deleting your treatment.',
          'error'
        );
      });
    },




    openAddDataModal() {
      // Logic to open a modal or form to add data
      console.log("Opening add data modal");
    },
    openEditDataForm() {
      this.editData = true;
    }
  },

  mounted() {
    this.getTreatments();
    this.getOneTreatment();
  },


};
</script>
<style scoped>
.container {
  /* max-width: 1000px; */
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 25px;
  padding: 10px;
  border-color: #000;
}

.search-input {
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 20px;
  flex-grow: 1;
  /* Make the input expand to fill the space */

  font-size: 16px;
  width: 500px;
  border-color: #000;
}

.search-button {
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  color: #555;
  /* Adjust the color as needed */
  display: flex;
  align-items: center;

}

.search-button:hover {
  color: #ffffff;
  /* Change color on hover for visual feedback */
}

.material-icons {
  font-size: 24px;
}

/* Optional: Hide the default clear button in some browsers */
.search-input::-ms-clear,
.search-input::-webkit-search-cancel-button {
  display: none;
}

.paragraph p {
  color: #29ccff;
}

.contant {
  display: flex;
  margin-top: 15px;
  background-color: #f8f8f8;
  height: 410px;
}

.contant h6 {
  font-size: 22px;
  color: #148a98;
  padding: 10px;
}

.contant p {
  color: #000;
  font-size: 20px;
  padding: 10px;
}

h5 {
  padding: 10px;
  color: #148a98;
}

.app-dev {
  display: flex;
  justify-content: space-between;
  /* Align children at the start and end */
  /* Align children vertically */
  /* Space between children */
  /* Padding around the container */
}

.app-dev .left {
  margin: 0cm 20cm 0cm 0cm;
  margin-bottom: 10px;
  color: #148a98;
}

.app-dev .left p {

  color: #148a98;
}

@media only screen and (max-width: 600px) {
  .app-dev {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .header,
  .add-data,
  .search-section {
    flex-direction: column;
  }
}

@media only screen and (min-width: 601px) {
  .search-input {
    width: auto;
    /* Adjust as necessary */
  }
}

@media only screen and (min-width: 600px) {
  .search-input {
    width: 80%;
    /* Adjust width for larger screens */
  }
}
</style>
