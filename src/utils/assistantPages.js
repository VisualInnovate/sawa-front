// The dashboard pages the assistant may open: the sidebar's entries, so a page added to, hidden from or removed
// from the menu needs no change to the assistant. [{ name, label, section }]
import { buildMenu, visibleMenu } from "@/components/layout/menu";

const labelOf = (item, t) => item.text ?? t(item.label);

const flatten = (items, t, section = null) =>
  items.flatMap((item) => {
    if (item.children) return flatten(item.children, t, labelOf(item, t));
    const name = item.to?.name;
    return name ? [{ name, label: labelOf(item, t), section }] : [];
  });

/** The pages this employee's menu shows (what the assistant gets with every question). */
export const myMenuPages = (t) => flatten(visibleMenu(buildMenu()), t).filter((page, i, all) => all.findIndex((p) => p.name === page.name) === i);

/** Every menu page, whatever the permissions (for the settings page, to hide some from the assistant). */
export const allMenuPages = (t) =>
  flatten(buildMenu().map(function resolve(item) {
    return item.children ? { ...item, children: item.children.map(resolve) } : { ...item, to: typeof item.to === "function" ? item.to() : item.to };
  }), t).filter((page, i, all) => all.findIndex((p) => p.name === page.name) === i);
