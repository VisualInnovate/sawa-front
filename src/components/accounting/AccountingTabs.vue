<script setup>
// The links between the accounting pages.
import NavTabs from "@/components/common/NavTabs.vue";

const items = [
  { to: { name: "accounting" }, label: "acc.dashboard", perm: "accounting list" },
  { to: { name: "accounting-programs" }, label: "acc.programs", perm: "accounting list" },
  { to: { name: "accounting-evaluations" }, label: "acc.evaluations", perm: "accounting list" },
  { to: { name: "accounting-accounts" }, label: "acc.accounts", perm: "accounting list" },
  { to: { name: "accounting-payments" }, label: "acc.payments", perm: "accounting list" },
  { to: { name: "accounting-charges" }, label: "acc.charges", perm: "accounting list" },
  { to: { name: "accounting-credits" }, label: "acc.credits", perm: "accounting list" },
  { to: { name: "accounting-reports" }, label: "acc.reports.menu", perm: "accounting reports list" },
  { to: { name: "accounting-settings" }, label: "acc.settings", perm: "accounting settings edit" },
];
</script>

<template>
  <NavTabs :items="items" />
</template>
