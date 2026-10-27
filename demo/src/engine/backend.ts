// نسخة الخادم الوهمي التي يملكها الشِّل؛ الإطاران يصلان إليها عبر window.parent.__demoBackend.
import { Backend } from "../../mock/backend";

export const backend = new Backend();
(window as any).__demoBackend = backend;
