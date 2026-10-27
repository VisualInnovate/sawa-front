<script setup>
import Nav from "../components/landingPageNav.vue";
import Footer from "../components/landingPageFooter.vue";
import AssistantChat from "../components/assistant/AssistantChat.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-1 mt-[72px]">
      <router-view />
    </main>
    <Footer />
    <!-- «مساعد سوا» for visitors: the academy's public information only, no sign-in. -->
    <AssistantChat kind="public" />
  </div>
</template>
