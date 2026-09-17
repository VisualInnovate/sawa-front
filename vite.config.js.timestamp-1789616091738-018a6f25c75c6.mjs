// vite.config.js
import { defineConfig } from "file:///C:/Users/User/Documents/GitHub/sawa-front/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/User/Documents/GitHub/sawa-front/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueI18nPlugin from "file:///C:/Users/User/Documents/GitHub/sawa-front/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
var __vite_injected_original_dirname = "C:\\Users\\User\\Documents\\GitHub\\sawa-front";
var __vite_injected_original_import_meta_url = "file:///C:/Users/User/Documents/GitHub/sawa-front/vite.config.js";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  plugins: [
    vue(),
    // added this vueI18nPlugin to define locales
    VueI18nPlugin({
      include: resolve(
        dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
        "./src/locales/*.js"
      )
    })
  ],
  css: {
    preprocessorOptions: {
      scss: { api: "modern-compiler" }
    }
  },
  server: {
    port: 3e3
  },
  /**
   * when build can be used to define admin entry point and forntend website entry point
   */
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
        // admin: resolve(__dirname, 'admin/index.html'),
      }
    }
  }
  // build: {
  //   outDir: '../laravel/public'
  // }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcc2F3YS1mcm9udFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlclxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXHNhd2EtZnJvbnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXdhLWZyb250L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgLy8gYWRkZWQgdGhpcyB2dWVJMThuUGx1Z2luIHRvIGRlZmluZSBsb2NhbGVzXHJcbiAgICBWdWVJMThuUGx1Z2luKHtcclxuICAgICAgaW5jbHVkZTogcmVzb2x2ZShcclxuICAgICAgICBkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICAgXCIuL3NyYy9sb2NhbGVzLyouanNcIlxyXG4gICAgICApLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2NzczogeyBhcGk6IFwibW9kZXJuLWNvbXBpbGVyXCIgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiB3aGVuIGJ1aWxkIGNhbiBiZSB1c2VkIHRvIGRlZmluZSBhZG1pbiBlbnRyeSBwb2ludCBhbmQgZm9ybnRlbmQgd2Vic2l0ZSBlbnRyeSBwb2ludFxyXG4gICAqL1xyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiaW5kZXguaHRtbFwiKSxcclxuICAgICAgICAvLyBhZG1pbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdhZG1pbi9pbmRleC5odG1sJyksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLy8gYnVpbGQ6IHtcclxuICAvLyAgIG91dERpcjogJy4uL2xhcmF2ZWwvcHVibGljJ1xyXG4gIC8vIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVQsU0FBUyxvQkFBb0I7QUFDdFYsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsU0FBUyxlQUFlO0FBSmpDLElBQU0sbUNBQW1DO0FBQTRKLElBQU0sMkNBQTJDO0FBT3RQLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUE7QUFBQSxJQUVKLGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTSxFQUFFLEtBQUssa0JBQWtCO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxRQUFRLGtDQUFXLFlBQVk7QUFBQTtBQUFBLE1BRXZDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFJRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
