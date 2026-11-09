// Links the server sends («ما ينتظرك», the approvals inbox, notifications) are written like "/evaluation-approvals?key=e12".
// Most staff pages live under /sawa-admin, so a link that matches no page is tried there before giving up.
export function appLink(router, url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  if (router.resolve(path).matched.length) return path;
  const admin = `/sawa-admin${path}`;
  return router.resolve(admin).matched.length ? admin : path;
}

export function openAppLink(router, url) {
  const target = appLink(router, url);
  if (!target) return;
  if (/^https?:\/\//i.test(target)) window.open(target, "_blank", "noopener");
  else router.push(target);
}
