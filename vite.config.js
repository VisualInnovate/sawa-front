import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    // added this vueI18nPlugin to define locales
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./src/locales/*.js"
      ),
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: { api: "modern-compiler" },
    },
  },
  server: {
    port: 3000,
  },
  /**
   * when build can be used to define admin entry point and forntend website entry point
   */
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        // admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
  // build: {
  //   outDir: '../laravel/public'
  // }
});
