<script setup>
// The automatic scheduling criteria in priority order: each one only decides between the choices the ones above it
// left equal. Arrows move a criterion up or down; a switch turns it off. Used for the default order («أوقات البرامج»)
// and for one program's own order.

const criteria = defineModel({ type: Array, required: true });
defineProps({
  disabled: { type: Boolean, default: false },
});

function move(index, by) {
  const next = [...criteria.value];
  [next[index], next[index + by]] = [next[index + by], next[index]];
  criteria.value = next;
}

function toggle(index, enabled) {
  criteria.value = criteria.value.map((row, i) => (i === index ? { ...row, enabled } : row));
}
</script>

<template>
  <ol class="flex flex-column gap-2 list-none p-0 m-0">
    <li v-for="(row, index) in criteria" :key="row.key" class="flex items-center gap-3 border border-[#EEF1F2] rounded-lg p-2"
      :class="row.enabled ? '' : 'opacity-60'">
      <span class="w-7 h-7 shrink-0 rounded-full bg-[#E8F1F2] text-[#135C65] font-bold flex items-center justify-center">{{ index + 1 }}</span>
      <div class="flex flex-column grow min-w-0">
        <span class="font-semibold">{{ $t(`sched.${row.key}`) }}</span>
        <small class="text-color-secondary">{{ $t(`sched.${row.key}_hint`) }}</small>
      </div>
      <ToggleSwitch :modelValue="row.enabled" :disabled="disabled" :aria-label="$t(`sched.${row.key}`)" @update:modelValue="toggle(index, $event)" />
      <div class="flex gap-1">
        <Button icon="pi pi-arrow-up" size="small" variant="text" :disabled="disabled || index === 0" v-tooltip.top="$t('sched.move_up')"
          :aria-label="$t('sched.move_up')" @click="move(index, -1)" />
        <Button icon="pi pi-arrow-down" size="small" variant="text" :disabled="disabled || index === criteria.length - 1" v-tooltip.top="$t('sched.move_down')"
          :aria-label="$t('sched.move_down')" @click="move(index, 1)" />
      </div>
    </li>
  </ol>
  <small v-if="!criteria.some((row) => row.enabled)" class="text-orange-600">{{ $t("sched.none_enabled") }}</small>
</template>
