// الديمو التفاعلي (Enable 360): يشغّل واجهة النظام الحقيقية نفسها داخل إطارَي «حاسوب» و«هاتف»، مع خادم وهمي
// داخل المتصفح (demo/mock) بدل الـAPI. يُشغَّل بـ `npx vite --config demo/vite.config.js` ويُبنى بـ
// `npx vite build --config demo/vite.config.js` إلى demo-dist/ (الشِّل على /demo/ والتطبيق على جذر الموقع).
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import base from "../vite.config.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export default {
  ...base,
  root,
  resolve: { alias: { ...(base.resolve?.alias ?? {}), "@demo": resolve(root, "demo/src") } },
  plugins: [
    ...(base.plugins ?? []),
    {
      // الكود الحقيقي لا يُمَس: نلحق بملف axios تركيب المحوّل الوهمي وقت البناء فقط.
      name: "enable360-demo-mock",
      enforce: "pre",
      transform(code, id) {
        if (id.split("\\").join("/").endsWith("/src/axios.js")) {
          return `${code}\nimport { installDemo as __installDemo } from "/demo/mock/install.js";\n__installDemo(axios);\n`;
        }
      },
    },
  ],
  server: { port: 5180, strictPort: true },
  build: {
    outDir: resolve(root, "demo-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        demo: resolve(root, "demo/index.html"),
      },
    },
  },
};
