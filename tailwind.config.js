import { tailwindBrandColors } from "./src/utils/brandPalette.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    // The brand shades follow «إعدادات الموقع»: text-bp-1c6772, bg-bs-b21553/10 (utils/brandPalette.js).
    extend: { colors: tailwindBrandColors },
  },
  plugins: [require("flowbite/plugin")],
};
