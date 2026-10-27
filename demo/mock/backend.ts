// الخادم الوهمي: يوجّه كل نداء (method + path) إلى معالج يقرأ ويكتب في DB ويرجع ما يرجعه الخادم الحقيقي بالشكل نفسه.
import { DB } from "./db";
import { parentRoutes } from "./handlers/parent";
import { commonRoutes } from "./handlers/common";
import { consultingRoutes } from "./handlers/consulting";
import { evaluationRoutes } from "./handlers/evaluation";
import { accountingRoutes } from "./handlers/accounting";
import { reportsRoutes } from "./handlers/reports";
import { programRoutes } from "./handlers/programs";
import { sessionRoutes } from "./handlers/sessions";

export interface Ctx {
  db: DB;
  params: Record<string, string>;
  query: Record<string, any>;
  body: Record<string, any>;
  device: string;
}
export type Handler = (ctx: Ctx) => any;
export interface Route { method: string; pattern: RegExp; keys: string[]; handler: Handler }

export class HttpError extends Error {
  constructor(public status: number, public body: any) { super(body?.message ?? `HTTP ${status}`); }
}

/** يحوّل "api/child/:id/portal/*" إلى تعبير نمطي؛ `*` يلتقط الباقي. */
export function route(method: string, path: string, handler: Handler): Route {
  const keys: string[] = [];
  const pattern = path.split("/").map((seg) => {
    if (seg.startsWith(":")) { keys.push(seg.slice(1)); return "([^/]+)"; }
    if (seg === "*") { keys.push("rest"); return "(.*)"; }
    return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("/");
  return { method, pattern: new RegExp(`^${pattern}/?$`), keys, handler };
}

export class Backend {
  db = new DB();
  routes: Route[] = [...commonRoutes, ...parentRoutes, ...consultingRoutes, ...evaluationRoutes, ...accountingRoutes, ...reportsRoutes, ...programRoutes, ...sessionRoutes];
  /** النداءات التي لا معالج لها (للتطوير): تظهر في الكونسول وترجع {} حتى لا تتعطل الصفحة. */
  unknown: string[] = [];
  latency = 90;
  /** يُستدعى بعد كل تغيير حتى يحدّث الشِّل عدّاداته. */
  onChange: (() => void) | null = null;

  async handle(req: { method: string; path: string; query: Record<string, any>; body: Record<string, any>; device: string }) {
    await new Promise((r) => setTimeout(r, this.latency));
    for (const r of this.routes) {
      if (r.method !== req.method && r.method !== "ANY") continue;
      const m = r.pattern.exec(req.path);
      if (!m) continue;
      const params: Record<string, string> = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1] ?? "")));
      try {
        const data = r.handler({ db: this.db, params, query: req.query, body: req.body ?? {}, device: req.device });
        if (req.method !== "GET") this.onChange?.();
        return { status: 200, data: data ?? {} };
      } catch (e) {
        if (e instanceof HttpError) return { status: e.status, data: e.body };
        console.error("[demo mock]", req.method, req.path, e);
        return { status: 500, data: { message: String(e) } };
      }
    }
    const key = `${req.method} ${req.path}`;
    if (!this.unknown.includes(key)) { this.unknown.push(key); console.warn("[demo mock] no handler:", key, req.query, req.body); }
    return { status: 200, data: { data: [] } };
  }
}
