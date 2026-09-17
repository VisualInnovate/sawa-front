<template>
  <div class="container">
    <Treat></Treat>
    <!-- Header Section -->
    <Dialog v-model:visible="isEditing" modal :style="{ width: '600px', maxWidth: '95vw' }">

      <div class="sawa-card">
        <div class="sawa-card-title">
          <h2 class="mb-1">{{ $t("editTypetreatment") }}</h2>
        </div>
        <div class="sawa-card-text">
          <InputText v-model="editFormData.title" required :placeholder="$t('title')" fluid />
          <!-- Add other form fields as needed -->
        </div>
        <div class="sawa-card-actions">
          <Button @click="updateItem(editFormData.id)" class="submit-button">
            {{ $t("edit") }}
          </Button>
          <Button @click="closeEditForm" class="cancel-button">
            {{ $t("Cancel") }}
          </Button>
        </div>
      </div>
    </Dialog>
    <Dialog v-model:visible="showDialog" modal :style="{ width: '600px', maxWidth: '95vw' }">
      <div class="sawa-card form-all" style="border-radius: 15px; ">
        <div class="sawa-card-title">
          <h2 class="mb-1">{{ $t("addtype") }}</h2>
        </div>
        <div class="sawa-card-text">
          <InputText v-model="formData.title" required :placeholder="$t('title')" fluid />
          <!-- Add other form fields as needed -->
        </div>
        <div class="sawa-card-actions">
          <Button @click="saveItem" class="submit-button">
            {{ $t("submit") }}
          </Button>
          <Button @click="closeForm">
            {{ $t("Cancel") }}
          </Button>
        </div>
      </div>
    </Dialog>
    <div class="header">

      <div class="paragraph">
        <h2>{{ $t("addtype") }}</h2>
        <p>{{ $t("addtypelist") }}</p>
      </div>
      <div class="search-section">
        <input type="text" v-model="searchQuery" :placeholder="$t('search')" class="search-input" />
        <Button icon="pi pi-search" rounded variant="outlined" severity="success" @click="performSearch()" />
      </div>

      <div class="add-data">
        <div cols="12" sm="6" md="4" class="flex-1 min-w-0 create-user-link" @click="openForm">
          <i class="pi pi-plus" aria-hidden="true"></i>
          <p>{{ $t("addtype") }}</p>
        </div>
      </div>
    </div>
    <div class="content" v-for="(treatment, index) in roomssearchQuery" :key="index">
      <div class="first-div">
        <i class="fas fa-user"></i> <!-- This is the Font Awesome user icon -->
        <h5>{{ $t("nameaddtypelist") }} :{{ treatment.title }}</h5>

      </div>


      <div class="third-div">
        <!-- Content for the third div -->
        <Button icon="pi pi-pencil" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="editData(treatment.id)" />
        <Button icon="pi pi-trash" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="deleteItem(treatment.id)" />
      </div>

    </div>
    <div class="w-full">
      <!-- Your data display section -->

      <!-- Pagination Controls -->
      <div class="flex flex-wrap gap-4 w-full" justify="center">
        <Paginator :rows="1" :totalRecords="Number(5)" :first="page - 1" @page="page = $event.page + 1" />
      </div>
    </div>


    <!-- Rest of your component -->

  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
import Treat from '../frontend/components/Treat.vue'
import Pagination from '../../components/Pagination.vue'
export default {
  components: {
    Pagination,Treat
  },
  data() {

    return {
      currentPage: 5,
      currentPage: 1,
      pageSize: 10,
      items: [],
      isEditing: false, // Changed from editDialog
      editFormData: {
        title: "",
        // Add other form fields as needed
      },

      searchQuery: "",
      rooms: [],
      sessionTypes: [],
      showDialog: false,
      showModal: false,
      id: "",
      formData:
      {
        title: "",

      }
      // other data properties
    };
  },
  computed:
  {
    roomss() {
      return ` ${this.this.sessionTypes}`;
    },
    roomssearchQuery() {
      return this.sessionTypes.filter((st) => st.title.match(this.searchQuery));
    },
  },
  methods: {
    editData(id) {
      this.isEditing = true;

      axios.get(`api/treatment-types/${id}`)
        .then((response) => {
          // Assuming the response data has the structure { program_type: { title: '...' } }
          this.editFormData = response.data.treatmentTypes;

          this.editFormData = response.data.treatmentTypes;
          this.isEditing = true;
          console.log(this.editFormData.title);

        })
        .catch((error) => {
          console.error('Error fetching session type:', error);
          // Handle the error (e.g., show an error message to the user)
        });
    },

    deleteItem(id) {
      axios.delete(`/api/treatment-types/${id}`, this.formData)
        .then(response => {
          console.log('Item deleted successfully:', response.data);
          Swal.fire(
            this.$t('deleted_successfully'),
            '',
            'success'
          );

          // Find the index of the treatment in the treatments array
          const index = this.sessionTypes.findIndex(sessionType => sessionType.id === id);

          // Remove the treatment from the array if it exists
          if (index !== -1) {
            this.sessionTypes.splice(index, 1);
          }

        }).catch(error => {
          // Handle any errors here
          console.error("There was an error deleting the treatment: ", error);
          Swal.fire(
            this.$t('error'),
            this.$t('request_failed_retry'),
            'error'
          );
        });
    },
    getOneSession(id) {
      axios.get(`api/treatment-types/${id}`)
        .then((response) => {
          // Assuming the response data has the structure { program_type: { title: '...' } }
          this.formData.title = response.data.program_type.title;
          this.id = response.data.program_type.id;

        })
        .catch((error) => {
          console.error('Error fetching session type:', error);
          // Handle the error (e.g., show an error message to the user)
        });

    },
    closeEditForm() {
      this.isEditing = false;
    },
    getAllRoom() {
      axios.get(`api/treatment-types`).then((response) => {
        this.sessionTypes = response.data.treatmentTypes;
        this.items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
        console.log(this.sessionTypes);
      });
    },
    editItem(itemId) {
      // Assuming you have a route named 'EditRoom' that takes an 'id' parameter
      this.$router.push({ name: 'EditRoom', params: { id: itemId } });
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    openForm() {
      this.showDialog = true;
    },
    closeForm() {
      this.showDialog = false;
      // Reset form data when the dialog is closed
      this.formData = {
        title: "",
        // Reset other form fields as needed
      };
    },
    saveItem() {
      // Perform any necessary validation before saving

      // Make an API request to save the form data
      axios.post("/api/treatment-types", this.formData)
        .then((res) => {
          // Handle success, e.g., show a success message
          console.log("Item saved successfully");
          // Close the form dialog
          this.closeForm();
          // Refresh the program types list
          this.getprogramtype();
          // Reset validation errors on successful save
          this.validationErrors = {};
          // Optionally, show a success message to the user
          this.showAlert({
            type: "success",
            message: this.$t("successful"),
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 422) {
            // Handle validation errors
            this.validationErrors = error.response.data.errors;
          } else {
            // Handle other errors
            console.error('Error saving item:', error);
            // Optionally, show an error message to the user
            this.showAlert({
              type: "error",
              message: this.$t("request_failed_retry"),
            });
          }
        });
    },
     updateItem(id) {

      const updatedFields = {
        title: this.editFormData.title,
        // Add other fields as needed
      };

      axios
        .put(`/api/treatment-types/${id}`, updatedFields)
        .then((res) => {
          // Handle success, e.g., show a success message
          console.log("Item updated successfully");
          this.editdialog = false;
          // Close the edit form dialog

          // Refresh the program types list
          this.getAllRoom();
          this.isEditing = false;

        })
        .catch((error) => {
          // Log the specific error message from the response
          console.error("Error updating item:", error.response.data.message);

          // Log the entire response for further inspection
          console.log("Full response:", error.response);

          // Show a more specific error message to the user
          this.showAlert({
            type: "error",
            message: `Failed to update item. ${error.response.data.message}`,
          });
        });
    },
  },

  mounted() {
    const sessionId = this.$route.params.id; // Replace this with the actual session ID you want to fetch
    this.getOneSession(sessionId);
    this.getAllRoom();
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
  background-color: #7A7A7A;
  height: 200px;
  padding: 20px;

  margin-bottom: 20px;

}

.contant h6 {
  font-size: 22px;
  color: #148a98;
}

.contant p {
  color: #000;
  font-size: 20px;
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
  gap: 20px;
  /* Space between children */
  padding: 10px;
  /* Padding around the container */
}

.app-dev .left {
  margin: 0cm 20cm 0cm 0cm;
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

  .content {
    display: flex;
    justify-content: space-around;
    /* Evenly space out the divs */
    align-items: center;
    border: 15px solid #ffffff;
    /* A line below each treatment item */
    border-radius: 15px;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #d5d5d5;
  }

  .first-div,
  .second-div,
  .third-div {
    flex-basis: 30%;
    /* Each div takes approximately one-third of the width */
    text-align: center;
    /* Center the text inside each div */
  }

  .first-div {
    /* Specific styles for the first div */
  }

  .second-div {
    /* Specific styles for the second div */
  }

  .third-div {
    /* Specific styles for the third div */
  }

}

.form-adds h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 25px;
  text-align: center;
}

.submit-button {
  background-color: #148A98;
  /* Blue color */
  color: #fff;
  /* White text */
  font-weight: bold;
  margin: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
  margin-right: 8px;
  /* Add some spacing between buttons */

}



.cancel-button {
  color: #757575;
  /* Gray color */
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: 8px;
  /* Add some spacing between buttons */
}

.cancel-button {
  color: #fff;
  /* White text */
  background-color: #757575;
  /* Gray background color */
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #616161;
  /* Darker gray background on hover */
}

.form-adds {
  width: 1168px;
  height: 376px;

}

.form-all {
  border-radius: 2cm;
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1200px;
    /* or any other max-width you prefer */
  }
}

@media only screen and (max-width: 600px) {
  .form-adds {
    width: 100%;
    /* Full width on small screens */
  }
}

@media only screen and (min-width: 601px) {
  .form-adds {
    width: 80%;
    /* Adjust as needed for medium screens */
  }
}

@media only screen and (min-width: 1024px) {
  .form-adds {
    width: 600px;
    /* Fixed width for larger screens */
  }
}
</style>
