<script setup>
// The child profile's «المالية» tab: the child's account (charges, receipts, money back).
import ChildTaps from "@/components/ChildTaps.vue";
import ChildStatement from "@/components/accounting/ChildStatement.vue";

const childId = localStorage.getItem("child_id");
</script>

<template>
  <div>
    <ChildTaps />
    <ChildStatement v-if="childId" :childId="childId" />
    <Toast />
  </div>
</template>
