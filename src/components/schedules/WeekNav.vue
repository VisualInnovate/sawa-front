<script setup>
// Previous / this / next week and a date to jump to; v-model is the week's Sunday.
import moment from "moment";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { isRtlLang } from "@/utils/direction";
import { weekStart } from "@/utils/schedules";

const model = defineModel({ type: Date, required: true });
defineProps({ loading: { type: Boolean, default: false } });
defineEmits(["refresh", "print"]);

const { locale } = useI18n();
const rtl = computed(() => isRtlLang(locale.value));
const label = computed(() => `${moment(model.value).format("DD/MM/YYYY")} – ${moment(model.value).add(6, "days").format("DD/MM/YYYY")}`);
const move = (weeks) => { model.value = moment(model.value).add(weeks, "weeks").toDate(); };
const pick = (value) => { if (value) model.value = weekStart(value); };
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- The «previous» arrow points back in the reading direction. -->
    <Button :icon="rtl ? 'pi pi-angle-right' : 'pi pi-angle-left'" variant="outlined" size="small" v-tooltip.top="$t('sch.prev_week')" :aria-label="$t('sch.prev_week')" @click="move(-1)" />
    <Button size="small" variant="outlined" :label="$t('sch.this_week')" @click="model = weekStart()" />
    <Button :icon="rtl ? 'pi pi-angle-left' : 'pi pi-angle-right'" variant="outlined" size="small" v-tooltip.top="$t('sch.next_week')" :aria-label="$t('sch.next_week')" @click="move(1)" />
    <DatePicker :modelValue="model" dateFormat="yy-mm-dd" showIcon iconDisplay="input" :manualInput="false" class="w-40" :aria-label="$t('sch.pick_week')"
      @update:modelValue="pick" />
    <span class="font-semibold text-bp-135c65 whitespace-nowrap">{{ label }}</span>
    <Button icon="pi pi-refresh" variant="outlined" size="small" :loading="loading" v-tooltip.top="$t('refresh')" :aria-label="$t('refresh')" @click="$emit('refresh')" />
    <Button icon="pi pi-print" size="small" :label="$t('sch.print')" @click="$emit('print')" />
  </div>
</template>
