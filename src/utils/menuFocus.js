// The sidebar follows the person: their role puts the groups they work in first (and opens the main one), and the
// pages they open most come on top under «الأكثر استخداماً». Usage is counted in this browser, per account.
import { useAuthStore } from "@/stores/Auth";

/** Role (org key, else role name) → the sections' order and the groups' order inside them; `open`: opened at start. */
const FOCUS = {
  therapist: { sections: ["mine", "care", "system"], groups: ["therapeutic", "evaluations", "parents", "consulting"], open: "therapeutic" },
  department_head: { sections: ["mine", "care", "system"], groups: ["evaluations", "therapeutic", "parents", "consulting"], open: "evaluations" },
  deputy_head: { sections: ["mine", "care", "system"], groups: ["evaluations", "therapeutic", "parents", "consulting"], open: "evaluations" },
  consultant: { sections: ["mine", "care", "system"], groups: ["consulting", "evaluations", "parents", "therapeutic"], open: "consulting" },
  programs_manager: { sections: ["care", "mine", "system"], groups: ["consulting", "evaluations", "therapeutic", "parents"], open: "consulting" },
  technical_supervisor: { sections: ["care", "mine", "system"], groups: ["evaluations", "therapeutic", "consulting", "parents"], open: "evaluations" },
  reception: { sections: ["care", "mine", "system"], groups: ["parents", "consulting", "transport", "evaluations"], open: "parents" },
  finance_manager: { sections: ["system", "mine", "care"], groups: ["accounting", "hr"], open: "accounting" },
  hr_manager: { sections: ["system", "mine", "care"], groups: ["hr", "admin", "accounting"], open: "hr" },
  hr_officer: { sections: ["system", "mine", "care"], groups: ["hr", "admin"], open: "hr" },
  transport_manager: { sections: ["care", "mine", "system"], groups: ["transport", "parents"], open: "transport" },
  general_manager: { sections: ["mine", "care", "system"], groups: [] },
};
// Roles outside the structure, by name.
const BY_NAME = { محاسب: "finance_manager", "مدير التشغيل": "general_manager", "ادخال تقييمات": "department_head", "مشرف باص": "transport_manager" };

export function menuFocus() {
  const role = useAuthStore().authUser?.roles ?? {};
  return FOCUS[role.org_key] ?? FOCUS[BY_NAME[role.name]] ?? { sections: ["mine", "care", "system"], groups: [] };
}

const key = () => `menu-usage-${useAuthStore().authUser?.id ?? "x"}`;
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(key()) || "{}") || {};
  } catch {
    return {};
  }
};

/** A page opened: its count goes up; older counts fade so the list follows what the person does now. */
export function recordVisit(name) {
  if (!name) return;
  const usage = read();
  for (const k of Object.keys(usage)) usage[k] *= 0.98;
  usage[name] = (usage[name] ?? 0) + 1;
  try {
    localStorage.setItem(key(), JSON.stringify(usage));
  } catch {
    // this visit only
  }
}

/** The menu's pages the person opens most (at least 3 visits), with their group's icon, best first. */
export function frequentPages(items, limit = 4) {
  const usage = read();
  const leaves = [];
  const walk = (list, icon) => {
    for (const item of list) {
      if (item.children) walk(item.children, item.icon ?? icon);
      else if (item.to?.name && item.key !== "home") leaves.push({ ...item, icon: item.icon ?? icon, key: `fav-${item.to.name}` });
    }
  };
  walk(items, "mdi-star-outline");
  return leaves
    .filter((leaf, i, all) => all.findIndex((x) => x.to.name === leaf.to.name) === i && (usage[leaf.to.name] ?? 0) >= 3)
    .sort((a, b) => usage[b.to.name] - usage[a.to.name])
    .slice(0, limit);
}
