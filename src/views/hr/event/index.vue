<script setup>
import {FilterMatchMode} from '@primevue/core/api'
import {ref, onMounted, onBeforeMount} from 'vue'
// import ProductService from '@/service/ProductService';
import {useToast} from 'primevue/usetoast'
import axios from "axios";
import { useI18n } from 'vue-i18n';

const toast = useToast()
const { t } = useI18n();
const error=ref({})
const loading = ref(true)
const event_update=ref({})
const users = ref([])
const event = ref({})
const updateDialog=ref(false)
const productDialog = ref(false)
const deleteDialog = ref(false)
const deleteProductsDialog = ref(false)
const product = ref({})
const selectedProducts = ref(null)
const dt = ref(null)
const filters = ref({})
const submitted = ref(false)
const selectedCities = ref([]);
const delete_id =ref(Number)
const priorities = ref([
    { name: '1', code: 1 },
    { name: '2', code: 2 },
    { name: '3', code: 3 },
    { name: '4', code: 4 },
    { name: '5', code: 5 },
    { name: '6', code: 6 }
]);
onBeforeMount(() => {
  initFilters()
})

 const fetchData= ()=>{


  axios.get("/api/events").then((res)=>{
    loading.value= false
    users.value= res.data.data

  });

}

onMounted(() => {

  // productService.getProducts().then((data) => (products.value = data));
fetchData()

})

const uploadFile = (e) => {
  const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        event.value.image = e.target.result;
        event.value.file = image;
      
      };

};


const onSubmit=()=>{
  const body = new FormData();
  if(event.value.file ){
       body.append("image", event.value.file);
       body.append("body", event.value.body);
       body.append("title", event.value.title);
  }

  axios
    .post('api/events',body)
    .then((res) => {
      fetchData()
      productDialog.value=!(productDialog.value)
      category.value={}
      toast.add({severity: 'success', summary: t('success_message'), detail: t('event_created_successfully'), life: 3000})
    })
    .catch((el)=>{

    error.value = el.response.data.errors

    })
}

const update =()=>{
  const body = new FormData();

    if(event.value.file){
        body.append("image",event.value.file );
    }
      
       body.append("body", event_update.value.body);
       body.append("title", event_update.value.title);



  axios
    .post(`api/events/${delete_id.value}`,body)
    .then((res) => {
      fetchData()
      updateDialog.value=!(updateDialog.value)
      category.value={}
      toast.add({severity: 'success', summary: t('success_message'), detail: t('event_created_successfully'), life: 3000})
    })
    .catch((el)=>{

    error.value = el.response.data.errors

    })
}




const edit = (id) => {
  delete_id.value=id
  error.value={}
  updateDialog.value = true
  axios.get(`/api/events/${id}`).then((res)=>{


    event_update.value=res.data.data


  });

}

const confirmDelete = (data) => {
  delete_id.value=data
  deleteProductsDialog.value=true

}



const exportCSV = () => {
  dt.value.exportCSV()
}

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true
}
const deleteSelectedProducts = () => {

axios.delete(`api/events/${delete_id.value.id}`).then((res)=>{


    fetchData()
    deleteProductsDialog.value=false
    toast.add({severity: 'success', summary: t('success_message'), detail: t('event_deleted_successfully'), life: 3000})

});


}

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  }
}
</script>

<template>
    <div v-can="'events create'" class="sawa-card card mb-5 p-4 shadow-md bg-slate-50">
    <form @submit.prevent="onSubmit" >
     <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
       <div>
        <div class="">
          <label for="password">{{$t("title")}} </label>
          <InputText required v-model="event.title" type="text" class="mt-3 w-full mb-3" :placeholder='$t("title")'/>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{error.title[0]}}</div>
        </div>
        <div class="">
          <label for="password">{{ $t("body_event") }} </label>
          <InputText required v-model="event.body" type="text" class="mt-3 w-full mb-3" :placeholder='$t("body_event")'/>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.body">{{error.body[0]}}</div>
        </div>



          <div class=" hidden flex-column gap-2 py-1 ">
                  <label class="w-full my-2" for="username">{{ $t('image') }}</label>
                  <InputText  name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full my-2" />
                <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
            </div>
        </div>
        <div class="py-1">
                 <div class=" text-center" >
                  <div onclick="document.getElementById('filr').click()" class=" border-4 h-40 m-auto rounded-full w-40" :style="{ backgroundImage: `url(${ event.image})` }" style="background-position: center;background-repeat: no-repeat;background-size: cover;"></div>
                    <Button  onclick="document.getElementById('filr').click()" class="mt-2" icon="pi pi-upload" :label="$t('upload_icon')" />
                  </div>

        </div>
      </div>
      <Button v-can="'events list'" :label='$t("export")' icon="pi pi-upload" @click="exportCSV($event)" severity="secondary" variant="outlined" />
      <Button v-can="'events create'"  type="submit"  :label='$t("create_button")' icon="pi pi-plus" class="mr-2"></Button>
    </form>
    </div>
  <div class="grid">

    <div class="col-12 " style="overflow-y: scroll;">
      <div class="card shadow-md">


        <Toast/>


        <DataTable
          ref="dt"
          v-model:selection="selectedProducts"
          :value="users"
          :loading="loading"
          data-key="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5, 10, 25]"
          :current-page-report-template="`${$t('Showing')} {first} ${$t('to')} {last} ${$t('of')} {totalRecords} ${$t('records')}`"
          responsive-layout="scroll"
          v-can="'events list'"
        >
          <template #header>
            <div class="flex w-full  justify-between align-items-center">
              <h5 class="page-title">{{ $t("events") }}</h5>
             <div>
              <IconField class="table-search mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters['global'].value" :placeholder='$t("search")'/>
              </IconField>
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem"></Column>
          <Column field="id" :header='$t("index")' :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.id }}
            </template>
          </Column>

          <Column field="body"  :header='$t("body_event")' :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.body }}
            </template>
          </Column>
          <Column field="title"  :header='$t("title")' :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.title }}
            </template>
          </Column>
          <Column field="image" :header='$t("image")' :sortable="true" header-style="width:14%; min-width:10rem;">
            <template #body="slotProps">

            <Image :src="slotProps.data.image"  alt="Image" class="w-24 " preview />

            </template>
          </Column>




<!--          <Column header="Image" header-style="width:14%; min-width:10rem;">-->
<!--            <template #body="slotProps">-->
<!--              <span class="p-column-title">Image</span>-->
<!--              <img-->
<!--                :src="'demo/images/product/' + slotProps.data.image"-->
<!--                :alt="slotProps.data.image"-->
<!--                class="shadow-2"-->
<!--                width="100"-->
<!--              />-->
<!--            </template>-->
<!--          </Column>-->

          <Column header-style="min-width:10rem;">
            <template #body="slotProps">
              <Button
              v-can="'events edit'"
                icon="pi pi-pencil"
                @click="edit(slotProps.data.id)" rounded severity="info" variant="outlined" v-tooltip.top="$t('edit')" :aria-label="$t('edit')" />
              <Button
              v-can="'events delete'"
                icon="pi pi-trash"
                @click="confirmDelete(slotProps.data)" severity="danger" rounded variant="outlined" v-tooltip.top="$t('delete')" :aria-label="$t('delete')" />
            </template>
          </Column>

        </DataTable>
        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" :header="$t('confirm')" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="product">{{ $t('are_you_sure_delete') }} {{ delete_id.name }} ?</span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" @click="deleteProductsDialog = false" variant="text" severity="secondary" />
            <Button :label="$t('yes')" icon="pi pi-check" @click="deleteSelectedProducts" severity="danger" />
          </template>
        </Dialog>



        <Dialog v-model:visible="updateDialog" :style="{ width: '450px' }" :header="$t('confirm')" :modal="true">



          <form @submit.prevent="onSubmit" >
     <div class="grid grid-cols-1 lg:grid-cols-1 gap-4">
       <div>
        <div class="">
          <label for="password">{{$t("title")}} </label>
          <InputText required v-model="event_update.title" type="text" class="mt-3 w-full mb-3" :placeholder='$t("title")'/>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.title">{{error.title[0]}}</div>
        </div>
        <div class="">
          <label for="password">{{ $t("body_event") }} </label>
          <InputText required v-model="event_update.body" type="text" class="mt-3 w-full mb-3" :placeholder='$t("body_event")'/>
          <div class="mt-1 mb-5 text-red-500" v-if="error?.body">{{error.body[0]}}</div>
        </div>



        <div class=" hidden flex-column gap-2 py-1 ">
                <label class="w-full my-2" for="username">{{ $t('image') }}</label>
                <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full my-2" />
              <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
        </div>
        </div>
        <div class="py-1">
                 <div class=" text-center" >
                  <img onclick="document.getElementById('filr').click()" v-if="event.image"  :src=" event.image" alt="Image"  class="m-auto w-[70%] "  preview />
                  <img onclick="document.getElementById('filr').click()" v-else="event.image"  :src="  event_update.image" alt="Image"  class="m-auto w-[70%] "  preview />

                  <div class="mt-1 mb-5 text-red-500" v-if="error?.image">{{ error.image[0] }}</div>
                  </div>

           </div>
        </div>

    </form>
          <template #footer>
            <Button :label="$t('save')" icon="pi pi-check" @click="update" variant="text" />
          </template>
        </Dialog>


      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

