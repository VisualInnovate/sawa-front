<template>
  <div>
    <div>
      <!-- Your existing template code here -->
    </div>
    <Message v-if="alert.show" :severity="alert.type === 'error' ? 'error' : 'success'" class="mb-3">{{ alert.message }}</Message>
    <div class="sawa-card">
      <confirm-dialog @confirmed="deleteItem" ref="confirmDialog" />
      <div class="sawa-card-title">
        <h2 class="mb-1">{{ $t("ProgramType") }}</h2>

        <div class="flex flex-wrap gap-4 w-full mb-3">
          <div class="flex-1 min-w-0">
            <InputText v-model="search" :placeholder="$t('search')" fluid />
          </div>
          <div class="flex-1 min-w-0">
            <Button icon="pi pi-plus" :label="$t('addProgramType')" @click="openForm" />
          </div>
          <div class="flex-1 min-w-0">
            <router-link :to="{ name: 'CreateUser' }">
              <i class="pi pi-plus" aria-hidden="true"></i>
            </router-link>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="showDialog" modal :style="{ width: '600px', maxWidth: '95vw' }">
        <div class="sawa-card form-all" style="border-radius: 15px; ">
          <div class="sawa-card-title">

            <h2 class="mb-1">{{ $t("addProgramType") }}</h2>
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
      <DataTable :value="programtype" :globalFilterFields="['title']"
        :filters="{ global: { value: search, matchMode: 'contains' } }" paginator :rows="10" stripedRows>
        <Column field="id" header="#" />
        <Column field="title" :header="$t('title')" />
        <Column :header="$t('actions')">
          <template #body="{ data }">
            <div class="table-actions">
              <Button icon="pi pi-eye" rounded variant="outlined" severity="secondary" v-tooltip.top="$t('view')" :aria-label="$t('view')" @click="showItem(data.id)" />
              <Button icon="pi pi-pencil" rounded variant="outlined" severity="info" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" @click="editItem(data.id)" />
              <Button icon="pi pi-trash" rounded variant="outlined" severity="danger" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" @click="detailsItem(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <template>
      <Dialog v-model:visible="dialog" modal :header="$t('confirmation')" :style="{ width: '400px', maxWidth: '95vw' }">
          <p class="m-0">{{ $t('remove_item') }}
            {{ showdata }}</p>
          <template #footer>
            <Button :label="$t('cancel')" severity="secondary" variant="text" @click="dialog = false" />
            <Button :label="$t('confirm')" severity="danger" @click="deleteItem(showdata)" />
          </template>
        </Dialog>
      <Dialog v-model:visible="editdialog" modal :header="$t('confirmation')" :style="{ width: '400px', maxWidth: '95vw' }">
          <p class="m-0">{{ $t('confirm_edit_item') }}
            {{ editdata }}</p>
          <template #footer>
            <Button :label="$t('cancel')" severity="secondary" variant="text" @click="editdialog = false" />
            <Button :label="$t('confirm')" @click="editItem(editdata)" />
          </template>
        </Dialog>
      <Dialog v-model:visible="readDate" modal :style="{ width: '600px', maxWidth: '95vw' }">

        <div class="sawa-card">
          <div class="sawa-card-title">
            <h2 class="mb-1">{{ $t("editProgramType") }}</h2>
          </div>
          <div class="sawa-card-text">
            <h2> {{ $t("title") }} : {{ editFormData.title }}</h2>
            <h3>{{ editFormData.created_at }}</h3>

            <!-- Add other form fields as needed -->
          </div>
          <div class="sawa-card-actions">
            <Button @click="updateItem(editFormData.id)" class="submit-button">
              {{ $t("update") }}
            </Button>
            <Button @click="closeEditFormedit" class="cancel-button">
              {{ $t("Cancel") }}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog v-model:visible="isEditing" modal :style="{ width: '600px', maxWidth: '95vw' }">

        <div class="sawa-card">
          <div class="sawa-card-title">
            <h2 class="mb-1">{{ $t("editProgramType") }}</h2>
          </div>
          <div class="sawa-card-text">
            <InputText v-model="editFormData.title" required :placeholder="$t('title')" fluid />
            <!-- Add other form fields as needed -->
          </div>
          <div class="sawa-card-actions">
            <Button @click="updateItem(editFormData.id)" class="submit-button">
              {{ $t("update") }}
            </Button>
            <Button @click="closeEditForm" class="cancel-button">
              {{ $t("Cancel") }}
            </Button>
          </div>
        </div>
      </Dialog>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
export default {
  components: {
    ConfirmDialog,
  },
  data() {
    return {
      search: "",
      dialog: false,
      showdata: "",
      itemDetails: {},
      successMessage: '',
      readDate: false,


      alert: {
        show: false,
        type: "success", // You can customize the alert color
        message: "",
      },
      title: "Confirmation",
      headers: [
        { key: "id", title: this.$t("index") },
        { key: "title", title: this.$t("title") },
      ],
      programtype: [],
      loading: true,
      showDialog: false,

      isEditing: false, // Changed from editDialog
      editFormData: {
        title: "",
        // Add other form fields as needed
      },
      formData: {
        title: "",
        // Add other form fields as needed
      },
    };
  },
  methods: {
    getprogramtype() {
      axios.get("/api/programtypes").then((res) => {
        this.programtype = res.data.programtype;
        this.loading = false;
      });
    },

    openForm() {
      this.showDialog = true;
    },
    closeEditFormedit() {
      this.readDate = false;
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
      // Then make an API request to save the form data
      axios
        .post("/api/programtypes", this.formData)
        .then((res) => {
          // Handle success, e.g., show a success message
          console.log("Item saved successfully");
          // Close the form dialog
          this.closeForm();
          this.setSuccessMessage(this.$t('deleted_successfully'));
          // Refresh the program types list
          this.getprogramtype();
        })
        .catch((error) => {
          // Handle error, e.g., show an error message
          console.error("Error saving item:", error);
        });
    },
    openDialog() {
      this.dialog = true;
    },

    confirm() {
      this.$emit("confirmed");
      this.dialog = false;
    },
    async deleteItem(id) {
      try {
        if (this.showdata) {
          this.showAlert({
            type: "warning", // Alert type can be "success", "info", "warning", "error"
            message: this.$t("successful"),
          });
          this.dialog = false;
        }

        // User confirmed the deletion
        await axios.delete(`/api/programtypes/${id}`);
        console.log("Item deleted successfully");

        // Show a success alert
        this.showAlert({
          type: "success",
          message: "Item deleted successfully",
        });

        this.getprogramtype();
      } catch (error) {
        // Handle error, e.g., show an error message
        this.showAlert({
          type: "error",
          message: `Error deleting item: ${error.message}`,
        });
        console.error("Error deleting item:", error);
      }
    },

    showAlert({ type, message }) {
      // Set the alert properties
      this.alert.type = type;
      this.alert.message = message;
      this.alert.show = true;
    },

    async detailsItem(id) {
      try {
        this.showdata = `${id}`;
        this.dialog = true;
        await axios.get(`/api/programtypes/${id}`);
        console.log(id);
      } catch (err) { }
    },

    async showItem(id) {

      try {
        // Fetch item details using the provided ID
        const response = await axios.get(`/api/programtypes/${id}`);

        // Set the item details and show the dialog
        this.editFormData = response.data.program_type;
        this.readDate = true;
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    },
    hideDialog() {
      // Close the dialog
      this.showDialog = false;
    },

    // ... other methods ...

    async editItem(id) {

      const response = await axios.get(`/api/programtypes/${id}`);
      console.log(response);

      this.editFormData = response.data.program_type;
      this.isEditing = true;



      // Check if the selectedItem is defined

    },
    updateItem(id) {
      // Perform any necessary validation before updating
      // Then make an API request to update the form data
      // Get the ID from editFormData

      // Create an object containing the fields to update
      const updatedFields = {
        title: this.editFormData.title,
        // Add other fields as needed
      };

      axios
        .put(`/api/programtypes/${id}`, updatedFields)
        .then((res) => {
          // Handle success, e.g., show a success message
          console.log("Item updated successfully");
          this.editdialog = false;
          // Close the edit form dialog

          // Refresh the program types list
          this.getprogramtype();
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
    closeEditForm() {
      // Reset edit form data when the dialog is closed
      this.editFormData = {
        id: null,
        title: "",
        // Reset other form fields as needed
      };

      // Close the edit form dialog
      this.isEditing = false; // Changed from editDialog
    },
    setSuccessMessage(message) {
      console.log('Setting success message:', message);
      this.successMessage = message;
      setTimeout(() => {
        console.log('Clearing success message');
        this.successMessage = '';
      }, 3000);
    }
  },
  computed: {
    header() {
      return (this.headers = [
        { key: "id", title: this.$t("index") },
        { key: "title", title: this.$t("title") },
      ]);
    },
  },
  mounted() {
    this.getprogramtype();
  },
};
</script>

<style scoped>
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

/* Add any custom styles here */
</style>
