<!-- <template>
    <div class=" m-auto md:grid md:grid-cols-3" >
        <div class="aa m-2 border-2 border-neutral-300 border-solid rounded-3xl relative truncate" v-for="(e,i) in cardinfo" :key="i">
            <div><img></div>
            <div class="flex justify-between p-4  text-center">
                <button>
                    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#00A9DE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></circle> <path d="M7 12H17M7 12L11 8M7 12L11 16" stroke="#00A9DE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </button>
                <p style="color:#135C65 ;" class=" text-2xl font-bold tracking-wide	 ">{{e.name}}</p>
            </div>
            <div class="ee flex-wrap w-[50%] h-[87%] top-[0%] left-[50%] bg-white  absolute  translate-x-[100%] "><p class=""> يمكنك من هنا تسجيل طلفك حتي  تتنكمن من التواصل معه</p></div>
        </div>
    </div>

</template>
<script>
export default {
    data(){
        return{
            cardinfo:this.$attrs.carddeta
        }
    },
}
</script> -->
<template>
  <div class="m-auto grid grid-row-3 md:grid-cols-3 gap-3 py-[5%]">
    <div class="animate relative w-full">
      <div class="sawa-card mx-auto w-full rounded-xl">
        <div>
          <div class="animte right-0 absolute m-auto h-full w-[50%] bg-white">
            <div class="inner p-[10%] m-auto h-full w-full text-[#A5E9FF]">
              <p class="w-full h-full m-auto text-center">
                اكاديمه سوا للتربيه
              </p>
            </div>
          </div>
          <img class="imge" src="../image/sec1/1.png" />
        </div>

        <div class="sawa-card-actions ssc">
          <router-link
            :to="{ name: 'Edit' }"
            class="text-xl lg:text-2xl p-2 text-[#135C65] z-10"
          >
            {{ $t("evaluation_result") }}
          </router-link>
          <span class="flex-1"></span>
          <router-link
            :to="{ name: 'Edit' }"
           
          >
          <span class="card-arrow" aria-hidden="true"><i class="pi pi-arrow-left"></i></span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="animate relative">
      <div class="sawa-card mx-auto rounded-xl">
        <div class="">
          <div class="animte right-0 absolute m-auto h-full w-[50%] bg-white">
            <div class="inner p-[10%] m-auto h-full w-full text-[#A5E9FF]">
              <p class="w-full h-[50%] pt-[20%] text-center">
                اكاديمه سوا للتربيه
              </p>
            </div>
          </div>
          <img class="imge" src="../image/header/2.png" />
        </div>

        <div class="sawa-card-actions">
          <router-link
            :to="{ name: 'clidreen_parents' }"
            class="text-xl lg:text-2xl p-2 text-[#135C65] z-10"
          >
            {{ $t("Book_an_appointment") }}
          </router-link>
          <span class="flex-1"></span>
          <router-link
            :to="{ name: 'clidreen_parents' }"
           
          >
          <span class="card-arrow" aria-hidden="true"><i class="pi pi-arrow-left"></i></span>
          </router-link>
         
        </div>
      </div>
    </div>
    <div class="animate relative">
      <div class="sawa-card mx-auto rounded-xl">
        <div class="w-full">
          <div class="animte right-0 absolute m-auto h-full w-[50%] bg-white">
            <div class="inner p-[10%] m-auto h-full w-full text-[#A5E9FF]">
              <p class="w-full h-full text-center">اكاديمه سوا للتربيه</p>
            </div>
          </div>
          <img class="imge w-full" src="../image/header/3.png" />
        </div>

        <div class="sawa-card-actions">
          <router-link
            :to="{ name: 'ReAction' }"
            class="lg:text-2xl text-xl p-2 text-[#135C65] z-10"
          >
            {{ $t("Register_your_child") }}
          </router-link>
          <span class="flex-1"></span>
          <router-link
            :to="{ name: 'ReAction' }"
           
          >
          <span class="card-arrow" aria-hidden="true"><i class="pi pi-arrow-left"></i></span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style scoped>
.card-arrow {
  display: inline-grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 2px solid #135c65;
  color: #135c65;
  background: #fff;
}
[dir="ltr"] .card-arrow .pi {
  transform: scaleX(-1);
}

.animte {
  transform: translateX(100%);
  transition: 0.8s;
}
.animate:hover .animte {
  transform: translateX(0%);
}
.animate:hover .imge {
  transform: translateX(-50%);
  transition: 0.8s;
}
</style>
