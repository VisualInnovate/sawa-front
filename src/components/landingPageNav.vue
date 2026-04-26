<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);

const pages = ref([
  { name: "الرئيسية", href: "/" },
  { name: "من نحن", href: "/about-us" },
  { name: "البرامج", href: "/programs" },
  { name: "الاقسام العلاجية", href: "/therapeutic" },
  { name: "رحلة الطفل", href: "/journey" },
  { name: "الدمج والتطوير", href: "/integration" },
  { name: "الخدمات", href: "/services" },
  { name: "تواصل معنا", href: "/contact" },
]);

const navigate = (href) => {
  router.push(href);
  isMenuOpen.value = false;
};
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 shadow-[0_10px_40px_0_rgba(28,103,114,0.08)] backdrop-blur-[12px] bg-white/80"
    dir="rtl"
  >
    <!-- Main bar -->
    <div
      class="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8 h-[72px] flex items-center justify-between"
    >
      <!-- Logo -->
      <img
        src="./../views/frontend/views/main/images/logo.png"
        alt="Sawa Academy"
        class="h-[48px] w-auto shrink-0"
      />

      <!-- Desktop nav links — only shown at xl+ (1280px) where 8 items + 3 buttons fit -->
      <div
        class="hidden xl:flex items-center gap-3 2xl:gap-5 flex-1 justify-center"
      >
        <a
          v-for="page in pages"
          :key="page.name"
          @click="navigate(page.href)"
          class="cursor-pointer text-[#475569] text-sm 2xl:text-base whitespace-nowrap hover:text-[#B21553] transition-colors duration-200 px-1"
          :class="
            route.path === page.href
              ? 'text-[#B21553] border-b-2 border-[#B21553] pb-0.5'
              : ''
          "
          >{{ page.name }}</a
        >
      </div>

      <!-- Desktop action buttons -->
      <div class="hidden xl:flex items-center gap-2 shrink-0">
        <a
          @click="navigate('web/parent/register')"
          class="cursor-pointer text-[#B21553] font-bold text-sm px-4 py-2 rounded-lg border border-[#B21553] hover:bg-pink-50 transition-colors duration-200 whitespace-nowrap"
          >انشاء حساب</a
        >
        <a
          @click="navigate('web/parent/login')"
          class="cursor-pointer bg-[#deb413] text-white font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
          >تسجيل الدخول</a
        >
        <a
          @click="navigate('/web/evaluation')"
          class="bg-[#B21553] cursor-pointer text-white font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
          >احجز الآن</a
        >
      </div>

      <!-- Hamburger — shown below xl -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="xl:hidden p-2 rounded-lg text-[#475569] hover:text-[#B21553] hover:bg-gray-100 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <svg
          v-if="!isMenuOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile / tablet dropdown -->
    <div
      class="xl:hidden overflow-hidden transition-all duration-300 ease-in-out"
      :class="isMenuOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'"
    >
      <div
        class="bg-white/98 backdrop-blur-sm border-t border-gray-100 px-4 pt-2 pb-5 flex flex-col gap-0.5"
      >
        <a
          v-for="page in pages"
          :key="page.name + '-m'"
          @click="navigate(page.href)"
          class="cursor-pointer text-[#475569] text-base py-3 px-4 rounded-lg hover:bg-gray-50 hover:text-[#B21553] transition-colors duration-200 flex items-center justify-end min-h-[44px]"
          :class="
            route.path === page.href
              ? 'text-[#B21553] bg-pink-50 font-medium'
              : ''
          "
          >{{ page.name }}</a
        >

        <div class="flex flex-col gap-2 mt-3 pt-4 border-t border-gray-100">
          <a
            href="#"
            class="text-center text-[#B21553] font-bold text-base py-3 rounded-lg border border-[#B21553] hover:bg-pink-50 transition-colors duration-200"
            >انشاء حساب</a
          >
          <a
            href="#"
            class="text-center bg-[#deb413] text-white font-bold text-base py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
            >تسجيل الدخول</a
          >
          <a
            href="#"
            class="text-center bg-[#B21553] text-white font-bold text-base py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
            >احجز الآن</a
          >
        </div>
      </div>
    </div>
  </nav>
</template>
