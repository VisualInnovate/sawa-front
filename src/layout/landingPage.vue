<script setup>
import Nav from "../components/landingPageNav.vue";
import Footer from "../components/landingPageFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-1 mt-[72px]">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
