// يركّب على axios محوّلاً (adapter) يرسل كل نداء إلى الخادم الوهمي بدل الشبكة.
// داخل إطار الديمو يُستخدم الخادم الوهمي الذي يملكه الشِّل (window.parent) حتى يرى الهاتف والحاسوب الحالة نفسها؛
// وعند فتح التطبيق وحده يُنشَأ خادم محلي.
import { Backend } from "./backend";

let local = null;

function backend() {
  try {
    if (window.parent !== window && window.parent.__demoBackend) return window.parent.__demoBackend;
  } catch {
    // إطار من أصل آخر: لا شِّل.
  }
  local ??= new Backend();
  return local;
}

export function installDemo(axios) {
  axios.defaults.adapter = async (config) => {
    const url = new URL(config.url ?? "", "http://demo.local/");
    const query = Object.fromEntries(url.searchParams.entries());
    for (const [key, value] of Object.entries(config.params ?? {})) {
      if (value !== undefined) query[key] = value;
    }
    let body = config.data;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { /* نص كما هو */ }
    }
    const res = await backend().handle({
      method: String(config.method ?? "get").toUpperCase(),
      path: url.pathname.replace(/^\/+/, ""),
      query,
      body: body ?? {},
      device: window.name || "app",
    });
    const response = { data: res.data, status: res.status, statusText: res.status < 400 ? "OK" : "Error", headers: {}, config, request: {} };
    if (res.status >= 400) {
      const error = new axios.AxiosError(res.data?.message ?? "Request failed", String(res.status), config, {}, response);
      throw error;
    }
    return response;
  };
}
