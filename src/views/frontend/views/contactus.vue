
  <template>
    <nave />
      <!-- banner -->
      <div  class="banner flex items-center h-[35vh] lg:h-[55vh] relative ">
    <div class="absolute bg-gradient-to-r from-[#74dbc7] to-[#618990] opacity-40 w-full h-full z-50"></div>
    <img class="w-full absolute h-full" src="../image/112.png">
    <div class="z-50 text-white m-auto w-[80%] ">
      <H1 class="font-bold text-5xl text-white z-50">{{ $t("تواصل معنا") }}</H1>
     <div class="flex py-8 ">
      <p class="text-2xl font-semibold "> {{ $t("home") }}</p>
      <svg class="my-auto mx-[1%] ltr:rotate-180" width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.999878 6.49976L16.9999 6.49976" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5.99972 11.5C5.99972 11.5 0.999767 7.81756 0.999756 6.49996C0.999744 5.18237 5.99976 1.5 5.99976 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p class="text-2xl font-semibold "> {{ $t("تواصل معنا") }}</p>
     </div>
    </div>
   </div>

    <div >
      <div class="max-w-[1300px] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 py-[4%] ">
        <div class="bg-[#C82F60] p-5 rounded-xl m-1 animate__animated animate__backInRight animate__delay-1s">
          <p class="text-[#F8F8F8] text-lg font-bold">تواصل معنا</p>
          <p class="text-[#F8F8F8] text-base pt-1">اشعر بالراحه فالتواصل معنا في اي وقت</p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            <div>
              <InputText required class="bg-[#f7f5f5] text-center w-full"  v-model="fname" :placeholder='$t("first_name")' />
            </div>
            <div>
              <InputText required class="bg-[#f7f5f5] text-center w-full"  v-model="fname" :placeholder='$t("family_name")' />
            </div>
            <div>
              <InputText required class="bg-[#f7f5f5] text-center w-full" type="email" v-model="fname" :placeholder='$t("email")' />
            </div>
            <div>
              <InputText required class="bg-[#f7f5f5] text-center w-full"  v-model="fname" :placeholder='$t("Mobile_number")' />
            </div>
            <div class="lg:col-span-2"  >
              <textarea v-model="message" id="message" name="message" rows="7" class="mt-1 p-2 block w-full bg-[#f7f5f5] border rounded-md shadow-sm focus:ring focus:ring-indigo-300 focus:border-indigo-300"></textarea>

            </div>
            <div class="lg:col-span-2 text-center">
              <Button label="ارسل رسالتك"  class="create w-[50%] m-auto"></Button>
            </div>
           
          </div>
        </div>

        <div  class=" py-2 px-5 animate__animated animate__backInLeft animate__delay-1s">
          <div  class="border flex justify-between rounded-2xl mb-3 p-2 shadow">
            <div class="p-4 w-20 h-20 border flex rounded-full justify-center"><svg width="48" class="" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M46 45.5H2C1.18 45.5 0.5 44.82 0.5 44C0.5 43.18 1.18 42.5 2 42.5H46C46.82 42.5 47.5 43.18 47.5 44C47.5 44.82 46.82 45.5 46 45.5Z" fill="#135C65"/>
                <path d="M39.5605 45.5201C38.7405 45.5201 38.0605 44.8401 38.0605 44.0201V35.1001C38.0605 34.2801 38.7405 33.6001 39.5605 33.6001C40.3805 33.6001 41.0605 34.2801 41.0605 35.1001V44.0201C41.0605 44.8401 40.4005 45.5201 39.5605 45.5201Z" fill="#135C65"/>
                <path d="M39.6002 36.6C36.3402 36.6 33.7002 33.96 33.7002 30.7V26.16C33.7002 22.9 36.3402 20.26 39.6002 20.26C42.8602 20.26 45.5002 22.9 45.5002 26.16V30.7C45.5002 33.96 42.8602 36.6 39.6002 36.6ZM39.6002 23.28C38.0002 23.28 36.7002 24.5801 36.7002 26.1801V30.72C36.7002 32.32 38.0002 33.62 39.6002 33.62C41.2002 33.62 42.5002 32.32 42.5002 30.72V26.1801C42.5002 24.5801 41.2002 23.28 39.6002 23.28Z" fill="#135C65"/>
                <path d="M28.5996 45.5C27.7796 45.5 27.0996 44.82 27.0996 44V12.0601C27.0996 8.88006 25.7596 7.52002 22.6396 7.52002H10.1797C7.03969 7.52002 5.67969 8.88006 5.67969 12.0601V44C5.67969 44.82 4.99969 45.5 4.17969 45.5C3.35969 45.5 2.67969 44.82 2.67969 44V12.0601C2.67969 7.20006 5.33969 4.52002 10.1797 4.52002H22.6396C27.4596 4.52002 30.0996 7.20006 30.0996 12.0601V44C30.0996 44.82 29.4196 45.5 28.5996 45.5Z" fill="#135C65"/>
                <path d="M21.4996 18H11.5996C10.7796 18 10.0996 17.32 10.0996 16.5C10.0996 15.68 10.7796 15 11.5996 15H21.4996C22.3196 15 22.9996 15.68 22.9996 16.5C22.9996 17.32 22.3196 18 21.4996 18Z" fill="#135C65"/>
                <path d="M21.4996 25.5H11.5996C10.7796 25.5 10.0996 24.82 10.0996 24C10.0996 23.18 10.7796 22.5 11.5996 22.5H21.4996C22.3196 22.5 22.9996 23.18 22.9996 24C22.9996 24.82 22.3196 25.5 21.4996 25.5Z" fill="#135C65"/>
                <path d="M16.5 45.5C15.68 45.5 15 44.82 15 44V36.5C15 35.68 15.68 35 16.5 35C17.32 35 18 35.68 18 36.5V44C18 44.82 17.32 45.5 16.5 45.5Z" fill="#135C65"/>
                </svg>
            </div>
            <div class="w-[80%] mx-2">
              <p class="text-2xl font-bold">معلومات الشركة :</p>
              <p class="py-1 text-[#989898] text-xl"> فريق اكاديميه سوا</p>
              <p class=" text-[#135C65] text-xl">+962-65522688</p>
            </div>
            <p></p>
          </div>
          <div  class="border flex justify-between rounded-2xl mb-3 p-2 shadow">
            <div class="p-4 w-20 h-20 border flex rounded-full justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.9998 28.34C19.7398 28.34 16.2598 24.88 16.2598 20.6C16.2598 16.32 19.7398 12.88 23.9998 12.88C28.2598 12.88 31.7398 16.34 31.7398 20.62C31.7398 24.9 28.2598 28.34 23.9998 28.34ZM23.9998 15.88C21.3998 15.88 19.2598 18 19.2598 20.62C19.2598 23.24 21.3798 25.36 23.9998 25.36C26.6198 25.36 28.7398 23.24 28.7398 20.62C28.7398 18 26.5998 15.88 23.9998 15.88Z" fill="#135C65"/>
              <path d="M23.9999 45.52C21.0399 45.52 18.0599 44.4 15.7399 42.18C9.83986 36.5 3.31986 27.44 5.77986 16.66C7.99986 6.88 16.5399 2.5 23.9999 2.5C23.9999 2.5 23.9999 2.5 24.0199 2.5C31.4799 2.5 40.0199 6.88 42.2399 16.68C44.6799 27.46 38.1599 36.5 32.2599 42.18C29.9399 44.4 26.9599 45.52 23.9999 45.52ZM23.9999 5.5C18.1799 5.5 10.6999 8.6 8.71986 17.32C6.55986 26.74 12.4799 34.86 17.8399 40C21.2999 43.34 26.7199 43.34 30.1799 40C35.5199 34.86 41.4399 26.74 39.3199 17.32C37.3199 8.6 29.8199 5.5 23.9999 5.5Z" fill="#135C65"/>
              </svg>
            </div>
            <div class="w-[80%] mx-2">
              <p class="text-2xl font-bold"> العنوان :</p>
              <p class="py-1 text-[#989898] text-xl"> أكاديمية سوا للتربية الخاصة عمان-الرابيه-شارع ميسلون</p>
            </div>
            <p></p>
          </div>
         
          <div  class="border flex justify-between rounded-2xl mb-3 p-2 shadow">
            <div class="p-4 w-20 h-20 border flex rounded-full justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.9 45.5C32.64 45.5 30.26 44.96 27.8 43.92C25.4 42.9 22.98 41.5 20.62 39.8C18.28 38.08 16.02 36.16 13.88 34.06C11.76 31.92 9.84 29.66 8.14 27.34C6.42 24.94 5.04 22.54 4.06 20.22C3.02 17.74 2.5 15.34 2.5 13.08C2.5 11.52 2.78 10.04 3.32 8.66C3.88 7.24 4.78 5.92 6 4.78C7.54 3.26 9.3 2.5 11.18 2.5C11.96 2.5 12.76 2.68 13.44 3C14.22 3.36 14.88 3.9 15.36 4.62L20 11.16C20.42 11.74 20.74 12.3 20.96 12.86C21.22 13.46 21.36 14.06 21.36 14.64C21.36 15.4 21.14 16.14 20.72 16.84C20.42 17.38 19.96 17.96 19.38 18.54L18.02 19.96C18.04 20.02 18.06 20.06 18.08 20.1C18.32 20.52 18.8 21.24 19.72 22.32C20.7 23.44 21.62 24.46 22.54 25.4C23.72 26.56 24.7 27.48 25.62 28.24C26.76 29.2 27.5 29.68 27.94 29.9L27.9 30L29.36 28.56C29.98 27.94 30.58 27.48 31.16 27.18C32.26 26.5 33.66 26.38 35.06 26.96C35.58 27.18 36.14 27.48 36.74 27.9L43.38 32.62C44.12 33.12 44.66 33.76 44.98 34.52C45.28 35.28 45.42 35.98 45.42 36.68C45.42 37.64 45.2 38.6 44.78 39.5C44.36 40.4 43.84 41.18 43.18 41.9C42.04 43.16 40.8 44.06 39.36 44.64C37.98 45.2 36.48 45.5 34.9 45.5ZM11.18 5.5C10.08 5.5 9.06 5.98 8.08 6.94C7.16 7.8 6.52 8.74 6.12 9.76C5.7 10.8 5.5 11.9 5.5 13.08C5.5 14.94 5.94 16.96 6.82 19.04C7.72 21.16 8.98 23.36 10.58 25.56C12.18 27.76 14 29.9 16 31.92C18 33.9 20.16 35.74 22.38 37.36C24.54 38.94 26.76 40.22 28.96 41.14C32.38 42.6 35.58 42.94 38.22 41.84C39.24 41.42 40.14 40.78 40.96 39.86C41.42 39.36 41.78 38.82 42.08 38.18C42.32 37.68 42.44 37.16 42.44 36.64C42.44 36.32 42.38 36 42.22 35.64C42.16 35.52 42.04 35.3 41.66 35.04L35.02 30.32C34.62 30.04 34.26 29.84 33.92 29.7C33.48 29.52 33.3 29.34 32.62 29.76C32.22 29.96 31.86 30.26 31.46 30.66L29.94 32.16C29.16 32.92 27.96 33.1 27.04 32.76L26.5 32.52C25.68 32.08 24.72 31.4 23.66 30.5C22.7 29.68 21.66 28.72 20.4 27.48C19.42 26.48 18.44 25.42 17.42 24.24C16.48 23.14 15.8 22.2 15.38 21.42L15.14 20.82C15.02 20.36 14.98 20.1 14.98 19.82C14.98 19.1 15.24 18.46 15.74 17.96L17.24 16.4C17.64 16 17.94 15.62 18.14 15.28C18.3 15.02 18.36 14.8 18.36 14.6C18.36 14.44 18.3 14.2 18.2 13.96C18.06 13.64 17.84 13.28 17.56 12.9L12.92 6.34C12.72 6.06 12.48 5.86 12.18 5.72C11.86 5.58 11.52 5.5 11.18 5.5ZM27.9 30.02L27.58 31.38L28.12 29.98C28.02 29.96 27.94 29.98 27.9 30.02Z" fill="#135C65"/>
              <path d="M37 19.5C36.18 19.5 35.5 18.82 35.5 18C35.5 17.28 34.78 15.78 33.58 14.5C32.4 13.24 31.1 12.5 30 12.5C29.18 12.5 28.5 11.82 28.5 11C28.5 10.18 29.18 9.5 30 9.5C31.94 9.5 33.98 10.54 35.76 12.44C37.42 14.22 38.5 16.4 38.5 18C38.5 18.82 37.82 19.5 37 19.5Z" fill="#135C65"/>
              <path d="M44 19.5C43.18 19.5 42.5 18.82 42.5 18C42.5 11.1 36.9 5.5 30 5.5C29.18 5.5 28.5 4.82 28.5 4C28.5 3.18 29.18 2.5 30 2.5C38.54 2.5 45.5 9.46 45.5 18C45.5 18.82 44.82 19.5 44 19.5Z" fill="#135C65"/>
              </svg>
            </div>
            <div class="w-[80%] mx-2">
              <p class="text-2xl font-bold"> تواصل الان : </p>
              <p class="py-1 text-[#989898] text-xl"> We Always Happy To Help </p>
              <p class=" text-[#135C65] text-xl">  0791017001-065522688  </p>
            </div>
            <p></p>
          </div>
          <div  class="border flex justify-between rounded-2xl mb-3 p-2 shadow">
            <div class="p-4 w-20 h-20 border flex rounded-full justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 44.6398C15.44 44.6398 14.86 44.4998 14.34 44.2198C13.2 43.6199 12.5 42.4198 12.5 41.1398V38.2999C6.46 37.6799 2.5 33.2398 2.5 26.8798V14.8799C2.5 7.99988 7.12 3.37988 14 3.37988H34C40.88 3.37988 45.5 7.99988 45.5 14.8799V26.8798C45.5 33.7598 40.88 38.3798 34 38.3798H26.46L17.9399 44.0599C17.3599 44.4399 16.68 44.6398 16 44.6398ZM14 6.35986C8.84 6.35986 5.5 9.69986 5.5 14.8599V26.86C5.5 32.02 8.84 35.36 14 35.36C14.82 35.36 15.5 36.04 15.5 36.86V41.12C15.5 41.38 15.66 41.4999 15.76 41.5599C15.86 41.6199 16.06 41.6799 16.28 41.5399L25.1801 35.62C25.4201 35.46 25.72 35.36 26.02 35.36H34.02C39.18 35.36 42.52 32.02 42.52 26.86V14.8599C42.52 9.69986 39.18 6.35986 34.02 6.35986H14Z" fill="#135C65"/>
              <path d="M23.9996 24.22C23.1796 24.22 22.4996 23.54 22.4996 22.72V22.3C22.4996 19.98 24.1996 18.84 24.8396 18.4C25.5796 17.9 25.8196 17.56 25.8196 17.04C25.8196 16.04 24.9996 15.22 23.9996 15.22C22.9996 15.22 22.1797 16.04 22.1797 17.04C22.1797 17.86 21.4997 18.54 20.6797 18.54C19.8597 18.54 19.1797 17.86 19.1797 17.04C19.1797 14.38 21.3396 12.22 23.9996 12.22C26.6596 12.22 28.8196 14.38 28.8196 17.04C28.8196 19.32 27.1397 20.46 26.5197 20.88C25.7397 21.4 25.4996 21.74 25.4996 22.3V22.72C25.4996 23.56 24.8196 24.22 23.9996 24.22Z" fill="#135C65"/>
              <path d="M24 29.2C23.16 29.2 22.5 28.52 22.5 27.7C22.5 26.88 23.18 26.2 24 26.2C24.82 26.2 25.5 26.88 25.5 27.7C25.5 28.52 24.84 29.2 24 29.2Z" fill="#135C65"/>
              </svg>

            </div>
            <div class="w-[80%] mx-2">
              <p class=" text-2xl font-bold">الدعم :  </p>
              <p class="py-1 text-[#989898] text-xl">Email us for general queries, including marketing and partnership opportunities. </p>
              <p class=" text-[#135C65] text-xl">info@sawa.acadey</p>
            </div>
            <p></p>
          </div>
        </div>

      </div>


    </div>
    <div>

    </div>
 
    <About />
    



</template>
<script setup(props) { }>
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import Nave1 from "../components/Nave1.vue";

export default {
components: {
Nave,
About,
Nave1,

},
data() {
      return {
       fname: '',
       lname: '',
       number: '',
        email: '',
        message: ''
      };
    },
    methods: {
      submitForm() {
        // Here you can implement the logic to submit the form data to your backend or perform any other desired actions.
        console.log('Form submitted:', this.name, this.email, this.message);
        // Reset the form fields after submission
        this.name = '';
        this.email = '';
        this.message = '';
      }
    }
};
</script>


  