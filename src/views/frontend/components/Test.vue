<template>


    <nav ref="staticDiv"  :class="{ 'fixed': isFixed }" class="static-div bg-white border-gray-200  w-full nave " style="z-index: 100;">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto ">
    
    
    
    
    
        <p class="my-auto text-center   lg:hidden">
              <router-link :to="{ name: 'home' }" class="text-lg font-extrabold lg:mx-6 "  >
                <svg class="mx-6" width="81" height="41" viewBox="0 0 81 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2001_1587)">
                <path d="M10.318 20.7138C8.06613 20.7138 6.38676 20.0561 5.32231 18.7534C4.00341 17.1433 3.70231 14.6065 4.43174 11.224V11.2112L4.43598 11.1983C4.51655 10.6816 5.08483 7.65355 5.44106 6.00928H9.14755C8.95671 7.02574 8.62168 8.75115 8.12975 10.925C8.011 11.4503 7.93043 11.8133 7.91771 11.8731C7.34095 14.5424 7.82865 15.5888 8.37996 16.2635C8.83797 16.823 9.62252 17.1092 10.7082 17.1092H21.217L21.0304 16.4984C20.8735 15.9774 20.7717 15.4265 20.7293 14.8542C20.6869 14.2691 20.6911 13.6626 20.742 13.0476C20.7802 12.5864 20.8607 12.1294 20.9498 11.6938H20.9668L21.0728 11.2112C21.3103 10.105 22.027 6.73105 22.1203 6.36803L22.1457 6.2698C22.1839 6.12032 22.3153 6.02209 22.4765 6.02209H31.8233C32.909 6.02209 33.7147 6.33386 34.2194 6.94886C34.4484 7.23073 34.7919 7.89271 34.5205 9.16542L34.3678 9.87438C34.0625 11.2752 33.8547 12.3899 33.6893 13.2825C33.5705 13.9231 33.4688 14.4741 33.367 14.9353C33.227 15.5717 33.1125 16.0756 33.015 16.5326L32.8878 17.1092H39.7155C40.2287 17.1092 40.6782 16.7974 40.7715 16.3789L42.8665 6.02209H46.5178L44.2914 17.0451C43.9563 18.5997 42.6629 20.3764 40.0463 20.6796L39.7791 20.7095L39.5119 20.7223H10.318V20.7138ZM24.9744 10.0538C24.8556 10.6004 24.6945 11.3393 24.563 11.9372L24.546 12.0183C24.5375 12.0568 24.5291 12.0867 24.5163 12.1123L24.4951 12.1593L24.4867 12.2105C24.4315 12.5009 24.4018 12.7401 24.3849 12.9707C24.351 13.4405 24.3467 13.889 24.3764 14.3075C24.4358 15.1318 24.7157 15.7938 25.2288 16.3319C25.8352 16.9682 27.1117 17.1049 28.0744 17.1049H29.1855L29.2661 16.7333C29.7368 14.568 30.1439 12.7188 30.4154 11.493C30.4154 11.493 30.6189 10.5748 30.6868 10.2545L30.814 9.67792H25.0549L24.9744 10.0538Z" fill="#2F3843"/>
                <path d="M43.2183 3.97605L44.0113 0.0639648H47.6584L46.8696 3.97605H43.2183Z" fill="#AA1F23"/>
                <path d="M27.2559 3.97617C27.4764 2.79315 27.7944 1.14888 28.0277 0.0683594H31.7342C31.573 0.909714 31.3101 2.26784 30.9369 3.97617H27.2559Z" fill="#AA1F23"/>
                <path d="M50.254 20.7133C49.1768 20.7133 48.2353 20.2862 47.5992 19.5132C47.0097 18.7957 46.8528 17.7793 47.1327 16.4895L50.4787 0.0595703H53.9901L50.5423 17.1087H76.0849L76.2036 16.5621C76.2418 16.3827 76.2885 16.182 76.3436 15.9044C76.3987 15.6225 76.6023 14.7 76.8101 13.739C76.8101 13.739 77.0815 12.4877 77.1112 12.3638L77.2384 11.7873H66.1232V11.7787H60.6991C59.6305 11.7787 58.8713 11.5182 58.3794 10.9886L58.3115 10.916L58.2352 10.8221C57.862 10.3565 57.6542 9.80988 57.6076 9.19061C57.5864 8.89165 57.5736 8.53717 57.6373 8.16988C57.6754 7.94353 57.8154 7.32853 57.9129 6.87582V6.8502C57.9553 6.67509 57.9892 6.53415 58.0062 6.45301L58.2055 5.52197L58.2946 5.09915L58.3412 4.89415C58.4642 4.32186 58.5066 4.1553 58.5151 4.11686V4.10405C58.5872 3.83499 58.6635 3.5403 58.7526 3.25415C58.8459 2.95093 58.9646 2.65624 59.1046 2.37863C59.4354 1.72947 59.8976 1.1828 60.4786 0.759987C61.0851 0.31582 61.9163 0.089466 62.9383 0.089466H78.5276L77.7855 3.67269H62.1834L62.0647 4.21082C62.035 4.34749 62.0011 4.50124 61.9587 4.69342L61.8527 5.19311C61.8527 5.19311 61.8442 5.23155 61.8399 5.2529L61.7721 5.5604L61.4328 7.11499C61.3989 7.26874 61.3692 7.40967 61.3395 7.53353L61.2123 8.11009H75.6014V8.11863H77.7473C78.816 8.11863 79.5751 8.37915 80.067 8.90874L80.1349 8.98134L80.2112 9.0753C80.5844 9.54082 80.7922 10.0875 80.8389 10.7068C80.8601 11.0057 80.8728 11.3602 80.8092 11.7275C80.771 11.9496 80.6311 12.5731 80.5335 13.0258V13.0429C80.4911 13.218 80.4614 13.3589 80.4402 13.4401L80.419 13.5298C80.0034 15.4858 79.7744 16.5364 79.7405 16.6603V16.6731C79.6684 16.9422 79.5921 17.2326 79.503 17.5273C79.4097 17.8305 79.291 18.1295 79.151 18.4071C78.8202 19.0605 78.358 19.6072 77.777 20.0385C77.1706 20.487 76.3436 20.7133 75.3173 20.7133H50.237H50.254Z" fill="#2F3843"/>
                <path d="M7.05242 40.8761C4.9532 40.8761 3.27807 40.355 2.06943 39.3343C0.873516 38.3221 0.199223 36.8615 0.063516 34.9951C-0.101877 32.7487 0.326448 30.9207 0.534249 30.0452V30.0324C0.559694 29.947 0.576657 29.8701 0.58938 29.8018C0.682678 29.379 1.48844 26.099 1.76409 24.98C1.80226 24.8263 1.93373 24.728 2.09912 24.728H11.3272C12.2941 24.728 13.3585 24.8177 13.9183 25.4669C14.4484 26.0819 14.3848 27.0343 14.2406 27.9696C14.2194 28.0934 13.9268 29.5199 13.4942 31.6041V31.6254C13.4646 31.7963 13.3246 31.9116 13.1465 31.9116H10.3136C10.1609 31.9116 10.021 31.8475 9.93194 31.7407C9.86833 31.6596 9.80472 31.5187 9.85561 31.3051C9.97859 30.8054 10.2458 29.6096 10.3857 28.9818L10.5129 28.4052H4.71996L4.62242 28.7512C3.75729 31.8475 3.65551 33.5601 3.71912 34.4527C3.77849 35.277 4.05839 35.9432 4.57577 36.4856C5.18221 37.1263 6.46294 37.2587 7.42985 37.2587H13.4264L12.5782 40.8803H7.04818L7.05242 40.8761Z" fill="#2F3843"/>
                <path d="M31.0514 40.8763C29.9276 40.8763 29.1557 40.6072 28.6977 40.052C28.2228 39.4755 28.1082 38.6128 28.3542 37.4041C28.4306 37.024 28.5111 36.6396 28.5959 36.2595L28.9437 34.675L27.8071 35.8196C26.9463 36.6823 25.7334 37.9209 25.1906 38.4974C23.702 40.0734 21.976 40.8763 20.0507 40.8763C18.8293 40.8763 17.926 40.5602 17.3662 39.9367C16.781 39.2833 16.5689 38.3223 16.7174 36.9984C16.7725 36.5158 16.9167 35.636 17.0481 34.8587C17.1457 34.2779 17.2347 33.7355 17.2687 33.4621C17.3365 32.9368 17.8581 30.6306 18.1423 29.3877C18.2229 29.0418 18.2822 28.7727 18.3119 28.6318C18.9014 25.7405 20.233 24.7197 23.4094 24.7197H34.2744C34.4144 24.7197 34.5458 24.7838 34.6391 24.8991C34.7324 25.0101 34.7706 25.1511 34.7409 25.2749C34.5501 26.1334 32.8919 33.65 32.383 36.3748L32.3703 36.4432C32.3364 36.6183 32.3448 36.7549 32.3576 36.8361L32.4085 37.1863L32.7562 37.2375C32.8029 37.2461 32.8495 37.2461 32.9004 37.2461H35.6315L34.8385 40.8678H31.0514V40.8763ZM23.0235 28.3585C22.4722 28.3585 22.0566 28.6446 21.9718 29.0802V29.0931C21.8445 29.6696 20.7292 34.7647 20.3899 36.5371C20.373 36.6225 20.3645 36.6994 20.3645 36.7763V37.2546H20.8352C21.0939 37.2546 21.6367 37.135 22.3958 36.3236C22.9726 35.7043 28.4348 29.8234 29.054 29.1529L29.7961 28.3542H23.0277L23.0235 28.3585Z" fill="#2F3843"/>
                <path d="M60.1903 40.8761C60.0503 40.8761 59.9189 40.812 59.8256 40.6967C59.7323 40.5856 59.6941 40.449 59.7238 40.3208L62.2471 28.3497H58.1716L58.9392 24.728H64.2063C65.0587 24.728 65.5125 25.0697 65.7458 25.3558C66.1826 25.894 66.2716 26.7225 66.0214 27.8201C65.6101 29.5968 64.5626 34.7816 64.2488 36.3276L64.1003 37.0536L64.817 36.8828C67.1749 36.3191 69.1427 35.0549 70.6609 33.1159C72.5269 30.7371 73.7906 28.102 74.4098 25.2832L74.448 25.1039C74.4819 24.9458 74.6176 24.8391 74.7872 24.8391H77.5735C77.7134 24.8391 77.8449 24.9031 77.9382 25.0184C78.0315 25.1295 78.0696 25.2662 78.04 25.3943L78.0018 25.5779C77.4759 28.1063 76.5387 30.5065 75.224 32.7145C72.1282 37.8993 67.1537 40.8761 61.577 40.8761H60.1903Z" fill="#2F3843"/>
                <path d="M53.2818 40.8761C52.722 40.8761 52.2428 40.8077 51.8526 40.671C51.4625 40.5344 51.1572 40.3337 50.9281 40.0518C50.8179 39.9194 50.7288 39.7699 50.6567 39.6119C50.4489 39.1378 50.4065 38.5356 50.5168 37.7754L50.7416 36.7718L52.6287 28.3198L52.0096 28.3497C51.7 28.3668 51.1868 28.5376 50.4956 29.2807C50.1648 29.6352 48.1928 31.7578 46.2929 33.8035L42.7985 37.0622L42.0521 40.8803H38.617C38.477 40.8803 38.3456 40.8163 38.2523 40.7009C38.159 40.5899 38.1208 40.449 38.1505 40.3208V40.3123C38.2353 39.9407 38.6679 37.9804 39.1513 35.7511C39.6306 33.5388 40.2582 30.5962 40.5254 29.1526C40.5508 29.0074 40.5551 28.8707 40.5381 28.7554L40.483 28.4052L40.1352 28.3582C40.0886 28.354 40.0419 28.3497 39.991 28.3497H38.3074L39.1004 24.728H41.84C42.9639 24.728 43.7357 24.9971 44.1937 25.5523C44.6687 26.1246 44.7832 26.9916 44.5372 28.2002L44.3167 29.3363L43.9647 30.9933L45.0928 29.7847L45.114 29.7633C45.6017 29.2722 46.1021 28.764 46.4329 28.4223C46.9969 27.8457 47.4507 27.3802 47.7051 27.1069C49.1936 25.5309 50.9197 24.7323 52.845 24.7323C52.9086 24.7323 52.9722 24.7323 53.0358 24.7323C54.1597 24.7665 54.9993 25.0782 55.5252 25.6676C56.1104 26.3168 56.3225 27.282 56.1741 28.6059C56.1529 28.8024 56.1147 29.0843 56.0511 29.4644C55.9917 29.853 55.9196 30.2758 55.8433 30.7456C55.733 31.3991 55.6567 31.8774 55.6228 32.1379C55.5591 32.6632 55.0333 34.9695 54.7491 36.2123C54.711 36.3917 54.6728 36.5454 54.6431 36.6735L54.5074 37.2544H57.5269L56.7339 40.8761H53.2776H53.2818Z" fill="#2F3843"/>
                </g>
                <defs>
                <clipPath id="clip0_2001_1587">
                <rect width="81" height="41" fill="white"/>
                </clipPath>
                </defs>
                </svg>
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
              <router-link :to="{ name: 'home' }" class="text-lg font-bold  mx-3 text-black" style="line-height: 20px;" > {{ $t("home") }}</router-link>
            </li>
            <li class="hidden lg:block my-auto text-center py-1 lg:py-0">
              <router-link :to="{ name: 'about' }"  class="text-lg font-bold mx-3 text-black" style="line-height: 20px;"> {{ $t("about_us") }} </router-link>
            </li>
            <li class="my-auto text-center py-1 lg:py-0">
              <router-link :to="{ name: 'contactus' }"  class="text-lg font-bold mx-3 text-black" style="line-height: 20px;">{{ $t("تواصل معنا") }}</router-link>
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
              <router-link :to="{ name: 'home' }" class="text-lg font-extrabold px-3 text-[#A5ABB4]" style="line-height: 20px;" > {{ $t("home") }}</router-link>
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
    </template>
    <script setup>
    import { useParentStore } from "../../../stores/ParentStore";
    import { useI18n } from 'vue-i18n';
    import {useRouter} from "vue-router";

     
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import LocaleSelect from "../../../components/LocaleSelect.vue";
    const parentStore =useParentStore()
    const scrollContainer = ref(null);
    const { t } = useI18n();
    const content = ref(null);
    const staticDiv = ref(null);
    const router = useRouter()
    const visible = ref(false);
    let observer;
    const show=ref(true)
    const opennave=()=>{
      show.value=!(show.value)
    }
    const items = ref([
      { name:`${t("Profile_personly")}` , code: `${parentStore.parent.fname}`, icon:"pi pi-user" },
      { name:`${t("sign_out")}`, code: `${parentStore.parent.fname}`, icon: "pi pi-sign-out" },
     
     
    ]);

    const selectedItem = ref( { name: `${parentStore.parent.fname}`, code: `${parentStore.parent.fname}`, });
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
    border-bottom: 2px solid #FF2A5B;
    
    
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