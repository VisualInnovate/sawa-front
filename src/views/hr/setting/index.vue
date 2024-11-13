<script setup>
import {FilterMatchMode} from 'primevue/api'
import {ref, onMounted, onBeforeMount} from 'vue'
import {GoogleMap, Marker, Circle} from "vue3-google-map";
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import { useI18n } from 'vue-i18n'
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

  const { t } = useI18n()
const toast = useToast()
const location = ref(
    {name: '', latitude: '', longitude: '', distance: 1000}
)
const loading = ref(true)
const department=ref('')
const settings = ref({})
const edditing=ref({
  editelong:true,
  editelate:true
})
const filters = ref({})
const submitted = ref(false)
const delete_id =ref(Number)

onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("api/settings").then((res)=>{
    loading.value= false
    settings.value= res.data.data[0]
    location.value.latitude=settings.value.company_lat
    location.value.longitude=settings.value.company_long

  });

}
function handleMapClick(event) {
  const clickedLatLng = event.latLng; // LatLng object representing the clicked coordinates
  const lat = clickedLatLng.lat();
  const lng = clickedLatLng.lng();
  settings.value.company_long= lng;
  settings.value.company_lat = lat;
  console.log('Clicked coordinates:', lat, lng);
  // Do something with the latitude and longitude values
}

onMounted(() => {

fetchData()

})





const update =()=>{
  console.log(settings.value)
  axios.put(`api/settings`,settings.value).then((res)=>{
    toast.add({ severity: 'success', summary: t("success_message"), detail: `${t("element_update_success")}`, life: 3000 });

    fetchData()
  });
}


const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <v-card class="card max-w-3xl p-[2%] m-auto bg-slate-50">
              <h2 class="text-3xl py-1 font-bold text-center text-[#473e3e]">Hr Settings</h2>
        <Toast/>
        <form @submit.prevent="update" class="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div class="py-3">
                  <GoogleMap api-key="AIzaSyDZnJeq94aaneiA3QWUZdWYV9uKDEjxjas" @click="handleMapClick"
                  style="width: 100%; height: 400px;"
                  :center="{ lat: 		parseFloat(location.latitude), lng: parseFloat(location.longitude)} " :zoom="14">
                  <Marker
                  :options="{ position: { lat: parseFloat(location.latitude)		, lng: parseFloat(location.longitude) } }"/>
                
                 </GoogleMap>

          </div>
       <div class="m-auto w-full">
        <div class="field mb-5">
            <p for="last">{{ $t("company_long") }} </p>
            <div class="flex">
              <InputText readonly   v-model="settings.company_long"   class="mt-3 w-full" id="last"  required autofocus   :class="{ 'p-invalid': submitted && !settings.company_long }" />
            </div>
            <small v-if="submitted && !settings?.company_long" class="p-invalid text-red-600" > {{$t("company_long") + ' ' + $t("required") }}.</small>



          </div>
          
          <div class="field mb-5">
            <p for="last">{{ $t("company_lat") }} </p>
            <div class="flex">
              <InputText readonly   class="mt-3 mx-1 w-full" v-model="settings.company_lat" required="true"  :class="{ 'p-invalid': submitted && !settings.company_lat } " />
            </div>
            <small v-if="submitted && !settings?.company_lat" class="p-invalid text-red-600" > {{$t("company_lat") + ' ' + $t("required") }}.</small>


          </div>
          <div class="flex ">
            <Button @click="submitted=true"  type="submit" :label='$t("save")' icon="pi pi-check" class=" create " />

          </div>

       </div>

        </form>

      </v-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

