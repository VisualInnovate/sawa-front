<template>
  <div class="sawa-card profile-page">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="details">{{ $t("student_details") }}</Tab>
        <Tab value="requests">{{ $t("evaluation_order") }}</Tab>
        <Tab value="evaluations">{{ $t("Consultations_evaluations") }}</Tab>
      </TabList>
      <TabPanels>
        <!-- Each tab loads its data the first time it is opened, then stays mounted. -->
        <TabPanel value="details"><Details v-if="opened.has('details')" /></TabPanel>
        <TabPanel value="requests"><Requests v-if="opened.has('requests')" /></TabPanel>
        <TabPanel value="evaluations"><Evaluation v-if="opened.has('evaluations')" /></TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import Details from "../../components/profile/Details.vue";
import Evaluation from "../../components/profile/Evaluation.vue";
import Requests from "../../components/profile/Requests.vue";
import { resetUserProfile } from "../../components/profile/userProfile";

resetUserProfile();

const activeTab = ref("details");
const opened = reactive(new Set(["details"]));

watch(activeTab, (tab) => opened.add(tab));
</script>
