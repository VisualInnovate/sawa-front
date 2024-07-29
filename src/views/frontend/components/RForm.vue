<template>
  <div class="">
    <div class="flex justify-between">
      <div style="width: 25%" class="m-auto">
        <img class="h-56 m-auto" src="../image/header/registernobg-01.png" />
      </div>
      <div class="m-auto text-center w-[50%] space-y-2">
        <h1 class="text-3xl font-bold text-[#FF2A5B]">
          {{ $t("Register_your_child") }}
        </h1>
        <h2 class="text-[#6D9AA0] text-lg">
          {{
            $t("From_here_you_can_register_your_child_with_us_to_be_monitored")
          }}
        </h2>
        <h3 class="text-[#6D9AA0] text-lg">
          {{
            $t("The_extent_to_which_his_mental_and_physical_skill_developed")
          }}
        </h3>
      </div>

      <div style="width: 25%" class="relative my-auto">
        <v-icon
          @click="goback"
          style="right: 50%"
          class="bg-[#135C65] text-white p-6 absolute rounded-full"
          start
          icon="mdi-arrow-left"
        ></v-icon>
      </div>
    </div>

    <div
      style="margin-bottom: 2%"
      class="m-auto w-[95%] lg:w-[45%] shadow-xl p-[2%] rounded-xl relative"
    >
      <!-- Alert -->
      <p
        v-if="show_alert"
        class="text-center text-xl font-bold tracking-wide"
        style="color: green"
      >
        {{ alert_text }}
      </p>
      <!-- End Alert -->

      <form class="">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
          <!--  Child Name -->
  
            <div class="lg:col-span-2 flex flex-column gap-2">
                  <label class="w-full font-bold " for="username">{{ $t('Full_Name') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="child.name" :placeholder='$t("Full_Name")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.name">{{ error.name[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="font-bold" for="username">{{ $t('date_of_birth') }}</label>
                    <Calendar  style="width: 100%" showButtonBar   v-model="child.birth_date" showIcon  :placeholder='$t("date_of_birth")'  :maxDate="maxDate" />   
                    <div class="mt-1 mb-5 text-red-500" v-if="error?.birth_date">{{ error.birth_date[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full font-bold " for="username">{{ $t('place_of_birth') }}</label>
                <InputText required class="bg-[#f7f5f5] text-center" v-model="child.birth_place" :placeholder='$t("place_of_birth")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.birth_place">{{ error.birth_place[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full font-bold " for="username">{{ $t('address') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="child.address" :placeholder='$t("address")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.address">{{ error.address[0] }}</div>
            </div>
            <div class=" flex flex-column gap-2">
                  <label class="w-full font-bold " for="username">{{ $t('national_id') }}</label>
                <InputText  required class="bg-[#f7f5f5] text-center" v-model="child.national_id" :placeholder='$t("national_id")' />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.national_id">{{ error.national_id[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full font-bold " for="username">{{ $t('Type') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.gender"  option-value="value" :options="arr()" optionLabel="name" :placeholder='$t("selectgender")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.gender">{{ error.gender[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full font-bold " for="username">{{ $t('Nationality') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.nationalty"  option-value="nationality" :options="cities" optionLabel="nationality" :placeholder='$t("Nationality")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.nationalty">{{ error.nationalty[0] }}</div>
            </div>
            <div class="flex flex-column gap-2">
                    <label class="w-full font-bold " for="username">{{ $t('primary_language') }}</label>
                    <Dropdown required id="pv_id_1" style="direction: ltr !important;" v-model="child.lang"  option-value="lang" :options="lan" optionLabel="lang" :placeholder='$t("primary_language")' class="w-full bg-[#f7f5f5] [&>div>div>span]:bg-black md:w-14rem " />
                      <div class="mt-1 mb-5 text-red-500" v-if="error?.lang">{{ error.lang[0] }}</div>
            </div>
        
      
            <div class="flex flex-column gap-2 w-full ">
                  <label style="visibility: hidden;" for="username">{{ $t('gruop_sessaion') }}</label>
                  <Button @click="addChild" class="create m-auto w-full " :label='$t("Register_now")'></Button>
                  <small id="username-help"></small>
              </div>
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
      lan:[],

      selectedCity: null,
            cities: {},
            type:[ ],
      maxDate: new Date(),
      parentStore: useParentStore(),
      error:{},
      alert_text: "",
      show_alert: false,
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
        .get("/api/countries")
        .then((res) => {
          console.log(res.data.countries)
          this.cities = res.data.countries
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getLangs() {
      axios
        .get("/api/languages")
        .then((res) => {
          this.lan=res.data.langs
          console.log(res);
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
