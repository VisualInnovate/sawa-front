// حالة التخصيص في الشِّل: تقرأ من localStorage وتكتب فيه (فيلتقطها الإطاران عبر حدث storage) وتطبّقها على رموز الشِّل.
import { computed, ref } from "vue";
import { applyShellBrand, DEFAULT_BRAND, fileToLogo, isDefaultBrand, readBrand, writeBrand } from "../../brand/brand.js";

export type Brand = { logo: string | null; primary: string; secondary: string };

const brand = ref<Brand>(readBrand());
let applied = false;

function commit(next: Brand) {
  brand.value = writeBrand(next);
  applyShellBrand(brand.value);
}

export function useBrand() {
  if (!applied) { applied = true; applyShellBrand(brand.value); }
  return {
    brand: computed(() => brand.value),
    isDefault: computed(() => isDefaultBrand(brand.value)),
    async setLogo(file: File | null) { commit({ ...brand.value, logo: file ? await fileToLogo(file) : null }); },
    setColors(c: Partial<Pick<Brand, "primary" | "secondary">>) { commit({ ...brand.value, ...c }); },
    reset() { commit({ ...DEFAULT_BRAND }); },
  };
}
