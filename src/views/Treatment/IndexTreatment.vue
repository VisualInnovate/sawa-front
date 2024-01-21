<template>
  <!-- <div class="absolute h-full bg-black z-50 w-full text-center m-auto opacity-[25%]" :class="{ 'hidden': isActive }">
   <i class="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] pi pi-spin pi-spinner  " style="font-size: 3rem"></i>
  </div> -->
 <div class="container relative">
  

   <!-- Header Section -->
   <div class="grid grid-cols-1 gap-8 lg:grid-cols-3 shadow p-4">
     <div class="paragraph text-2xl">
       <h2>{{ $t("addTherapeutic") }}</h2>
       <p>{{ $t("listaddTherapeutic") }}</p>
     </div>
   <div class="relative ">
      <i class="pi pi-search absolute top-[20%] right-[5%] font-bold cursor-pointer"  @click="performSearch()"/>
      <InputText style="text-align: center;" class="lg:w-full" v-model="searchQuery" placeholder="Search" />
   </div>
    

     <div  @click="addtherapeutic()" class=" m-auto ">
  
        
      <div style=" margin: auto; border: 2px solid #135C65; " class="py-2 rounded-full w-[50%] h-[50%]">
 
<svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" width="23.391" height="26.316" viewBox="0 0 23.391 26.316">
 <path id="plus" d="M17.495,19.12V29.354a1.388,1.388,0,0,1-1.3,1.462,1.388,1.388,0,0,1-1.3-1.462V19.12H5.8a1.472,1.472,0,0,1,0-2.924h9.1V5.962A1.388,1.388,0,0,1,16.2,4.5a1.388,1.388,0,0,1,1.3,1.462V16.2h9.1a1.472,1.472,0,0,1,0,2.924Z" transform="translate(-4.5 -4.5)" fill="#148a98" fill-rule="evenodd"/>
</svg>

      </div>

         <p class="m-auto cursor-pointer text-xl w-full">{{ $t("addtype") }}</p>
   
     </div>
   </div>

<div style="height: 70vh; overflow-y: scroll; " class="over">
  <div   v-for="treat in treatments" class="shadow bg-slate-100 pt-[5%]  hover:bg-[#dbebf5] rounded-md py-5 my-2 bg-[#F8F8F8]">
    <div style="border-bottom: 1px solid black;" class="px-[1%]">
      <h2 class=" font-bold text-[#135C65]" >{{ $t("merge") }}</h2>
      <div class="flex py-1 ">
        <p class=" font-bold">{{ $t("Appointment_type") }} :</p>
        <p>{{ treat.appointment.title }}</p>
      </div>
      <div class="flex py-1 ">
        <p class=" font-bold">{{ $t("typesessaion") }} :</p>
        <p>{{ treat.session_types.title }}</p>
      </div>
      <div class="flex py-1">
        <p class=" font-bold">{{ $t("Typetreatment") }} :</p>
        <p>{{ treat.treatment_type.title }}</p>
      </div>
      <div class="flex py-1">
        <p class=" font-bold">{{ $t("ProgramType") }} :</p>
        <p>{{ treat.program_system.title }}</p>
      </div>
      <div class="flex py-1">
        <p class=" font-bold">{{ $t("roomnumber") }} :</p>
        <p>{{ treat.rooms.title }}</p>
      </div>
      
    </div>
    <div class="grid grid-cols-2">
      <div class="px-[1%] py-1">
      <div class="flex">
        <p class=" font-bold px-2 ">{{ $t("doctord") }} :</p>
        <p class="px-1">{{treat.user?.title  }}</p>
      </div>
      <div class="flex py-2">
        <svg class="my-auto px-1" xmlns="http://www.w3.org/2000/svg" width="19.65" height="19.641" viewBox="0 0 9.65 9.641">
  ``````<path id="price" d="M9.513,6.408,6.45,9.471a.6.6,0,0,1-.839,0L.2,4.062a1.115,1.115,0,0,1-.17-.745V.6A.575.575,0,0,1,.211.174.587.587,0,0,1,.635,0H3.349A1.134,1.134,0,0,1,4.1.17l5.409,5.4a.6.6,0,0,1,.17.424.564.564,0,0,1-.17.415ZM2.445,1.2a1.163,1.163,0,0,0-.853.353,1.161,1.161,0,0,0-.353.853,1.164,1.164,0,0,0,.353.853,1.162,1.162,0,0,0,.853.353A1.162,1.162,0,0,0,3.3,3.256,1.164,1.164,0,0,0,3.651,2.4,1.161,1.161,0,0,0,3.3,1.55,1.163,1.163,0,0,0,2.445,1.2Z" transform="translate(-0.032)" fill="#148a98"/>
````````</svg>

        <p class=" font-bold text-[#135C65] ">{{ $t("price") }} : </p>
        <p class="px-1">{{treat.price  }}</p>
      </div>
    </div>
   <div class="m-auto">
               <v-icon
                 small
                 color="primary"
                 class="mr-2"
                 @click="editItem(treat.id)"
                 >mdi-pencil</v-icon
       >
   </div>
    </div>
  </div>
</div>
   <!-- content -->
  
   <!-- Rest of your component -->

 </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
import InputText from 'primevue/inputtext';
export default {
  components:{InputText},
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
      treatments: {},
      oneTreatment: [],
      // other data properties
    };
  },
  methods: {
    editItem(itemId){
      
      this.$router.push({ name: 'EditTreatment', params: { id: itemId } });
         
    },
    addtherapeutic(){

      this.$router.push({ name: 'Therapeutic' });
    },
    performSearch() {
      // Implement your search logic here
      console.log("Searching for:", this.searchQuery);
    },
    getTreatments() {
      axios.get("api/treatments").then((response) => {
        console.log(response.data.treatments)
        this.treatments = response.data.treatments
        

    
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
.over::-webkit-scrollbar {
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
