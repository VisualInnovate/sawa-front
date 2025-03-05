<template>


  <nav ref="staticDiv"  :class="{ 'fixed': isFixed }" class="static-div bg-white border-gray-200  w-full nave " style="z-index: 100;">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
  
  
  
  
  
      <p class="my-auto text-center   lg:hidden">
            <router-link :to="{ name: 'home' }" class="text-lg font-extrabold lg:mx-6 "  >
           
            </router-link>
          </p>
  

      <button @click="visible = true" data-collapse-toggle="navbar-default" type="button" class="mx-1  inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
      </button>
      <div class=" w-full md:block md:w-auto" id="navbar-default" :class="{ hidden: show }">
        <ul class="flex flex-col font-medium      rounded-lg bg-gray-50  rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
          <li class="m-auto mx-2 text-center  lg:py-0">
            <router-link :to="{ name: 'home' }" class="text-lg font-extrabold lg:mx-6 "  >
              <img src="/src/views/frontend/image/header/Group22.png" class="w-[150px] h-[60px]">
            </router-link>
          </li>
          <li class="my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'home' }" class="text-base font-bold  mx-3 text-black" style="line-height: 20px;" > {{ $t("home") }}</router-link>
          </li>
          <li class="hidden lg:block my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'about' }"  class="text-base font-bold mx-3 text-black" style="line-height: 20px;"> {{ $t("about_us") }} </router-link>
          </li>
          <li class="my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'contactus' }"  class="text-base font-bold mx-3 text-black" style="line-height: 20px;">{{ $t("تواصل معنا") }}</router-link>
          </li>
          <!-- <li class="my-auto text-center py-1 lg:py-0">
            <a href="https://canv.sa/en/jobs"  class="text-lg font-bold mx-3 text-black" style="line-height: 20px;">   {{ $t("التربية الخاصة") }}</a>
          </li> -->
      
  
  
  
  
        </ul>
      </div>
      <div class="hidden lg:block">
        
    
        <p  style="display:inline-block; height: 50px ;"><LocaleSelect  id="local-switcher"></LocaleSelect></p>
        <div style="display: inline-block;" v-if="parentStore.parentAuth">
  <Dropdown
  
    v-model="selectedItem"
    @update:model-value="action"
    :options="items"
    optionLabel="name"
    class="w-fit"
  >
    <!-- Template for dropdown options -->
    <template #option="slotProps">
      <div class="flex items-center">
        
        <i :class="slotProps.option.icon" class="mr-2"></i>
        {{ slotProps.option.name }}
      </div>
    </template>

    <!-- Template for selected item display -->
    <template #value="slotProps">
      <div class="flex items-center" v-if="slotProps.value">
        <div class="flex items-center" v-if="slotProps.value">
       
        {{ slotProps.value.code }}
      </div>
        
      </div>
    </template>
  </Dropdown>
  <Button style="background-color: white; color: #7B7B7B; border-color: #7B7B7B !important; clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%) !important;"  class=" mx-2" icon="pi pi-angle-double-right" @click="dashboard = !(dashboard)"  />

 
      </div>

        <router-link v-if="!parentStore.parentAuth" :to="{ name: 'parentLogin' }" class="  items-center  hidden lg:block" style="display: inline;">
  
        <Button
        style="border: 0px;height: 45px;"
        :label='$t("sign_in")'
        class=" relative fed text-lg  primer lg:mb-0 bg focus:ring-0  ">
        </Button>
  
        </router-link>
        <router-link v-if="!parentStore.parentAuth" :to="{ name: 'SingUp' }"  class="  text-lg items-center  hidden lg:block" style="display: inline;">
  
          <Button
          style="border: 0px;height: 45px;"
          :label='$t("Create_an_account")'
          class=" h-full relative create my-auto    ce lg:mb-0 bg-none shadow-0  focus:ring-0  ">
          </Button>

          </router-link>
      </div>
  
    </div>
  </nav>
  <div :class="{'hidden':!visible}" class="card   justify-content-center opacity-0" style="direction: ltr;">
          <Sidebar  v-model:visible="visible" header="Sidebar">
           <ul>
            <li class="my-auto text-center py-4 lg:py-0">
            <router-link :to="{ name: 'home' }" class="text-base font-extrabold px-3 text-[#A5ABB4]" style="line-height: 20px;" > {{ $t("home") }}</router-link>
          </li>
          <li class="hidden lg:block my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'home' }"  class="text-lg font-extrabold px-3 text-[#A5ABB4]" style="line-height: 20px;">  {{ $t("about_us") }}</router-link>
          </li>
          <li class="my-auto text-center py-4 lg:py-0">
            <router-link :to="{ name: 'home' }"  class="text-lg font-extrabold px-3 text-[#A5ABB4]" style="line-height: 20px;">  {{ $t("auctions") }}</router-link>
          </li>
          <!-- <li class="my-auto text-center py-4 lg:py-0">
            <router-link :to="{ name: 'jobs' }"  class="text-lg font-extrabold px-3 text-[#A5ABB4]" style="line-height: 20px;">  {{ $t("jobs") }}</router-link>
          </li> -->
          <li class="my-auto text-center py-4 lg:py-0 border-b-2">
            <router-link :to="{ name: 'home' }"  class="text-lg font-extrabold px-3 text-[#A5ABB4]" style="line-height: 20px;">{{ $t("Contact_us") }}</router-link>
          </li>
          <!-- <div class="text-center w-full mt-1"> <LocaleSelect id="local-switcher"></LocaleSelect></div> -->
  
          <a href="/login" class="flex m-auto  items-center space-x-3 rtl:space-x-reverse">
            <Button
            style="background-color: #AA1E22 !important;"
            :label='$t("login")'
            class="mt-1 m-auto h-full relative mb- pl-4 lg:w-[150px]  lg:mb-0 bg focus:ring-0 text-[#AA1E22] ">
            </Button>
  
            </a>
           </ul>
          </Sidebar>
  
      </div>
      <div style="direction: ltr !important;"  class=" flex justify-content-center">
        <Sidebar v-model:visible="dashboard" header="Sidebar">
        
            <div>
              <img :src="parent_Image" style="width: 100px; height: 100px;" class="rounded-full m-auto" >
            </div>
            <div class="dash w-[85%] mx-auto py-[5%]">
               <div class="flex justify-between pb-3" style="border-bottom: 1px solid #E0E0E0;">
                <router-link :to="{ name: 'Profile' }" class="font-bold text-xl text-black"> {{ parentStore?.user?.fname }} {{ parentStore.user.lname }} </router-link>
                <i class="pi pi-chevron-left font-bold my-auto" ></i>
               </div>
               <div class=" my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
                <router-link :to="{ name: 'New' }" class="font-bold text-lg text-[#2F3843]">{{ $t("latest_developments") }}</router-link>
               </div>
               <div class=" my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
                <router-link :to="{ name: 'Following' }" class="font-bold text-lg text-[#2F3843]">{{ $t("follow_the_child") }}</router-link>
               </div>
               <div class=" my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
                <router-link :to="{ name: 'Edit' }" class="font-bold text-lg text-[#2F3843]">{{ $t("evaluation_result") }}</router-link>
               </div>
               <div class=" my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
                <router-link :to="{ name: 'Booking' }" class="font-bold text-lg text-[#2F3843]">{{ $t("bookings") }}</router-link>
               </div>
              
            </div>
        </Sidebar>

    </div>
  </template>
  <script setup>
  import { useParentStore } from "../../../stores/ParentStore";
  import { useI18n } from 'vue-i18n';
  import {useRouter} from "vue-router";
  import Sidebar from 'primevue/sidebar';
   
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import LocaleSelect from "../../../components/LocaleSelect.vue";
  const parentStore =useParentStore()
  const scrollContainer = ref(null);
  const { t } = useI18n();
  const parent_Image=ref(localStorage.getItem("parent"))
  const dashboard = ref(false);
  const staticDiv = ref(null);
  const router = useRouter()
  const visible = ref(false);
  let observer;
  const show=ref(true)
  const opennave=()=>{
    show.value=!(show.value)
  }
  const items = ref([
    { name:`${t("Profile_personly")}` , code: `${parentStore?.parent?.fname}`, icon:"pi pi-user" },
    { name:`${t("sign_out")}`, code: `${parentStore?.parent?.fname}`, icon: "pi pi-sign-out" },
   
   
  ]);

  const selectedItem = ref( { name: `${parentStore?.parent?.fname}`, code: `${parentStore?.parent?.fname}`, });
  const isFixed = ref(false);
  const action=(value)=>{
    if(value.name ==`${t("Profile_personly")}` ){
      router.push({name:'Profile'})
    }
    if(value.name ==`${t("sign_out")}`){
      parentStore.logout()
    }
  }
  const handleScroll = () => {
    // Set isFixed to true if scroll position is greater than 50px
    isFixed.value = window.scrollY > 100;
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  
  
  
  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });
  </script>
  <style>
  .nave .router-link-active {
  
  transition: 1s;
  color: black;
  background-color: white !important;
  border-bottom: 2px solid #FF2A5B ;
  
  
  }
  .dash .router-link-active {
  
  transition: 1s;
  color: #FF2A5B !important;
  
  
  
  }
  
  
  .button-with-triangle {
    position: relative; /* Ensure the button is positioned relative for the pseudo-element */
    overflow: hidden; /* Prevents any overflow issues from the triangle */
  }
  .button-with-triangle::before {
    content: '';
    position: absolute;
    left: 0px; /* Adjust this value to position the triangle horizontally */
    top: 0%; /* Centers the triangle vertically */
    transform: translateY(-50%); /* Adjusts for the vertical center */
    height: 100px;
  
    border-left: 8px solid transparent;
    border-right: 0px solid transparent;
    border-bottom: 10px solid #fdfdfd; /* Triangle color matching the button */
  }
  .p-sidebar-left .p-sidebar{
  
  }
  </style>