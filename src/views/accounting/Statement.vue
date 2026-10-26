<script setup>
// «كشف حساب» of one child.
import { useRoute } from "vue-router";
import AccountingTabs from "@/components/accounting/AccountingTabs.vue";
import ChildStatement from "@/components/accounting/ChildStatement.vue";
import BackButton from "@/components/common/BackButton.vue";

const route = useRoute();
</script>

<template>
  <div>
    <div class="flex items-center gap-2 p-4">
      <BackButton />
      <p class="text-xl text-[#135C65] font-bold m-0">{{ $t("acc.statement") }}</p>
    </div>
    <AccountingTabs />
    <ChildStatement :childId="route.params.child" />
    <Toast />
  </div>
</template>
