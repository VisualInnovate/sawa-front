<template>
   <div class="absolute h-full bg-black z-50 w-full text-center m-auto opacity-[25%]" :class="{ 'hidden': isActive }">
    <i class="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] pi pi-spin pi-spinner  " style="font-size: 3rem"></i>
   </div>
  <div class="container relative">
   

    <!-- Header Section -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3 shadow p-4">
      <div class="paragraph text-2xl">
        <h2>{{ $t("roomnumber") }}</h2>
        <p>{{ $t("RoomAc") }}</p>
      </div>
    <div class="relative ">
       <i class="pi pi-search absolute top-[20%] right-[5%] font-bold cursor-pointer"  @click="performSearch()"/>
       <InputText style="text-align: center;" class="lg:w-full" v-model="searchQuery" placeholder="Search" />
    </div>
     

      <div  @click="navigateToAddRoom()" class=" m-auto ">
   
         
       <div style=" margin: auto; border: 2px solid #135C65; " class="py-2 rounded-full w-[50%] h-[50%]">
  
<svg style="margin: auto;" xmlns="http://www.w3.org/2000/svg" width="23.391" height="26.316" viewBox="0 0 23.391 26.316">
  <path id="plus" d="M17.495,19.12V29.354a1.388,1.388,0,0,1-1.3,1.462,1.388,1.388,0,0,1-1.3-1.462V19.12H5.8a1.472,1.472,0,0,1,0-2.924h9.1V5.962A1.388,1.388,0,0,1,16.2,4.5a1.388,1.388,0,0,1,1.3,1.462V16.2h9.1a1.472,1.472,0,0,1,0,2.924Z" transform="translate(-4.5 -4.5)" fill="#148a98" fill-rule="evenodd"/>
</svg>

       </div>

          <p class="m-auto cursor-pointer text-xl w-full">{{ $t("addRoom") }}</p>
    
      </div>
    </div>


    <!-- content -->
   <div   v-for="room in rooms" class=" grid grid-cols-1 lg:grid-cols-3 pt-[5%]  hover:bg-[#dbebf5] rounded-md py-5 my-2 bg-[#F8F8F8]">

       
    <div class="m-auto flex">
      <div class="my-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="50.669" height="30" viewBox="0 0 50.669 30">
  <g id="meeting-room" transform="translate(0 -80.04)">
    <path id="Path_255" data-name="Path 255" d="M49.255,89.541H46.471a5.37,5.37,0,0,0-2.162-3.724v-.874a4.908,4.908,0,0,0-4.9-4.9H37.277a4.908,4.908,0,0,0-4.9,4.9v3.746a5.333,5.333,0,0,0-.4-1.013V84.942a4.908,4.908,0,0,0-4.9-4.9H24.942a4.908,4.908,0,0,0-4.9,4.9v2.733a5.33,5.33,0,0,0-.4,1.013V84.942a4.908,4.908,0,0,0-4.9-4.9H12.606a4.908,4.908,0,0,0-4.9,4.9v.874a5.369,5.369,0,0,0-2.162,3.724H1.414A1.416,1.416,0,0,0,0,90.955V106.6a1.291,1.291,0,1,0,2.582,0h0V95.314H5.507v4.258A1.291,1.291,0,0,0,6.8,100.864H7.7v.693a1.29,1.29,0,0,0,0,2.58v4.611a1.291,1.291,0,1,0,2.582,0v-4.61h3.583v4.61a1.291,1.291,0,1,0,2.582,0v-4.611a1.29,1.29,0,0,0,0-2.58v-.693h.906a1.291,1.291,0,0,0,1.291-1.291V95.315h.787v4.258a1.291,1.291,0,0,0,1.291,1.291h.906v.693a1.29,1.29,0,0,0,0,2.58v4.611a1.291,1.291,0,1,0,2.582,0v-4.61H27.8v4.61a1.291,1.291,0,1,0,2.582,0v-4.611a1.29,1.29,0,0,0,0-2.58v-.693h.906a1.291,1.291,0,0,0,1.291-1.291V95.315h.787v4.258a1.291,1.291,0,0,0,1.291,1.291h.906v.693a1.29,1.29,0,0,0,0,2.58v4.611a1.291,1.291,0,1,0,2.582,0v-4.61h3.583v4.61a1.291,1.291,0,1,0,2.582,0v-4.611a1.29,1.29,0,0,0,0-2.58v-.693h.906a1.291,1.291,0,0,0,1.291-1.291V95.315h1.581V106.6h0a1.291,1.291,0,1,0,2.582,0V90.955A1.416,1.416,0,0,0,49.255,89.541Zm-7.529,11.323v.692H38.143v-.692Zm2.2-2.582H35.946V90.145a2.79,2.79,0,0,1,2.786-2.786h2.4a2.79,2.79,0,0,1,2.786,2.786ZM24.942,82.622h2.129a2.323,2.323,0,0,1,2.32,2.32v.3a5.335,5.335,0,0,0-2.183-.465H24.8a5.335,5.335,0,0,0-2.183.465v-.3A2.322,2.322,0,0,1,24.942,82.622Zm14.464,0a2.321,2.321,0,0,1,2.313,2.186,5.393,5.393,0,0,0-.583-.032h-2.4a5.351,5.351,0,0,0-3.776,1.556v-1.39a2.323,2.323,0,0,1,2.32-2.32Zm-20.758,9.5h.787v.609h-.787Zm13.929,0h.787v.609h-.787ZM17.055,84.942v1.39a5.351,5.351,0,0,0-3.776-1.556h-2.4a5.4,5.4,0,0,0-.583.032,2.321,2.321,0,0,1,2.313-2.186h2.129A2.323,2.323,0,0,1,17.055,84.942ZM2.582,92.123H5.507v.609H2.582Zm11.287,8.741v.692H10.286v-.692Zm2.2-2.582H8.089V90.145a2.79,2.79,0,0,1,2.786-2.786h2.4a2.79,2.79,0,0,1,2.786,2.786ZM27.8,100.864v.692H24.215v-.692Zm2.2-2.582H22.018V90.145A2.79,2.79,0,0,1,24.8,87.358h2.4a2.79,2.79,0,0,1,2.786,2.786v8.137Zm16.511-6.158h1.581v.609H46.506Z" fill="#3a424f"/>
  </g>
</svg>
      </div>
      <div class="px-3 ">
        <div class="flex">
        <p class="text-lg font-bold">{{ $t("numberroom") }} -</p>
         <p class="text-lg">{{ room.title }}</p> 
        </div>
        <div>
          <p class="font-bold text-[#135C65]">{{ room.treatment_type?.title }}</p>
        </div>
      </div>
    </div>
    <div class="m-auto text-center">
      <div class="flex">
        <p class="px-2 font-bold">{{ $t("roomdoctor") }} :</p>
        <p>{{ room.user?.name }}</p>
      
      </div>
      <div class="flex">
        <p class="px-3">{{ $t("capacity") }} :</p>
      <p class="text-[#135C65]  font-bold">{{  room.capacity }}</p>
      <p class="my-auto px-2"><svg class="my-auto" xmlns="http://www.w3.org/2000/svg" width="13.389" height="12.274" viewBox="0 0 13.389 12.274">
  <path id="ac1d763ecd9686540fe1af62c1755b89" d="M9.247,8.694a1.674,1.674,0,0,1,1.674,1.674V11.2c.115,2.049-1.463,3.071-4.39,3.071S2,13.265,2,11.232v-.864A1.674,1.674,0,0,1,3.674,8.694Zm4.464,0a1.674,1.674,0,0,1,1.674,1.674v.588c.1,1.838-1.294,2.76-3.843,2.76a8.866,8.866,0,0,1-.975-.051,2.924,2.924,0,0,0,.918-2.252l-.007-.241,0-.8a2.226,2.226,0,0,0-.756-1.674ZM6.463,2a2.79,2.79,0,1,1-2.79,2.79A2.79,2.79,0,0,1,6.463,2Zm5.579,1.116A2.231,2.231,0,1,1,9.81,5.347,2.231,2.231,0,0,1,12.041,3.116Z" transform="translate(-2 -2)" fill="#148a98"/>
</svg>
</p>
      </div>
    
    </div>
    <div class="m-auto">
      <v-icon small color="error" @click="deleteItem(room.id)"
                  >mdi-delete</v-icon
                >
                <v-icon
                  small
                  color="primary"
                  class="mr-2"
                  @click="editItem(room.id)"
                  >mdi-pencil</v-icon
        >
    </div>
   </div>
    <!-- Rest of your component -->

  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';
import 'primeicons/primeicons.css'
import InputText from 'primevue/inputtext';


export default {
  components:{InputText},
  data() {
    return {
      isActive:false,
      searchQuery: "",
      headers: [5],
      rooms: [],
      page: 1,
      showModal: false,
      // other data properties
    };
  },
  watch: {
      overlay (val) {
        val && setTimeout(() => {
          this.overlay = false
        }, 2000)
      },
    },
  computed:
  {
    roomss() {
      return ` ${this.this.rooms}`;
    },
    roomssearchQuery() {
      return this.rooms.filter((st) => st.title.match(this.searchQuery));
    },
  },
  methods: {

    navigateToAddRoom() {
      // Navigate to the add room route
      this.$router.push({ name: 'CreateRoom' });
    },

 deleteItem(id) {
  console.log(id)
      axios.delete('/api/destroy/room/' + id)
        .then(response => {
          Swal.fire({
            title: 'تم الحذف بنجاح!',
            text: 'تم حذف الغرفه .',
            icon: 'success',
            timer: 3000, // Alert will close after 3 seconds
            willClose: () => {
              const index = this.rooms.findIndex(room => room.id === id);
              if (index !== -1) {
                this.rooms.splice(index, 1);
              }
            }
          });
        })
        .catch(error => {
          console.error('Error deleting item:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem deleting your room.',
            icon: 'error',
            timer: 3000
          });
        });
    },

    getAllRoom() {
      axios.get(`api/getrome_data`).then((response) => {
        this.rooms = response.data.rooms;
         this.isActive=true
        console.log(this.rooms);
      });
    },
    editItem(itemId) {
      // Assuming you have a route named 'EditRoom' that takes an 'id' parameter
      this.$router.push({ name: 'EditRoom', params: { id: itemId } });
    }
  },

  mounted() {

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
</style>
