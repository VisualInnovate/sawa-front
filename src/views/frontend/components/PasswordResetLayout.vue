<script setup>
// Shared frame of the two parent "reset password" steps.
defineProps({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>

<template>
  <section class="reset-page">
    <div class="reset-card">
      <div class="reset-icon" aria-hidden="true">
        <i class="pi pi-lock" />
      </div>
      <p class="reset-kicker">{{ $t("pwreset.kicker") }}</p>
      <h1 class="reset-title">{{ title }}</h1>
      <p v-if="subtitle" class="reset-subtitle">{{ subtitle }}</p>

      <ol class="reset-steps" :aria-label="$t('pwreset.steps_label')">
        <li :class="{ current: step === 1, done: step > 1 }" :aria-current="step === 1 ? 'step' : undefined">
          <span class="dot">{{ step > 1 ? "✓" : 1 }}</span>
          {{ $t("pwreset.step_email") }}
        </li>
        <li class="line" aria-hidden="true" />
        <li :class="{ current: step === 2 }" :aria-current="step === 2 ? 'step' : undefined">
          <span class="dot">2</span>
          {{ $t("pwreset.step_new_password") }}
        </li>
      </ol>

      <slot />

      <div class="reset-links">
        <router-link :to="{ name: 'parentLogin' }">
          <i class="pi pi-arrow-right rtl-flip" aria-hidden="true" />
          {{ $t("pwreset.back_to_login") }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reset-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  background: linear-gradient(160deg, #eef8f9 0%, #ffffff 55%, #f6f6ee 100%);
}
.reset-card {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(19, 92, 101, 0.1);
  padding: 2rem 1.75rem;
  text-align: center;
}
.reset-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eef8f9;
  color: #135c65;
  font-size: 1.6rem;
}
.reset-kicker {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
}
.reset-title {
  margin: 0.25rem 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #135c65;
}
.reset-subtitle {
  margin: 0 0 1.25rem;
  color: #475569;
  line-height: 1.8;
}
.reset-steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem;
  padding: 0;
  list-style: none;
  font-size: 0.85rem;
  color: #94a3b8;
}
.reset-steps li:not(.line) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}
.reset-steps .line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
}
.reset-steps .dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid currentColor;
  font-weight: 700;
}
.reset-steps .current {
  color: #135c65;
  font-weight: 700;
}
.reset-steps .current .dot {
  background: #135c65;
  border-color: #135c65;
  color: #fff;
}
.reset-steps .done {
  color: #16a34a;
}
.reset-links {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}
.reset-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #135c65;
  font-weight: 600;
  text-decoration: none;
}
.reset-links a:hover {
  text-decoration: underline;
}
[dir="ltr"] .rtl-flip {
  transform: scaleX(-1);
}
</style>
