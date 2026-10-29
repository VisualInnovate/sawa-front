<script setup>
// A daily leave type's rules: the annual leave (its unused days carry over; more days after some years of
// service), a leave given once in the whole service (Hajj), and its pay: paid, unpaid (taken from the salary), or
// paid only up to some days a year (sick leave: the days beyond are taken from the salary).
const leave = defineModel({ type: Object, required: true });
</script>

<template>
  <div class="flex flex-column gap-3 py-2">
    <div class="flex items-center gap-2">
      <Checkbox v-model="leave.is_annual" inputId="lt-annual" binary @update:modelValue="(v) => v && (leave.once_per_service = false)" />
      <label for="lt-annual">{{ $t("lvt.is_annual") }}</label>
    </div>
    <div v-if="leave.is_annual" class="flex flex-wrap items-center gap-2 ps-4">
      <span>{{ $t("lvt.after") }}</span>
      <InputNumber v-model="leave.more_after_years" :min="1" :max="50" showButtons class="w-7rem" :aria-label="$t('lvt.years')" :suffix="` ${$t('lvt.years')}`" />
      <span>{{ $t("lvt.becomes") }}</span>
      <InputNumber v-model="leave.more_days" :min="1" :max="365" showButtons class="w-7rem" :aria-label="$t('lvt.days')" :suffix="` ${$t('lvt.days')}`" />
      <small class="text-color-secondary w-full">{{ $t("lvt.more_hint") }}</small>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox v-model="leave.once_per_service" inputId="lt-once" binary @update:modelValue="(v) => v && (leave.is_annual = false)" />
      <label for="lt-once">{{ $t("lvt.once") }}</label>
    </div>
    <div v-if="!leave.is_annual" class="flex flex-column gap-2">
      <div class="flex items-center gap-2">
        <Checkbox v-model="leave.unpaid" inputId="lt-unpaid" binary @update:modelValue="(v) => v && (leave.paid_days_per_year = null)" />
        <label for="lt-unpaid">{{ $t("lvt.unpaid") }}</label>
      </div>
      <div v-if="!leave.unpaid" class="flex flex-wrap items-center gap-2">
        <span>{{ $t("lvt.paid_up_to") }}</span>
        <InputNumber v-model="leave.paid_days_per_year" :min="0" :max="365" showButtons class="w-8rem" :aria-label="$t('lvt.days')" :suffix="` ${$t('lvt.days')}`" />
        <small class="text-color-secondary w-full">{{ $t("lvt.paid_up_to_hint") }}</small>
      </div>
    </div>
  </div>
</template>
