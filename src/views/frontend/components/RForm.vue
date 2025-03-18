<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <!-- Header Section -->
    <div class="flex justify-between items-center px-8 mb-8">
      <div class="w-1/4 flex justify-center">
        <img class="h-56" src="../image/header/registernobg-01.png" alt="Register Child" />
      </div>
      <div class="w-1/2 text-center space-y-2">
        <h1 class="text-3xl font-bold text-[#FF2A5B]">
          {{ $t("Register_your_child") }}
        </h1>
        <h2 class="text-[#6D9AA0] text-lg">
          {{ $t("From_here_you_can_register_your_child_with_us_to_be_monitored") }}
        </h2>
        <h3 class="text-[#6D9AA0] text-lg">
          {{ $t("The_extent_to_which_his_mental_and_physical_skill_developed") }}
        </h3>
      </div>
      <div class="w-1/4 flex justify-center">
        <v-icon
          @click="goback"
          class="bg-[#135C65] text-white p-4 rounded-full cursor-pointer hover:bg-[#0f4a52] transition-colors"
          start
          icon="mdi-arrow-left"
        ></v-icon>
      </div>
    </div>

    <!-- Form Section -->
    <div class="mx-auto w-[95%] lg:w-[45%] bg-white shadow-xl rounded-xl p-8 relative">
      <!-- Alert -->
      <p v-if="show_alert" class="text-center text-xl font-bold text-green-600 mb-4">
        {{ alert_text }}
      </p>

      <form @submit.prevent="addChild" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Child Name -->
          <div class="lg:col-span-2 required-field">
            <label class="block font-bold text-gray-700 mb-2 ">
              {{ $t('Full_Name') }}
            </label>
            <InputText
              v-model="child.name"
              class="w-full bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-[#135C65]"
              :class="{ 'border-red-500': submitted && !child.name }"
           
            />
          </div>

          <!-- Date of Birth -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 ">
              {{ $t('date_of_birth') }}
            </label>
            <Calendar
              v-model="child.birth_date"
              class="w-full"
              :class="{ 'border-red-500': submitted && !child.birth_date }"
              :maxDate="maxDate"
              showButtonBar
              showIcon
             
            />
          </div>

          <!-- Place of Birth -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 required-field">
              {{ $t('place_of_birth') }}
            </label>
            <InputText
              v-model="child.birth_place"
              class="w-full bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-[#135C65]"
              :class="{ 'border-red-500': submitted && !child.birth_place }"
           
            />
          </div>

          <!-- Address -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 required-field">
              {{ $t('address') }}
            </label>
            <InputText
              v-model="child.address"
              class="w-full bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-[#135C65]"
              :class="{ 'border-red-500': submitted && !child.address }"
           
            />
          </div>

          <!-- National ID -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 required-field">
              {{ $t('national_id') }}
            </label>
            <InputText
              v-model="child.national_id"
              class="w-full bg-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-[#135C65]"
              :class="{ 'border-red-500': submitted && !child.national_id }"
           
            />
          </div>

          <!-- Gender -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 required-field">
              {{ $t('Type') }}
            </label>
            <Dropdown
              v-model="child.gender"
              :options="arr()"
              optionLabel="name"
              optionValue="value"
              class="w-full"
              :class="{ 'border-red-500': submitted && !child.gender }"
         
            />
          </div>

          <!-- Nationality -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 required-field">
              {{ $t('Nationality') }}
            </label>
            <Dropdown
              v-model="child.nationalty"
              :options="cities"
              optionLabel="country"
              optionValue="country"
              filter
              class="w-full"
              :class="{ 'border-red-500': submitted && !child.nationalty }"
             
            />
          </div>

          <!-- Primary Language -->
          <div class="required-field">
            <label class="block font-bold text-gray-700 mb-2 required-field">
              {{ $t('primary_language') }}
            </label>
            <Dropdown
              v-model="child.lang"
              :options="lan"
              optionLabel="lang"
              optionValue="lang"
              filter
              class="w-full"
              :class="{ 'border-red-500': submitted && !child.lang }"
            
              @update:modelValue="getLangs($event)"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center">
          <Button
            type="submit"
            class="bg-[#135C65] text-white px-8 py-3 rounded-lg hover:bg-[#0f4a52] transition-colors"
            :label='$t("سجل طفلك معنا")'
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Dropdown from 'primevue/dropdown';
import axios from "axios";
import moment from "moment";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import { useParentStore } from "../../../stores/ParentStore";
import Message from "primevue/message";
export default {
  components: { Calendar, Textarea, Message ,Dropdown },
  data() {
    return {
      show: false,
      lan:[
       
      ],

      selectedCity: null,
            cities: {},
            type:[ ],
      maxDate: new Date(),
      parentStore: useParentStore(),
      error:{},
      alert_text: "",
      show_alert: false,
      submitted:false,
      child: { },
    };
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    },
  },
  methods: {
    arr (){
      return this.type =[
            { name:this.$t('male') , value:'0' },
                { name:this.$t('female') , value:'1' },
              
               
            ]
    },
   
    goback() {
      this.$router.go(-1);
    },
    
    addChild() {
      this.child.parent_id =  localStorage.getItem("parent_id");
      axios.post("/api/parent/child/create",this.child).then((res) => {
        this.$router.push({name:"Following"});
        }).catch((el)=>{
          console.log(el.response.data.errors.name)
       this.error = el.response.data.errors
      })
     
      
     
     
     
     
           
         
    },

    getCountries() {
      axios
      .get(`/api/countries/${localStorage.getItem("appLang")}`)
        .then((res) => {
          console.log(res.data.countries)
          this.cities = res.data.countries
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getLangs(e) {
      console.log(e)
        axios
        .get("/api/languages")
        .then((res) => {
          if(e=='اخر'){
            this.lan=res.data.langs.other
            this.lan.push({  "id": 8, "lang":"Arabic", "id": 44, "lang": "English",})
          }else{
            this.lan=res.data.langs.ar_en
            this.lan.push({  "id": 0, "lang": "اخر"})
          }
      
        })
        .catch((err) => {
          console.log(err);
        });
     
     
    },
  },

  mounted() {
    this.getCountries();
    this.getLangs();
  },
};
</script>
<style>
/* Target the placeholder pseudo-element and set opacity */
/* input::placeholder {
  opacity: 0.5;
} */

#calender input {
  
  border: none;
  border-bottom: 2px solid rgb(194, 188, 188);
  text-align: center;
  font-family: "Cairo", sans-serif;
  font-size: 20px;
}
.required-field label::after {
  content: " *";
  color: red;
  font-weight: bold;
}
/* #pv_id_3  {
  border: none;
  border-bottom: 2px solid #818080;
  text-align: center;
  font-family: "Cairo", sans-serif;
  font-size: 20px;
  border-radius: 0;
}
#pv_id_2 {
  
  border: none;
  border-bottom: 2px solid rgb(194, 188, 188);
  text-align: center;
  font-family: "Cairo", sans-serif;
  font-size: 20px;
  border-radius: 0;
}
#pv_id_2:focus {
  border: none;

} */

/* input::placeholder {
  opacity: 50%;
  color: black;
} */
</style>
