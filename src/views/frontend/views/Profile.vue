<template>
  <div class="">
    <Nave />
    <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t("المعلومات الشخصيه") }}</H1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ $t("المعلومات الشخصيه") }}</p>
     </div>
    </div>
   </div>

    <div class="bg-white auctions px-[2%] py-[3%] pt-[5%] ">
    <p class="text-3xl font-bold max-w-[1280px]  p-4  m-auto">المعلومات الشخصيه</p>
    <form  @submit.prevent="updateProfile"  class="max-w-[1280px] shadow-md grid grid-cols-1 p-4 lg:grid-cols-6 gap-4  m-auto">
      <div class="col-span-4">
        <div class=" py-1 relative ">
                  <div class="flex ">
                  <p class="py-2 font-bold text-[#303843]" for="username"> {{ $t("first_name") }}</p>
             
                </div>
                <div class="relative ">
                  <InputText v-model="parent.fname"  required class="bg-[#f7f5f5] w-full "  :placeholder='$t("first_name")'  />
                </div>

          </div>
          <div class=" py-1 relative ">
                  <div class="flex ">
                  <p class="py-2 font-bold text-[#303843]" for="username"> {{ $t("family_name") }}</p>
       
                </div>
                <div class="relative ">
                  <InputText v-model="parent.lname"  required class="bg-[#f7f5f5] w-full "  :placeholder='$t("family_name")'  />
                </div>

          </div>
        
              <div class=" py-1 relative ">
                  <div class="flex ">
                  <p class="py-2 font-bold text-[#303843]" for="username">  {{ $t("email") }}</p>
                  
                </div>
                <div class="relative ">
                  <InputText  v-model="parent.email"  type="email" required class="bg-[#303843] w-full "  :placeholder='$t("email")'  />
                </div>
              </div>
            
             
              <div class=" py-1 w-full relative ">
                  <div class="flex w-full">
                  <p class="py-2 font-bold text-[#303843]" for="username">  كلمة المرور</p>
               
                </div>
                <div class="relative w-full">
                  <Password  v-model="parent.Password" class="w-full" toggleMask   placeholder="  أكتب كلمة المرور "/>
                </div>
              </div>
              

              <div class=" flex-column gap-2 py-1 hidden">
                  <label class="w-full " for="username">{{ $t('personal_image') }}</label>

                  <InputText name="file"  ref="file" @change="uploadFile" accept="image/*" id="filr"   type="file" class="w-full" />

            </div>
            <div class="flex justify-between ">
              <Button type="submit" :label='$t("تعديل")'  class="mt-3   w-[40%] mx-auto  lg:mb-0 bg focus:ring-0 create "></Button>
              <Button @click="parentStore.logout" :label='$t("sign_out")'  class="mt-3   w-[40%] mx-auto  lg:mb-0 bg focus:ring-0 delete "></Button>

            </div>
      </div>
      <div class="col-span-2 mx-auto">
        <div class="rounded-full" style="border: 5px solid #135C65;">

                 <div ><img onclick="document.getElementById('filr').click()" class="hidden m-auto rounded-full" style="width: 200px ;height: 200px;" v-if="parent?.image"  :src="parent?.image" >
                    <div  class="m-auto rounded-full bg-no-repeat bg-cover" style="width: 200px ;height: 200px;" :style="{ backgroundImage: `url(${parent?.image})` }"></div>

                  </div>

          </div>
         <div class="mx-auto text-center w-full">
          <Button
                onclick="document.getElementById('filr').click()"
            
                :label='$t("تعديل")'
                class="mt-3   w-[90%] mx-auto  lg:mb-0 bg focus:ring-0 create ">
            </Button>
         </div>
         <div class="mx-auto text-center w-full">
         </div>

      </div>

    </form>
   </div>

   
    <About />
  </div>
</template>
<script>
import Nave from "../components/Nave.vue";
import Sidbar from "../components/Sidbar.vue";
import About from "../components/About.vue";
import Knob from "primevue/knob";
import FileUpload from "primevue/fileupload";
import { useParentStore } from "../../../stores/ParentStore";
import axios from "axios";

export default {
  components: { Nave, Sidbar, About, Knob, FileUpload },
  data() {
    return {
      imageSrc: null,
      image: null,
      parentStore: useParentStore(),
      parent: {},
   
    };
  },
  methods: {

    getUserProfile() {
      axios
        .get("/api/parent/user")
        .then((res) => {
          this.parent = res.data.user;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    uploadFile (e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.parent.image = e.target.result;
        this.parent.file = image;
      };
    },
    updateProfile() {

      const formData = new FormData();

      formData.append("fname", this.parent.fname);
      formData.append("lname", this.parent.lname);
      formData.append("email", this.parent.email);
      formData.append("image", this.parent.file);
      formData.append("Password", this.parent.Password);


      axios
        .post("/api/parent/profile", formData)
        .then((res) => {
          
        })
        .catch((err) => {
         
        });
    },
  },
  computed: {
    imageClass() {
      // Return a string of Tailwind CSS classes to set the width of the image
      return this.imageSrc ? ["w-40", "h-0"] : ""; // Adjust the 'w-64' class to set the desired width
    },
   
  },
  mounted() {
    this.getUserProfile();
  },
};
</script>
<style>
.uploaded-image {
  width: 101px;
  height: 101px;
}
.p-inputtext:enabled {
  width: 100% !important;
}
</style>
