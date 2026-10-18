<script setup>
// «رسوم البرامج»: the calculator and the fee tables of every program; every price is editable.
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import FeeCalculator from "@/components/programFees/FeeCalculator.vue";
import FeeTiersTable from "@/components/programFees/FeeTiersTable.vue";
import FeeItemsTable from "@/components/programFees/FeeItemsTable.vue";
import { money } from "@/utils/programFees";

const { t } = useI18n();
const toast = useToast();

const tiers = ref([]);
const items = ref([]);
const settings = ref({});
const draft = ref({});
const loading = ref(true);
const tab = ref("calculator");

async function load() {
  const { data } = await axios.get("api/program-fees");
  tiers.value = data.data.tiers;
  items.value = data.data.items;
  settings.value = data.data.settings;
  draft.value = { ...data.data.settings };
  loading.value = false;
}

const tiersOf = (program) => tiers.value.filter((tier) => tier.program === program);
const itemsOf = (category) => items.value.filter((item) => item.category === category);
const firstDayTier = computed(() => tiersOf("day")[0]?.sessions);

async function saveSetting(key) {
  await axios.put("api/program-fees/settings", { [key]: draft.value[key] });
  toast.add({ severity: "success", summary: t("success_message"), detail: t("fees_saved"), life: 2500 });
  await load();
}

onMounted(load);
</script>

<template>
  <div>
    <p class="text-xl p-4 text-[#135C65] font-bold">{{ $t("program_fees") }}</p>
  </div>
  <div class="sawa-card p-3">
    <div v-if="loading" class="flex justify-center p-5"><i class="pi pi-spin pi-spinner text-2xl" /></div>
    <Tabs v-else v-model:value="tab" scrollable>
      <TabList>
        <Tab value="calculator"><i class="pi pi-calculator mx-1" />{{ $t("fees_calculator") }}</Tab>
        <Tab value="day">{{ $t("fees_day") }}</Tab>
        <Tab value="clinics">{{ $t("fees_clinics") }}</Tab>
        <Tab value="clinics_extra">{{ $t("fees_clinics_extra") }}</Tab>
        <Tab value="inclusion">{{ $t("fees_inclusion") }}</Tab>
        <Tab value="evaluation">{{ $t("fees_evaluation") }}</Tab>
        <Tab value="individual">{{ $t("fees_individual") }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="calculator">
          <FeeCalculator :items="items" />
        </TabPanel>

        <TabPanel value="day">
          <Message severity="info" size="small" class="mb-3">
            {{ $t("fees_day_rule", { price: money(settings.day_extra_weekly_session), min: firstDayTier ?? "-" }) }}
          </Message>
          <FeeTiersTable program="day" :tiers="tiersOf('day')" @saved="load" />
          <div class="flex flex-wrap items-end gap-2 my-4">
            <div class="flex flex-column gap-1">
              <label for="fees-extra-weekly">{{ $t("fees_extra_weekly_session") }}</label>
              <InputNumber v-model="draft.day_extra_weekly_session" inputId="fees-extra-weekly" :min="0" :maxFractionDigits="2" />
            </div>
            <Button icon="pi pi-check" :label="$t('submit')" @click="saveSetting('day_extra_weekly_session')" />
          </div>
          <p class="font-bold my-2">{{ $t("fees_day_transport") }}</p>
          <FeeItemsTable category="day_transport" :items="itemsOf('day_transport')" @saved="load" />
        </TabPanel>

        <TabPanel value="clinics">
          <Message severity="info" size="small" class="mb-3">{{ $t("fees_clinics_rule") }}</Message>
          <FeeTiersTable program="clinics" :tiers="tiersOf('clinics')" :usdRate="settings.usd_rate" @saved="load" />
          <div class="flex flex-wrap items-end gap-2 mt-4">
            <div class="flex flex-column gap-1">
              <label for="fees-usd-rate">{{ $t("fees_usd_rate") }}</label>
              <InputNumber v-model="draft.usd_rate" inputId="fees-usd-rate" :min="0.0001" :maxFractionDigits="4" />
            </div>
            <Button icon="pi pi-check" :label="$t('submit')" @click="saveSetting('usd_rate')" />
          </div>
        </TabPanel>

        <TabPanel value="clinics_extra">
          <Message severity="info" size="small" class="mb-3">{{ $t("fees_clinics_extra_rule") }}</Message>
          <FeeTiersTable program="clinics_extra" :tiers="tiersOf('clinics_extra')" @saved="load" />
        </TabPanel>

        <TabPanel value="inclusion">
          <FeeItemsTable category="inclusion" :items="itemsOf('inclusion')" @saved="load" />
          <p class="font-bold mt-4 mb-2">{{ $t("fees_inclusion_transport") }}</p>
          <FeeItemsTable category="inclusion_transport" :items="itemsOf('inclusion_transport')" @saved="load" />
        </TabPanel>

        <TabPanel value="evaluation">
          <Message severity="info" size="small" class="mb-3">{{ $t("fees_evaluation_rule") }}</Message>
          <FeeItemsTable category="evaluation" :items="itemsOf('evaluation')" @saved="load" />
        </TabPanel>

        <TabPanel value="individual">
          <FeeItemsTable category="individual" :items="itemsOf('individual')" @saved="load" />
        </TabPanel>
      </TabPanels>
    </Tabs>
    <Toast />
  </div>
</template>
