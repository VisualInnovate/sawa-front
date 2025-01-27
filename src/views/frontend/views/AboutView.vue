<template>
  <nave />
  <div class="bg-white auctions">
    <div class="px-[2%] py-[3%] m-auto pt-[5%] max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div class="p-4">
        <h2 class="text-[#EB477C] font-bold text-2xl">من نحن</h2>
        <p class="text-[#7B7B7B] text-lg leading-8 py-4">
          هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل
          الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها. ولذلك يتم استخدام طريقة لوريم إيبسوم
          لأنها تعطي توزيعاَ طبيعياَ -إلى حد ما- للأحرف عوضاً عن استخدام "هنا يوجد محتوى نصي، هنا يوجد
          محتوى نصي"
        </p>
      </div>

      <div class="hidden lg:block m-auto">
        <img class="bottom-0 m-auto" src="../image/sec1/113.png" alt="A group of People" />
      </div>
    </div>
  </div>
  <div class="bg-white auctions">
    <div class="px-[2%] py-[3%] m-auto pt-[5%] max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div class="p-4">
        <h2 class="text-[#135C65] font-bold text-2xl"> ماذا نقدم لطفلك</h2>
        <h3 class="text-[#7B7B7B]  text-base py-2">هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء</h3>
        <div v-for="x in 5" class="flex py-3" :key="x">
          <p>
            <svg
              width="40"
              height="41"
              viewBox="0 0 40 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_6_1005)">
                <path
                  d="M14.6434 40.2815L11.515 35.0126L5.58757 33.6954L6.16386 27.6033L2.12988 22.993L6.16386 18.3828L5.58757 12.2907L11.515 10.9735L14.6434 5.70459L20.2416 8.09204L25.8398 5.70459L28.9682 10.9735L34.8956 12.2907L34.3193 18.3828L38.3533 22.993L34.3193 27.6033L34.8956 33.6954L28.9682 35.0126L25.8398 40.2815L20.2416 37.8941L14.6434 40.2815ZM18.5128 28.8382L27.8156 19.5354L25.5105 17.1479L18.5128 24.1456L14.9727 20.6879L12.6676 22.993L18.5128 28.8382Z"
                  fill="#4D7EFF"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_1005">
                  <rect
                    width="39.5165"
                    height="39.5165"
                    fill="white"
                    transform="matrix(-1 0 0 1 40 0.765137)"
                  />
                </clipPath>
              </defs>
            </svg>
          </p>
          <p class="my-auto text-lg font-bold text-[#222222] px-2">برامج تعليمية متخصصة</p>
        </div>
      </div>

      <!-- Background Image -->
      <div
        :style="{ backgroundImage: `url(${img})` }"
        class="hidden lg:block m-auto bg-cover bg-center"
      ></div>
    </div>
  </div>
  <about />
</template>

<script setup>
import Nave from "../components/Nave.vue";
import About from "../components/About.vue";
import Nave1 from "../components/Nave1.vue";
import img from "../image/about2.png";

const image = img; 
</script>
