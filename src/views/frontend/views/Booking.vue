<template>
  <Nave />
  <AppointmentRecords />
  <About />
</template>
<script setup(props) { }>
import Nave from "../components/Nave.vue";
import AppointmentRecords from "../components/AppointmentRecords.vue";
import About from "../components/About.vue";

export default {
  components: { Nave, AppointmentRecords, About },
};
</script>
