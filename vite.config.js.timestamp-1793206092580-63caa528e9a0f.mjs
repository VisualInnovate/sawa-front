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
      // The locale files are plain JS objects that this plugin version does not precompile, so the
      // production build must keep vue-i18n's message compiler (otherwise "{name}" is never filled in).
      runtimeOnly: false,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcc2F3YS1mcm9udFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVXNlclxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXHNhd2EtZnJvbnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VzZXIvRG9jdW1lbnRzL0dpdEh1Yi9zYXdhLWZyb250L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgLy8gYWRkZWQgdGhpcyB2dWVJMThuUGx1Z2luIHRvIGRlZmluZSBsb2NhbGVzXHJcbiAgICBWdWVJMThuUGx1Z2luKHtcclxuICAgICAgLy8gVGhlIGxvY2FsZSBmaWxlcyBhcmUgcGxhaW4gSlMgb2JqZWN0cyB0aGF0IHRoaXMgcGx1Z2luIHZlcnNpb24gZG9lcyBub3QgcHJlY29tcGlsZSwgc28gdGhlXHJcbiAgICAgIC8vIHByb2R1Y3Rpb24gYnVpbGQgbXVzdCBrZWVwIHZ1ZS1pMThuJ3MgbWVzc2FnZSBjb21waWxlciAob3RoZXJ3aXNlIFwie25hbWV9XCIgaXMgbmV2ZXIgZmlsbGVkIGluKS5cclxuICAgICAgcnVudGltZU9ubHk6IGZhbHNlLFxyXG4gICAgICBpbmNsdWRlOiByZXNvbHZlKFxyXG4gICAgICAgIGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICBcIi4vc3JjL2xvY2FsZXMvKi5qc1wiXHJcbiAgICAgICksXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7IGFwaTogXCJtb2Rlcm4tY29tcGlsZXJcIiB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIHdoZW4gYnVpbGQgY2FuIGJlIHVzZWQgdG8gZGVmaW5lIGFkbWluIGVudHJ5IHBvaW50IGFuZCBmb3JudGVuZCB3ZWJzaXRlIGVudHJ5IHBvaW50XHJcbiAgICovXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICAgIC8vIGFkbWluOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FkbWluL2luZGV4Lmh0bWwnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBidWlsZDoge1xyXG4gIC8vICAgb3V0RGlyOiAnLi4vbGFyYXZlbC9wdWJsaWMnXHJcbiAgLy8gfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFvQjtBQUN0VixPQUFPLFNBQVM7QUFDaEIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxTQUFTLGVBQWU7QUFKakMsSUFBTSxtQ0FBbUM7QUFBNEosSUFBTSwyQ0FBMkM7QUFPdFAsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNqQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQTtBQUFBLElBRUosY0FBYztBQUFBO0FBQUE7QUFBQSxNQUdaLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTSxFQUFFLEtBQUssa0JBQWtCO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxRQUFRLGtDQUFXLFlBQVk7QUFBQTtBQUFBLE1BRXZDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFJRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
