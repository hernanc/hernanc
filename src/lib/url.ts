// Base-path-aware URL helper.
//
// Astro does NOT automatically prefix hand-written `href`/`src` strings with
// the configured `base`. Every internal link in this project goes through
// `href()`, so changing `base` in astro.config.mjs (e.g. for sub-path
// hosting or a custom domain) is the only edit ever needed.

const BASE = import.meta.env.BASE_URL; // the configured base path, e.g. "/"

/** Build an internal URL that respects the configured base path. */
export function href(path = '/'): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rest = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`;
  return `${base}${rest}` || '/';
}

/** Resolve a `public/` asset to a base-aware URL. */
export function asset(path: string): string {
  return href(path);
}

/** True when the given path is the current page (for nav highlighting). */
export function isActive(currentPath: string, linkPath: string): boolean {
  const normalize = (p: string) => p.replace(/\/+$/, '') || '/';
  const current = normalize(currentPath);
  const link = normalize(href(linkPath));
  if (link === href('/')) return current === link;
  return current === link || current.startsWith(`${link}/`);
}
