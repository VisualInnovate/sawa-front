<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import moment from "moment";
import {useToast} from 'primevue/usetoast'
import Calendar from "primevue/calendar";
import { max } from "date-fns";
export default {
  components: { InputText, Calendar },
  data: () => ({
    skills:[],
    pasrents:{},
    minDate: new Date(1640426400000),
    maxDate: new Date(),
    submitted:false,
    toast:useToast(),
    NameRules: [
      (value) => {
        if (value?.length >= 3) return true;

        return " name must be at least 3 characters.";
      },
    ],
    cities:{},
    error:{},
    child: {},
    lan:[],
    alert_text: null,
    snackbar: true,
  }),
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    arr (){
      return this.type =[
            { name:this.$t('male') , value:'0' },
                { name:this.$t('female') , value:'1' },
              
               
            ]
    },
    getSkills(){
      axios.get("/api/skills").then((res)=>{
            this.skills=res.data.data
          });
    },
    getlang(){
      axios
        .get("/api/languages")
        .then((res) => {
          this.lan=res.data.langs.ar_en
          console.log(res);
        })
      
        axios
        .get(`/api/countries/${localStorage.getItem("appLang")}`)
        .then((res) => {
          console.log(res.data.countries)
          this.cities = res.data.countries
          console.log(res);
        })
        axios
        .get("/api/admin-parents")
        .then((res) => {
          console.log(res.data.countries)
          this.pasrents = res.data.parents
        
        })
    },
    submit() {
      
      this.child.birth_date = moment(this.child.birth_date).format( "YYYY-MM-DD");


      axios.post(`/api/child/create`, this.child).then((res) => {
        this.$toast.add({ severity: 'success', summary: this.$t("success_message"), detail: `${this.$t("element_add_success")}`, life: 3000 });
      }).catch((err) => {
        this.toast.add({ severity: 'error', summary: this.$t("error"), detail: err.response.data.message, life: 3000 });
      });
    },
  },
  mounted() {
    this.getlang()
    this.getSkills()
    console.log(moment(new Date()).format(" YYYY-MM-DD"));
  },
};
</script>
<template>
  <div class="container mx-auto p-6">
    <button @click="goBack" class="mb-5 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
      <span class="mdi mdi-arrow-left mr-2"></span>
      {{ $t("back") }}
    </button>
    
    <div class="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">{{ $t("  اضافة طفل جديد") }}</h2>
      
      <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('child_name') }}</label>
          <InputText v-model="child.name" class="border p-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" :placeholder="$t('child_name')"/>
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('birth_date') }}</label>
          <Calendar v-model.number="child.birth_date" class="border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" showIcon placeholder="dd/mm/yy" :maxDate="maxDate" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('primary_language') }}</label>
          <Dropdown v-model="child.lang" :options="lan"  option-value="id" optionLabel="lang" class="border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('parent_name') }}</label>
          <Dropdown v-model="child.parent_id" :options="pasrents" optionLabel="fname"  option-value="id" optiona class="border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('place_of_birth') }}</label>
          <InputText v-model="child.birth_place" class="border p-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('address') }}</label>
          <InputText v-model="child.address" class="border p-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('national_id') }}</label>
          <InputText v-model="child.national_id" class="border p-2 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('Type') }}</label>
          <Dropdown v-model="child.gender" :options="arr()"  option-value="value" optionLabel="name" class="border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('Nationality') }}</label>
          <Dropdown v-model="child.nationalty"   option-value="id" :options="cities" optionLabel="country" class="border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-700 font-medium mb-2">{{ $t('skill_name') }}</label>
          <MultiSelect v-model="child.skills" :options="skills" optionLabel="name" class="border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors" />
        </div>
      
        <div class="col-span-2 text-center mt-6">
          <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
            {{ $t("submit") }}
          </button>
        </div>
      </form>
    </div>
  </div>
  <toast></toast>
</template>
<style scoped>
button:hover {
  transform: scale(1.05);
  transition: all 0.3s ease-in-out;
}

.container {
  background-color: #f7fafc;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-xl {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.rounded-xl {
  border-radius: 1rem;
}

.text-gray-800 {
  color: #2d3748;
}

.text-gray-700 {
  color: #4a5568;
}

.focus\:ring-blue-200:focus {
  --tw-ring-color: rgba(191, 219, 254, 0.5);
}

.focus\:border-blue-500:focus {
  border-color: #3b82f6;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transform {
  transform: translateZ(0);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>