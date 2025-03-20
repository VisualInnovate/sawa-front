<template>
  <nav ref="staticDiv" :class="{ 'fixed': isFixed }" class="static-div bg-white border-gray-200 w-full nave shadow-lg" style="z-index: 100;">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
      <p class="my-auto text-center lg:hidden">
        <router-link :to="{ name: 'home' }" class="text-lg font-extrabold lg:mx-6"></router-link>
      </p>

      <button @click="visible = true" data-collapse-toggle="navbar-default" type="button" class="mx-1 inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
      </button>
      <div class="w-full md:block md:w-auto" id="navbar-default" :class="{ hidden: show }">
        <ul class="flex flex-col font-medium rounded-lg bg-gray-50 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
          <li class="m-auto  text-center lg:py-0">
            <router-link :to="{ name: 'home' }" class="text-lg font-extrabold lg:mx-6">
              <img src="/src/views/frontend/image/header/Group22.png" class="w-[150px] h-[60px] hover:scale-105 transition-transform duration-300">
            </router-link>
          </li>
          <li class="my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'Booking' }" class="text-base font-bold mx-3 text-black hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("bookings") }}</router-link>
          </li>
          <li class="hidden lg:block my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'clidreen_parents' }" class="text-base font-bold mx-3 text-black hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("اطفالي") }}</router-link>
          </li>
          <li class="my-auto text-center py-1 lg:py-0">
            <router-link :to="{ name: 'contactus' }" class="text-base font-bold mx-3 text-black hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("تواصل معنا") }}</router-link>
          </li>
        </ul>
      </div>
      <div class="hidden lg:block">
        <p style="display:inline-block; height: 50px;"><LocaleSelect id="local-switcher"></LocaleSelect></p>
        <div style="display: inline-block;" v-if="parentStore.parentAuth">
          <Button
            style="background: linear-gradient(45deg, #FF2A5B, #FF6B8E); color: white; border: none;"
            class="mx-2 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            icon="pi pi-user"
            @click="goToProfile"
          />
          <Button
            style="background: linear-gradient(45deg, #7B7B7B, #9E9E9E); color: white; border: none;"
            class="mx-2 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            icon="pi pi-sign-out"
            @click="logout"
          />
        </div>

        <router-link v-if="!parentStore.parentAuth" :to="{ name: 'parentLogin' }" class="items-center hidden lg:block" style="display: inline;">
          <Button
            style="background: linear-gradient(45deg, #FF2A5B, #FF6B8E); color: white; border: none;"
            :label='$t("sign_in")'
            class="relative fed text-lg primer lg:mb-0 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          />
        </router-link>
        <router-link v-if="!parentStore.parentAuth" :to="{ name: 'SingUp' }" class="text-lg items-center hidden lg:block" style="display: inline;">
          <Button
            style="background: linear-gradient(45deg, #7B7B7B, #9E9E9E); color: white; border: none;"
            :label='$t("Create_an_account")'
            class="h-full relative create my-auto ce lg:mb-0 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          />
        </router-link>
      </div>
    </div>
  </nav>
  <div :class="{'hidden':!visible}" class="card justify-content-center opacity-0" style="direction: ltr;">
    <Sidebar v-model:visible="visible" header="Sidebar">
      <ul>
        <li class="my-auto text-center py-4 lg:py-0">
          <router-link :to="{ name: 'home' }" class="text-base font-extrabold px-3 text-[#A5ABB4] hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("home") }}</router-link>
        </li>
        <li class="hidden lg:block my-auto text-center py-1 lg:py-0">
          <router-link :to="{ name: 'home' }" class="text-lg font-extrabold px-3 text-[#A5ABB4] hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("about_us") }}</router-link>
        </li>
        <li class="my-auto text-center py-4 lg:py-0">
          <router-link :to="{ name: 'home' }" class="text-lg font-extrabold px-3 text-[#A5ABB4] hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("auctions") }}</router-link>
        </li>
        <li class="my-auto text-center py-4 lg:py-0 border-b-2">
          <router-link :to="{ name: 'home' }" class="text-lg font-extrabold px-3 text-[#A5ABB4] hover:text-[#FF2A5B] transition-colors duration-300" style="line-height: 20px;">{{ $t("Contact_us") }}</router-link>
        </li>
        <a href="/login" class="flex m-auto items-center space-x-3 rtl:space-x-reverse">
          <Button
            style="background: linear-gradient(45deg, #FF2A5B, #FF6B8E); color: white; border: none;"
            :label='$t("login")'
            class="mt-1 m-auto h-full relative mb- pl-4 lg:w-[150px] lg:mb-0 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          />
        </a>
      </ul>
    </Sidebar>
  </div>
  <div style="direction: ltr !important;" class="flex justify-content-center">
    <Sidebar v-model:visible="dashboard" header="Sidebar">
      <div>
        <img :src="parent_Image" style="width: 100px; height: 100px;" class="rounded-full m-auto hover:scale-105 transition-transform duration-300">
      </div>
      <div class="dash w-[85%] mx-auto py-[5%]">
        <div class="flex justify-between pb-3" style="border-bottom: 1px solid #E0E0E0;">
          <router-link :to="{ name: 'Profile' }" class="font-bold text-xl text-black hover:text-[#FF2A5B] transition-colors duration-300">{{ parentStore?.user?.fname }} {{ parentStore.user.lname }}</router-link>
          <i class="pi pi-chevron-left font-bold my-auto"></i>
        </div>
        <div class="my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
          <router-link :to="{ name: 'New' }" class="font-bold text-lg text-[#2F3843] hover:text-[#FF2A5B] transition-colors duration-300">{{ $t("latest_developments") }}</router-link>
        </div>
        <div class="my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
          <router-link :to="{ name: 'Following' }" class="font-bold text-lg text-[#2F3843] hover:text-[#FF2A5B] transition-colors duration-300">{{ $t("follow_the_child") }}</router-link>
        </div>
        <div class="my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
          <router-link :to="{ name: 'Edit' }" class="font-bold text-lg text-[#2F3843] hover:text-[#FF2A5B] transition-colors duration-300">{{ $t("evaluation_result") }}</router-link>
        </div>
        <div class="my-4 pb-2" style="border-bottom: 1px solid #E0E0E0;">
          <router-link :to="{ name: 'Booking' }" class="font-bold text-lg text-[#2F3843] hover:text-[#FF2A5B] transition-colors duration-300">{{ $t("bookings") }}</router-link>
        </div>
      </div>
    </Sidebar>
  </div>
</template>
<script setup>
import { useParentStore } from "../../../stores/ParentStore";
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";
import Sidebar from 'primevue/sidebar';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import LocaleSelect from "../../../components/LocaleSelect.vue";

const parentStore = useParentStore();
const scrollContainer = ref(null);
const { t } = useI18n();
const parent_Image = ref(localStorage.getItem("parent"));
const dashboard = ref(false);
const staticDiv = ref(null);
const router = useRouter();
const visible = ref(false);
let observer;
const show = ref(true);

const opennave = () => {
  show.value = !(show.value);
};

const isFixed = ref(false);

const goToProfile = () => {
  router.push({ name: 'Profile' });
};

const logout = () => {
  parentStore.logout();
};

const handleScroll = () => {
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
  border-bottom: 2px solid #FF2A5B;
}

.dash .router-link-active {
  transition: 1s;
  color: #FF2A5B !important;
}

.button-with-triangle {
  position: relative;
  overflow: hidden;
}

.button-with-triangle::before {
  content: '';
  position: absolute;
  left: 0px;
  top: 0%;
  transform: translateY(-50%);
  height: 100px;
  border-left: 8px solid transparent;
  border-right: 0px solid transparent;
  border-bottom: 10px solid #fdfdfd;
}

.p-sidebar-left .p-sidebar {
}
</style>